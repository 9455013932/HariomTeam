import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import multer from 'multer';
import fs from 'fs';
import csvParser from 'csv-parser';
import mysql from 'mysql2';
import { pool } from "./db/database.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
  })
);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use(
  session({
    secret: "your-very-secure-secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/send-sms", async (req, res) => {
  // const { name, railwaynum, pwds, mob } = req.body;
  const name = "Hariom";
  const railwaynum = "123";
  const pwds = "123";
  const mob = "8115644226";
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
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the uploads directory exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
// Create the multer instance with the storage configuration
const upload = multer({ storage: storage });


app.post("/addemployeeData",upload.single("file"),(req, res) => {
  
    const filePath = path.join(__dirname, "./uploads", req.file.filename);

    const results = [];
    
    
    fs.createReadStream(filePath)
      .pipe(csvParser()).on("data", (data) => {
        results.push(data);
        // console.log(`Parsed CSV row: ${JSON.stringify(data)}`);
      })
      .on("end", () => {
        // console.log(`Parsed CSV results: ${JSON.stringify(results)}`);

        const query = `
            INSERT IGNORE INTO telecallerdetail (
              sr_no, CreatedDate, LastModifiedDate, ImportedBy, LeadNo, FirstName, LastName, 
              CountryCode, PhoneNo, AlternateCountryCode, 
              AlternatePhoneNo, NoOfAttempts, LeadTags, 
              LastCallEmployee, LastCallTime, LastCallType, LastCallDuration, LastCallNote, AssignTo, LeadStatus, Reminder, CompanyName, Email, Address1, Address2, City, State, Zipcode, Country, Description, Source, Price
            ) VALUES ?
          `;

        const values = results.map((row) => [
          row.sr_no,
          row["Created Date"],
          row["Last Modified Date"],
          row["Imported By"],
          row["Lead No."],
          row["First Name"],
          row["Last Name"],
          row["Country Code"],
          row["Phone Number"],
          row["Alternate Country Code"],
          row["Alternate Phone Number"],
          row["No of Attempts"],
          row["Lead Tags"],
          row["Last Call - Employee"],
          row["Last Call - Call time"],
          row["Last Call - Call Type"],
          row["Last Call - Call Duration"],
          row["Last Call - Note"],
          row["Assign To"],
          row["Lead Status"],
          row["Reminder"],
          row["Company Name"],
          row["Email"],
          row["Address 1"],
          row["Address 2"],
          row["City"],
          row["State"],
          row["Zipcode"],
          row["Country"],
          row["Description"],
          row["Source"],
          row["Price"],
        ]);

        console.log(`Values array: ${JSON.stringify(values)}`);

        pool.query(query, [values], (err, results) => {
          if (err) {
            console.error("Error inserting data:", err.stack);
            return res.status(500).json({ message: "Error inserting data" });
          }
          res.json({
            message: "File uploaded and data inserted successfully!",
          });
        });

        fs.unlinkSync(filePath);
      })
      .on("error", (err) => {
        console.error("Error reading CSV file:", err);
        res.status(500).json({ message: "Error reading CSV file" });
      });
  }
);

app.use("/public", express.static(path.join(__dirname, "..", "Public")));

import userRouter from "./routes/user.routes.js";
import formsAdminRouter from "./routes/formsAdmin.routes.js";
import adminRouter from "./routes/admin.routes.js";
import subAdminRouter from "./routes/subAdmin.routes.js";
import qualityStaffRouter from "./routes/qualityStaff.routes.js";
import feedingStaffRouter from "./routes/feedingStaff.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/formsAdmin", formsAdminRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/subAdmin", subAdminRouter);
app.use("/api/v1/qualityStaff", qualityStaffRouter);
app.use("/api/v1/feedingStaff", feedingStaffRouter);

export { app };
