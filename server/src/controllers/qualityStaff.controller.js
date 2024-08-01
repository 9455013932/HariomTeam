import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { pool } from "../db/database.js";
import { queryDatabase } from "../utils/queryDatabase.js";
import { query } from "express";
import fetch from "node-fetch";
import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs';
// import csvParser from 'csv-parser';
// import mysql from 'mysql2';


const wardwiseVoterContact = asyncHandler(async (req, res) => {
  const { WBId } = req.body;

  if (!WBId) {
    return res.status(400).json({ error: "WBID is required" });
  }
  try {
    const result = await queryDatabase(
      `SELECT COUNT(Id) AS total_records, COUNT( MNo) AS Total_mobile_numbers FROM voterlist WHERE WBId = ?`,
      [WBId]
    );

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).json({ error: "A database error occurred." });
  }
});

const sendSMS = asyncHandler(async (req, res) => {
  const { WBId } = req.body;
  if (!WBId) {
    return res.status(400).json({ error: "WBId is required" });
  }

  try {
    const results = await queryDatabase(
      `SELECT EFName, ELName, HFName, HLName, MNo FROM voterlist WHERE WBId = ?`,
      [WBId]
    );

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No records found for the given WBId" });
    }

    const sendSMSPromises = results.map(async (result) => {
      const { EFName, ELName, MNo } = result;
      const smss = `Dear ${EFName} ${ELName}, your registration is successful in RRC NER for Apprenticeship. Your registration no. is ${MNo} and password is ${MNo}. SISTEK`;

      const encodedMessage = encodeURIComponent(smss);

      const api_url = `http://msg.msgclub.net/rest/services/sendSMS/sendGroupSms?AUTH_KEY=2185e5def263defc28233d2e10bab1&message=${encodedMessage}&senderId=SISTEK&routeId=1&mobileNos=${MNo}&smsContentType=english`;

      try {
        const response = await fetch(api_url);
        const data = await response.json();
        console.log(`Response from SMS API:`, data);

        if (data.responseCode === "3001") {
          return { MNo, status: "success", response: data.response };
        } else {
          throw new Error(JSON.stringify(data));
        }
      } catch (error) {
        console.error(`Error sending SMS to ${MNo}:`, error.message);
        return { MNo, status: "failed", error: error.message };
      }
    });

    const smsResults = await Promise.all(sendSMSPromises);

    const successCount = smsResults.filter(
      (result) => result.status === "success"
    ).length;
    const failedCount = smsResults.filter(
      (result) => result.status === "failed"
    ).length;

    return res.status(200).json({
      message: `SMS sending completed. Success: ${successCount}, Failed: ${failedCount}`,
      details: smsResults,
    });
  } catch (error) {
    console.error(`Database error:`, error.message);
    return res.status(500).json({ error: "A database error occurred." });
  }
});

const employeeDetails = async (req, res) => {
  try {
    const result = await queryDatabase(`SELECT * FROM telecallerdetail`);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).json({ error: "A database error occurred" });
  }
};





export { wardwiseVoterContact, sendSMS, employeeDetails };












// const upload = multer({ dest: 'uploads/' }); // Configure multer with appropriate destination folder

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const addemployeeData = (req, res) => {
//   // Handle file upload with multer
//   upload.single('file')(req, res, (err) => {
//     if (err) {
//       console.error('Error uploading file:', err);
//       return res.status(400).json({ message: 'Error uploading file' });
//     }

//     const filePath = path.join(__dirname, 'uploads', req.file.filename);
//     const results = [];

//     fs.createReadStream(filePath)
//       .pipe(csvParser())
//       .on('data', (data) => {
//         results.push(data);
//         console.log(`Parsed CSV row: ${JSON.stringify(data)}`);
//       })
//       .on('end', () => {
//         console.log(`Parsed CSV results: ${JSON.stringify(results)}`);

//         const query = `
//           INSERT IGNORE INTO telecallerdetail (
//             sr_no, CreatedDate, LastModifiedDate, ImportedBy, LeadNo, FirstName, LastName, 
//             CountryCode, PhoneNo, AlternateCountryCode, 
//             AlternatePhoneNo, NoOfAttempts, LeadTags, 
//             LastCallEmployee, LastCallTime, LastCallType, LastCallDuration, LastCallNote, AssignTo, LeadStatus, Reminder, CompanyName, Email, Address1, Address2, City, State, Zipcode, Country, Description, Source, Price
//           ) VALUES ?
//         `;

//         const values = results.map(row => [
//           row.sr_no,
//           row['Created Date'],
//           row['Last Modified Date'],
//           row['Imported By'],
//           row['Lead No.'],
//           row['First Name'],
//           row['Last Name'],
//           row['Country Code'],
//           row['Phone Number'],
//           row['Alternate Country Code'],
//           row['Alternate Phone Number'],
//           row['No of Attempts'],
//           row['Lead Tags'],
//           row['Last Call - Employee'],
//           row['Last Call - Call time'],
//           row['Last Call - Call Type'],
//           row['Last Call - Call Duration'],
//           row['Last Call - Note'],
//           row['Assign To'],
//           row['Lead Status'],
//           row['Reminder'],
//           row['Company Name'],
//           row['Email'],
//           row['Address 1'],
//           row['Address 2'],
//           row['City'],
//           row['State'],
//           row['Zipcode'],
//           row['Country'],
//           row['Description'],
//           row['Source'],
//           row['Price'],
//         ]);

//         console.log(`Values array: ${JSON.stringify(values)}`);

//         pool.query(query, [values], (err, dbResults) => {
//           if (err) {
//             console.error('Error inserting data:', err.stack);
//             return res.status(500).json({ message: 'Error inserting data' });
//           }
//           res.json({ message: 'File uploaded and data inserted successfully!', dbResults });
//         });

//         // Cleanup: Delete the uploaded file after processing
//         fs.unlinkSync(filePath);
//       })
//       .on('error', (err) => {
//         console.error('Error reading CSV file:', err);
//         res.status(500).json({ message: 'Error reading CSV file' });
//       });
//   });
// };
// export { wardwiseVoterContact, sendSMS, employeeDetails, addemployeeData };
