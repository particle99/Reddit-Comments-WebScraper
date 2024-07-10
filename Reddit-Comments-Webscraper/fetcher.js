/** Reddit user comments scraper */

const { Worker, parentPort: thread } = require("node:worker_threads"),
    fetch = require("node-fetch"),
    path = require("path");

thread.on("message", async(user) => {
    /** Request options (headers) */
    const options = {
        hostname: 'www.reddit.com',
        method: "GET",
        path: `/user/${user}/comments/`,
        headers: {
            'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
            'Accept-Encoding': `gzip, deflate, br, zstd`,
            'Accept-Language': `en-US,en;q=0.9`,
            'Cache-Control': `no-cache`,
            'Cookie': `edgebucket=FDjProPQxPENaKgGKL; loid=00000000144w3jma7e.2.1720469566768.Z0FBQUFBQm1qRWctczhRRWZiNERTREdPRU9BTHJsSHltVjRzNzFDNUJpeGhWNmdteWpLa3dKY3luV0lpZEo5VUt2aWY1WTVDRE96NE9Va2hrSkhRUEdIWnNoY192ZVJ0bkNjTFNDNjdpSVpHNHZoTmVYVHBVc1lvNFV4NWNZZGRfeDI0bTExTHJYMlM; token_v2=eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJsb2lkIiwiZXhwIjoxNzIwNTU1OTY2Ljc2OTE3MSwiaWF0IjoxNzIwNDY5NTY2Ljc2OTE3MSwianRpIjoiOWNLNHJfUXdDOXh5VUVOSkRjN1NOVklqejBQbUFRIiwiY2lkIjoiMFItV0FNaHVvby1NeVEiLCJsaWQiOiJ0Ml8xNDR3M2ptYTdlIiwibGNhIjoxNzIwNDY5NTY2NzY4LCJzY3AiOiJlSnhra2RHT3REQUloZC1sMXo3Ql95cF9OaHRzY1lhc0xRYW9rM243RFZvY2s3MDdjTDRpSFA4bktJcUZMRTJ1QktHa0tXRUZXdE9VTmlMdjU4eTlPWkVGU3lGVFI4NDN5d29rYVVwUFVtTjVweWxSd1daa0xsZmFzVUtEQjZZcFZTNloyMEtQUzV2UTNJMUZ6MDZNcWx4V0h0VFlvM0pwYkdNSzJ4UGp6Y1pxUXlxdXk2bE1ZRmtvbjhXTGZ2eUctdFktZjdiZmhIWXdyS2dLRF9UT3VGeHdZX0hERkhiX25wcjBiRjJ3cUwzWGc5US0xLU4yN2JObW9kbTVfVnpQdnphU2NUbUc1aWZZdjd0LUNSMTQ1SG1aVVFjd1lnMF95ckFqNl9Ddk9vREtCUVdNSlloUEk1QXJsMl9fSmRpdVRmOGF0eWQtLUdiRVRXXzRyUm1vNXhMRW9VX2o2emNBQVBfX1hEX2U0dyIsImZsbyI6MX0.gM6VyQ5qulZs29cgH5wzFlhhuTBSFdiJB6d1MJy35TDAYrlH-WdhAOxjMs7obN4kMXfTMqQJoM3xSRiPusa9M02OJYx3_pDYQDJDqcXnx49GN_fgcFJnMwOgFw-3x3GsNeeXF694pbzfx8ee3b2xDv6VUWWR5qKCIJQzRZvqjHkAvKqyl1PGLpULi27ox4ouboc6e9DmTef7NX1LXVu5Kp0DRDiUzlAKZZYX_13Mox9KBvSaL2hQhtLxjmCBh4NgzdFgBpddyfZWds-9UevLy0bFPY_TF3Gf3RfxlO1k0B7dQnXu6-tqdbj7IoFCrIv1Sqlm7gedLX3xkHxS84yP5g; csv=2; __stripe_mid=25c7e701-6083-4ecf-a758-e06024ba051adc318a; over18=true; csrf_token=8367171b7c994557480bf47cf4e433ae; __stripe_sid=eed81459-2278-4d29-a5c6-e8e52b062b9ef6f076; session_tracker=mjclpnjfpmkimjmmpb.0.1720537224348.Z0FBQUFBQm1qVkNJQ0pFMDlhOFZwRmNYVVVhaWtPZmVYYVVKZ1owT3BBRUpza3hMRElwTXotMUJhTG5WY2o3REYxYl9PSXlsa0E5bklBbjhNcW0tLU5DUl9MSDhLUDRLR0hROTNWckNwYVpBWG9oTkMwV0RWT3lzekpyQmd3WDFWZWROUS1MWTYydHM`,
            'Pragma': `no-cache`,
            'Priority': `u=0, i`,
            'Sec-Ch-Ua': `"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"`,
            'Sec-Ch-Ua-Mobile': `?0`,
            'Sec-Ch-Ua-Platform': `"Windows"`,
            'Sec-Fetch-Dest': `document`,
            'Sec-Fetch-Mode': `navigate`,
            'Sec-Fetch-Site': `none`,
            'Sec-Fetch-User': `?1`,
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36`
        }
    }

    /** Fetch user data based on user and return Promise */
    async function fetchData(user) {
        return await fetch(`https://www.reddit.com/user/${user}/comments/`, options);
    }

    (async() => {
        /** Fetch data and post raw data to a parser to get the comments */
        await fetchData(user).then(data => data.text()).then(result => {
            const worker = new Worker(path.join(__dirname, "/comment_parser.js"));
            worker.postMessage(result);

            /** Handle any unseen errors */
            worker.on("error", err => console.log(err));
        });
    })();
});