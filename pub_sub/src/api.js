import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/notify", async (req, res) => {
    const payload = {
        message: req.body.message,
        createdAt: new Date().toISOString(),
    };
    await publisher.publish("my-channel", JSON.stringify(payload));
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});