import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const headers = {
  "accept": "application/json, text/javascript, */*; q=0.01",
  "accept-language": "ru,en;q=0.9,ko;q=0.8",
  "content-type": "application/json",
  "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"YaBrowser\";v=\"25.2\", \"Yowser\";v=\"2.5\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-requested-with": "XMLHttpRequest",
  "cookie": "_culture=ru; _ym_uid=1725712585989527291; _ga_ZZNHY97CHR=GS1.1.1740400261.3.0.1740400261.0.0.0; _ga=GA1.2.1123019973.1725712574; _ym_d=1742104219; redirect_uri=/cards/home/wmz/uah; ASP.NET_SessionId=qdpfhwcsqrtitud1lqrasnoz; .Exchanger.Web=6igjtfquEkIBSpT1xh7tQk6oOfxxwNLPQGXEtNHt4qO2a5nV-15Xl3AUftjYyG0gSjfZukYgAUCxAVz8ztEziG5l3uXUcyAftFHyzYFI0TQO4SLbiQctzDzaXf3agIEBHQeDnUpNwb-4rQty3Mn6cxs6XsRWFlARfUvYh5dF9ptq2tqsunuqUkGYR6jCwxDAoQ0SaZ7cD2_Fqpi0ieHuHFWOy3rTngbF2YzE8Odyy4IBN1dDyzs_s2g-p219lNZRQedl3vncX5FMkrx0UVLf1kYefDWEvU6vO3i-K1XO9I1F3_MW8GCsCZDNgDljEnbgdWgD-sfGV-vbmWoz5rT9PBCXYXpphhDsHcfy1DtTmkAH0ZjM0HjP47cj0tcv6vPEzXG5XSeQ-aPeEu35jUkMSsXCBCj0aP9-EWczJoLAY-UWTmDt971PFBdqxhSqCDE3MFGVSdUZ5Gxa_t5TyzClWRW7uQ8HCPkDYdwKJIV9hbWucDXO-pnPyeljE7iItkf1fYjNWA; __RequestVerificationToken=MTk9fWqZfK1IRzuglaQyKbIZLqbEflo2TbzCyHZI_hs6E8rSUAt6Y2fSrv3AkuJrU5Nyoh_sep5-Mqv-g93ra0tgmZ01; _ym_isad=2; _gid=GA1.2.1597687467.1745410055; _gat=1; _ga_769L0F2G95=GS1.2.1745410055.87.0.1745410055.0.0.0",
  "Referer": "https://exchanger.money/cards/home/wmz/uah",
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

