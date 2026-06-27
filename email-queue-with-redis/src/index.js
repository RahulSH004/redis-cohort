import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const QUEUE_KEY = 'queue:emails';

app.post("/emails", async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || 'No subject',
        body: req.body.body || 'No body',
        createdAt: new Date().toISOString(),
    }
    await redis.rpush(QUEUE_KEY, JSON.stringify(job));
    res.json({ success: true, job });
})

app.get("/emails/process", async (req, res) => {
    const job = await redis.lpop(QUEUE_KEY);
    if(!job){
        return res.json({ message: "No jobs in the queue" });
    }
    const parsedJob = JSON.parse(job);
    res.json({ success: true, job: parsedJob });
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})