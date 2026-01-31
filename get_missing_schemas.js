require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

async function checkSchema() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL');

        const tables = ['notices', 'student_accounts', 'student_results'];

        for (const table of tables) {
            try {
                const [columns] = await connection.query(`SHOW CREATE TABLE ${table}`);
                console.log(`\n--- Schema for ${table} ---`);
                console.log(columns[0]['Create Table']);
            } catch (err) {
                console.log(`\nTable ${table} does not exist or error: ${err.message}`);
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

checkSchema();
