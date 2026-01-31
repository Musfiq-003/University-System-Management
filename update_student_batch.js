require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

async function updateStudentBatch() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Update student batch to Batch-91
        const [result] = await connection.query(
            'UPDATE users SET batch = ? WHERE email = ?',
            ['Batch-91', 'student@university.edu']
        );

        console.log(`Updated ${result.changedRows} rows. Student 'student@university.edu' is now in Batch-91.`);

    } catch (error) {
        console.error('Error updating student:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateStudentBatch();
