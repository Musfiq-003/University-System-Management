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

        const table = 'student_results';
        try {
            const [columns] = await connection.query(`DESCRIBE ${table}`);
            console.log(`\n--- ${table} ---`);
            columns.forEach(c => {
                console.log(`${c.Field} ${c.Type} ${c.Null} ${c.Key} ${c.Default} ${c.Extra}`);
            });
        } catch (err) {
            console.log(`\nTable ${table} error: ${err.message}`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

checkSchema();
