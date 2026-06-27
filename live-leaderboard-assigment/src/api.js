import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");



app.post("/leaderboard/score", async(req,res) => {
    const payload = {
        id: req.body.id,
        name: req.body.name,
    }
    await redis.zadd("leaderboard", payload.score, JSON.stringify(payload));
    res.json({success: true});
})

app.get("/leaderboard", async(req,res) => {
    const leaderboard  = await redis.zrevrange("leaderboard", 0 , 9, "WITHSCORES");
    const formattedLeaderboard = [];
    for (let i = 0; i < leaderboard.length; i += 2) {
        formattedLeaderboard.push({
            id: JSON.parse(leaderboard[i]).id,
            name: JSON.parse(leaderboard[i]).name,
            score: parseInt(leaderboard[i + 1], 10),
        });
    }
    res.json({leaderboard: formattedLeaderboard});
})

app.get("/leaderboard/:id/rank", async(req,res) => {
    const leaderboard = {
        id: req.params.id,
        name: req.query.name,
    }
    const rank = await redis.zrevrank("leaderboard", JSON.stringify(leaderboard));
    res.json({rank});
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});