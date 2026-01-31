require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

async function addMissingColumns() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const queries = [
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS designation VARCHAR(50)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS studentId VARCHAR(20)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS batch VARCHAR(20)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(50)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student'"
        ];

        for (const query of queries) {
            try {
                await connection.query(query);
                console.log(`Executed: ${query}`);
            } catch (err) {
                console.log(`Error/Info for ${query}:`, err.message);
            }
        }

        console.log('✅ Database schema checked/updated successfully.');

    } catch (error) {
        console.error('❌ Error updating schema:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addMissingColumns();
