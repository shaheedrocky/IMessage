import {CronJob} from 'cron';
import http from 'node:http';
import https from 'node:https';

export const job = new CronJob('*/14 * * * *', function () {
    const base = process.env.FRONTEND_URL;
    if(!base) return;
    const url = new URL('/health', base).href
    const client = url.startsWith('https:') ? https : http


    client.get(url, (res)=>{
        if (res.statusCode === 200) {
            console.log("GET Request sent successfully!😊")
        }else {
            console.log('GET Request failed ❌: ', res.statusCode);
            
        }
    }).on("error", (e)=> console.error("Error while sending request", e))
})