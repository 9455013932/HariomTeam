import dotenv from "dotenv";

import {app} from './app.js'
// const path = require('path'); 
dotenv.config();



app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

























// app.get('/', (req, res) => {
//     const filePath = path.join(__dirname, '../frontend/login.html');
//     res.sendFile(filePath);
// });



// function queryDatabase(sql, params) {
//     return new Promise((resolve, reject) => {
//         pool.query(sql, params, (error, results) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(results);   
//             }
//         });
//     });
// }


// app.post('/login', async (req, res) => {
//     const { userid, password } = req.body;

//     if (!userid || !password) {
//         return res.status(400).send('Please enter UserId and Password!');  // More specific HTTP status code for client errors
//     }

//     try {
//         const results = await queryDatabase('SELECT * FROM usersadminformsdata WHERE userid = ?', [userid]);
//         if (results.length > 0) {
//             const user = results[0];
//             if (password == user.password) {
//                 req.session.loggedin = true;
//                 req.session.role= user.role;
//                 req.session.userid = userid;
//                 const userIpAddress = req.ip;  // Capturing IP address from the request
//                 const sessionId = req.sessionID;  // Capturing the session ID from the express-session middleware
//                 const startTime = new Date(); 
              

//                 await queryDatabase(
//                     'INSERT INTO userlogtable (userid, ipaddress, starttime, sessionid) VALUES (?, ?, ?, ?)',
//                     [userid, userIpAddress, startTime, sessionId]  // Adding session ID to the database insert query
//                 );
//                 console.log('Log entry added with session ID');
//                 return res.redirect('/Home');

//             } else {
//                 return res.status(401).send('Incorrect Email and/or Password!');
//             }
//         } else {
//             return res.status(401).send('Incorrect Email and/or Password!');
//         }
//     } catch (error) {
//         console.error('Database query error', error);
//         return res.status(500).send('A database error occurred, please try again later.');
//     }
// });


// app.get('/nathani', (req, res) => {
//     if (req.session.loggedin) {
//         res.json({
//             loggedin: true,
//             userid: req.session.userid,
//             role: req.session.role,
//             ipaddress: req.ip
//         });
//     } else {
//         res.json({
//             loggedin: false
//         });
//     }
// });


// app.get('/Home', (req, res) => {
//     if (req.session.loggedin) {
//         const filePath = path.join(__dirname, '../frontend/Home.html');
//          res.sendFile(filePath);

//     } else {
//         res.send('Please login to view this page!');
//     }
// });


// app.get('/userForm', (req, res) => {
//     if (req.session.loggedin) {
//         const filePath = path.join(__dirname, '../frontend/userForm.html');
//          res.sendFile(filePath);
//     } else { 
//         res.send('Please login to view this page!');
//     }
// });


// app.get('/hariom', async (req, res) => {
//     if (req.session.loggedin) {
//         try {
//             const results = await queryDatabase('SELECT * FROM usersadminformsdata', []);  // no need to destructure
//             return res.json(results); // Should correctly return the results array
//         } catch (error) {
//             console.error('Database query error', error);
//             return res.status(500).send('A database error occurred.');
//         }
//     } else {
//         res.status(401).send('Please login to view this page!');
//     }
// });

// app.post('/submit-details', async (req, res) => {
//     const { userId, password, confirmPassword, name, mobile1, mobile2, email, address, permissionAccess, role } = req.body;

//     console.log(req.body);
//     if (!userId || !password || !confirmPassword || !name || !mobile1 || !mobile2 || !email || !address || !permissionAccess || !role) {
//         return res.send('Please enter all details!');
//     }

//     try {
//         await queryDatabase(
//             'INSERT INTO usersadminformsdata (userId, password, name, mobile1, mobile2, email, address, permissionAccess, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
//             [userId, password, name, mobile1, mobile2, email, address, permissionAccess, role]
//         );
//         const filePath = path.join(__dirname, '../frontend/userForm.html');
//          res.sendFile(filePath);
//     } catch (error) {
//         console.error('Database query error', error);
//         return res.status(500).send('Database error!');
//     }
// });

// app.get('/logout', (req, res) => {
    
//     const sessionid = req.sessionID;
//     req.session.destroy(async (err) => {
//         if (err) {
//             console.error('Failed to destroy session', err);
//             res.status(500).send('Failed to logout'); 
//             return;
//         }

//         try {
//             const endTime = new Date();
//             await queryDatabase(
//                 'UPDATE userlogtable SET endtime = ? WHERE sessionid = ? ',
//                 [endTime, sessionid]  
//             );
//             console.log('Logut & Log entry updated with end time');
//         } catch (dbErr) {
//             console.error('Database error:', dbErr);
//             res.status(500).send('Database update failed'); 
//             return;
//         }
//         res.redirect('/login'); 
//     });
// });



