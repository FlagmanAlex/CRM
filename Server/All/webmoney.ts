import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const headers = {
  "accept": "application/json, text/javascript, */*; q=0.01",
  "accept-language": "ru,en;q=0.9,ko;q=0.8,cy;q=0.7",
  "content-type": "application/json",
  "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"YaBrowser\";v=\"25.4\", \"Yowser\";v=\"2.5\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-requested-with": "XMLHttpRequest",
  "cookie": "_culture=ru; _ym_uid=1725712585989527291; _ga_ZZNHY97CHR=GS1.1.1740400261.3.0.1740400261.0.0.0; _ga=GA1.2.1123019973.1725712574; _ym_d=1742104219; _gid=GA1.2.772372368.1747334044; _ym_isad=2; ASP.NET_SessionId=qkr2uqlklt3znfy40hlhqn01; .Exchanger.Web=i84pPOjmSj_QcRgq1Ilj0o10Wo202PSusYzUi3Xo5YAhcS56QS5vBsOAr3RVyA3Baq99N_Yl9jJ041m2wmMr7oPAoXjogAxlCSPp7z-LaKnsD3b5mIPHi04JmPHSRkz83NQi3vr00ifBz6Q7emEhRSbKPLsZJYNdGK3iCG7GaPdiNlQ0R2sBSoffGprwXcxTrWhslqMCw2LuVZb7giISBKtDTOcC69kBU0z7iTOtahIMiWL5pa0nk0PL844GsY02obztjJsjh-nSPJrBks5i-EwTWrk0LJopNznzYlcvkQ89_IkyS0pQxxfQIhqXa0JU7lqEWeSbuI3bgHEYOWjI241dgX7U3L0kSkcVrxYG94UNfB1-wn7extr3u40jME0lCHullDBMdHOrJ6wXHh-RyymOeparlpzLdMPW0kjfU32k6G2oDNp4-mxcVCTa2nu9vm0rc6l2dgQ-rFdJR7wpBYJLNVcuhRSHlcICrIF_7YZenqSX; __RequestVerificationToken=xxgtTw6FTGvvL4B-SY42fZNTpGO____gtMPOMkSimiueqE1N1knswMjhsvX_cHGDvixsD6eUk7YHuMqTRdNJCT6fWdc1; redirect_uri=/emoney/home/all/rub-wmt; _ga_769L0F2G95=GS2.2.s1747475012$o106$g1$t1747475433$j0$l0$h0; _gat=1",
  "Referer": "https://exchanger.money/emoney/home",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}

const BD_TOKEN = process.env.BD_TOKEN

interface IWebmoney {
  date: Date
  RubWmz: number
  WmzUah: number
}

interface IWebmoneyModel extends mongoose.Document, IWebmoney { }

const WebmoneySchema = new mongoose.Schema({
  date: { type: Date, default: () => new Date() },
  RubWmz: { type: Number, required: true },
  WmzUah: { type: Number, required: true }
})

const Webmoney = mongoose.model<IWebmoneyModel>('Webmoney', WebmoneySchema, 'Webmoney')

interface Offer {
  Rate: number;
}

interface ApiResponse {
  Offers: Offer[];
}

async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<any> {
  try {
    const response = await fetch(url, {
      headers,
      method: "GET"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text.trim()) {
      throw new Error('Empty response received');
    }

    return JSON.parse(text);
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying ${url}... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2); // Экспоненциальная задержка
    }
    throw error;
  }
}

async function fetchRates(): Promise<IWebmoney> {
  try {
    const [wmzUahData, rubWmzData] = await Promise.all([
      fetchWithRetry("https://exchanger.money/cards/offers/list/wmz-uah?page=1"),
      fetchWithRetry("https://exchanger.money/emoney/offers/list/rub-wmz?providerId=70&page=1")
    ]);

    // Проверка наличия Offers и Rate
    if (!wmzUahData?.Offers?.[0]?.Rate || !rubWmzData?.Offers?.[0]?.Rate) {
      throw new Error('Invalid API response structure');
    }

    return {
      date: new Date(),
      RubWmz: rubWmzData.Offers[0].Rate,
      WmzUah: wmzUahData.Offers[0].Rate
    };
  } catch (error) {
    console.error('Error in fetchRates:', error);
    throw error;
  }
}

async function saveRates() {
  try {
    const rates = await fetchRates();
    const newCourse = new Webmoney(rates);
    await newCourse.save();
    console.log(`[${new Date().toISOString()}] Rates saved:`, {
      RubWmz: rates.RubWmz,
      WmzUah: rates.WmzUah,
      Course: (rates.RubWmz / rates.WmzUah).toFixed(2)
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error saving rates:`, error);
  }
}

async function main() {
  try {
    if (BD_TOKEN) mongoose.connect(BD_TOKEN, { dbName: process.env.BD_NAME_MVOK })
      .then(() => { console.log('Соединение с базой MongoDB прошло успешно') })
      .catch(e => console.log(`Ошибка подключения к MongoDB: ${e.message}`))

    // Первое сохранение при запуске
    await saveRates();

    // Устанавливаем интервал на каждый час
    const interval = setInterval(saveRates, 5 * 60 * 1000); // 1 час = 60 мин * 60 сек * 1000 мс

    // Обработка завершения работы приложения
    process.on('SIGINT', async () => {
      clearInterval(interval);
      await mongoose.disconnect();
      console.log('Application terminated');
      process.exit(1);
    });

  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
}

main();
