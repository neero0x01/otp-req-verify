import Express from 'express';
import dotenv from 'dotenv';
import Twilio from 'twilio';
import colors from 'colors';

dotenv.config();

const app = Express();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = Twilio(accountSid, authToken);
const PORT = process.env.PORT || 8000;

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.json({ message: 'API is running' })
})

app.post('/api/request-otp', async (req, res) => {
    console.log('incoming', req.body)
    try {
        const resp = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
            .verifications
            .create({to: req.body.phone, channel: 'sms'})
        console.log(res);
        res.json({
            message: resp
        })
    } catch (e) {
        console.log('ERROR: ', e)
    }
})

app.post('/api/verify-otp', async (req, res) => {
    console.log('incoming', req.body)
    const { phone, otp } = req.body;
    try {
        const resp = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
            .verificationChecks
            .create({to: phone, code: otp})
        console.log(res);
        res.json({
            message: resp
        })
    } catch (e) {
        console.log('ERROR: ', e)
    }
})

app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`.green.bold));