import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use(session({
    secret: 'your-very-secure-secret',
    resave: false,
    saveUninitialized: true
}));


app.post('/send-sms', async (req, res) => {
    // const { name, railwaynum, pwds, mob } = req.body;
    const name="Hariom";
    const railwaynum = "123";
    const pwds = "123";
    const mob="8115644226";
    const smss = `Dear ${name} your registration is successful in RRC NER for Apprenticeship your registration no. is ${railwaynum} and password is ${pwds}. SISTEK`;
    
    const mainsms2 = encodeURIComponent(smss);
    console.log(mainsms2);
    const api_url = `http://msg.msgclub.net/rest/services/sendSMS/sendGroupSms?AUTH_KEY=2185e5def263defc28233d2e10bab1&message=${mainsms2}&senderId=SISTEK&routeId=1&mobileNos=${mob}&smsContentType=english`;

    try {
        const response = await fetch(api_url);
        const data = await response.text();
        const ret = data.split(":");
    
        if (ret[0] !== "OK") {
            return res.status(400).json({ error: data });
        } else {
            return res.status(200).json({ message: "SMS sent successfully" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }});


app.use('/public', express.static(path.join(__dirname, '..', 'Public')));

import userRouter from './routes/user.routes.js';
import formsAdminRouter from './routes/formsAdmin.routes.js';
import adminRouter from './routes/admin.routes.js';
import subAdminRouter from './routes/subAdmin.routes.js';
import qualityStaffRouter from './routes/qualityStaff.routes.js';
import feedingStaffRouter from './routes/feedingStaff.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/formsAdmin", formsAdminRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/subAdmin", subAdminRouter);
app.use("/api/v1/qualityStaff", qualityStaffRouter);
app.use("/api/v1/feedingStaff", feedingStaffRouter);

export { app };