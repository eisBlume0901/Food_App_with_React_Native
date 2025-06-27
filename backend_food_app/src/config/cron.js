import cron from "crons";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function ()
{
    https
    .get(process.env.API_URL, (res) => {
        if (res.statuCode === 200) 
        {
            console.log("GET Request sent successfully!");
        } 
        else 
        {
            console.log("Error while sending request", e);
        }
    })
    .on("error", (e) => console.error("Error while sending request", e));
})

// CRON stands for "Chronograph" and is used to schedule tasks at fixed intervals.
// Counterpart in Django Framework is Celery Beat
// CRON is helpful to bypass limitations of serverless functions 
// by sending a GET API Request, in this case, to Render.com

// * 14 * * * * = Every 14 minutes
// * 0 0 * * 0 = At mighnight, every Sunday 
// * 30 3 15 * * = At 3:30 AM, on the 15th of every month
/
// Format: Seconds Minutes Hours DayOfMonth Month DayOfWeek

