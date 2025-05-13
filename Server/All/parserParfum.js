const axios = require('axios');
const cheerio = require('cheerio');

// Функция для получения и вывода всего HTML
async function fetchFullHtml(url) {
    try {
        // Запрос HTML страницы
        const { data } = await axios.get(url);

        // Загружаем HTML в cheerio для парсинга
        const $ = cheerio.load(data);

        // Получение всего HTML файла
        const fullHtml = $.html();

        // Вывод полного HTML в консоль
        console.log('Полный HTML:', fullHtml);

        return fullHtml;
    } catch (error) {
        console.error('Ошибка при чтении страницы:', error);
    }
}

// Пример вызова функции
const url = 'https://www.essensworld.ru/duhi-dlya-zhenshtin-w185-d326842/';

fetchFullHtml(url).then((html) => {
    console.log('Чтение файла завершено.');
});
