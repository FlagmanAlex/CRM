const axios = require('axios');

const currentTime = new Date().getTime()
const url = `https://ru.iherb.com/catalog/iherblive?isAjax=true&index=51&nop=50&_=${currentTime}`



try {
    axios.get(url, {
        timeout: 5000,
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "ru,en;q=0.9,ko;q=0.8",
            "cache-control": "max-age=0",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"YaBrowser\";v=\"24.10\", \"Yowser\";v=\"2.5\"",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "\"Android\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "iher-pref1=storeid=0&sccode=US&lan=en-US&scurcode=USD&pc=OTI1NzE=&zct=1730913479071; ih-preference=store=0&country=US&language=en-US&currency=USD&wh=RCA; __cf_bm=s8IZ5f.JwzOHINZnRWHwb4oePnKWRXIAkojiE0mrbK4-1730913479-1.0.1.1-6Lt5D50wpUU_hr2KPg8goCTtPZdghKDhHitWr.vM3wqwIgN9IxtcbsslkdxUBORPx6rk1zhOdd0pZws1MDlFa1Eyt9JqASGwy21DD2h1U6s; _cfuvid=9oZvuPuMZPmY8oMm1Sbmt1v8AuwrOPoxSQZOAYYi.1M-1730913479275-0.0.1.1-604800000"
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
    })
    .then(res => {
        console.log(res.data);
    })
    .catch((error) => console.log(error))
    
} catch (error) {
    console.error('Ошибка при чтении страницы:', error);
}
