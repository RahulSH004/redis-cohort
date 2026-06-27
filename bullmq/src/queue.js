import {Queue} from 'bullmq';

export  const connection = {
    host: 'localhost',
    port: 6379,
}
const emailqueue = new Queue('emails', { connection });

export default emailqueue;