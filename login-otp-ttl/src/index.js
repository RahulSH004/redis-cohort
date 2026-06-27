import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otppkey(phone){
    return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(Math.random() * 1000000).toString();
    await redis.set(otppkey(phone), otp, "EX", 60);
    res.json({ otp });
});
app.post("/otp-verify", async (req, res) => {
    const { phone, otp } = req.body;
    const storedOtp = await redis.get(otppkey(phone));
    if(!storedOtp){
        return res.status(400).json({ message: "OTP expired or not found" });
    }
    if(storedOtp !== otp){
        return res.status(400).json({ message: "Invalid OTP" });
    }
    
    res.json({ message: "OTP verified successfully" });

    await redis.del(otppkey(phone));
});

app.get("/otp/:phone/ttl", async (req, res) => {

    const ttl = await redis.ttl(otppkey(req.params.phone));
    res.json({ ttl });
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});