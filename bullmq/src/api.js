import express from 'express';
import emailqueue from './queue.js';

const app = express();
app.use(express.json());


app.post('/welcome-email', async (req, res) => {
    const job = emailqueue.add(
        'welcome-email', 
        {
            to: req.body.to,
            name: req.body.name,
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            }
        }
    );

    res.json({ success: true, job });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});