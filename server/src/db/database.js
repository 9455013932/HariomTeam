import dotenv from "dotenv";
import mysql from 'mysql';

dotenv.config(); // Load environment variables from .env file

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT
});

// To test the connection:
pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
        console.error('Database connection test failed.', error);
    } else {
        console.log('Database connected successfully. ');
    }
});

export { pool };
