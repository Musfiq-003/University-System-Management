require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

async function migrate() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Check if user_id already exists to avoid errors
        const [columns] = await connection.query("SHOW COLUMNS FROM research_papers LIKE 'user_id'");

        if (columns.length === 0) {
            console.log('Adding user_id column...');
            await connection.query("ALTER TABLE research_papers ADD COLUMN user_id INT NULL");
            await connection.query("ALTER TABLE research_papers ADD INDEX idx_user_id (user_id)");
            await connection.query("ALTER TABLE research_papers ADD CONSTRAINT fk_research_papers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL");
            console.log('Migration successful.');
        } else {
            console.log('user_id column already exists. Skipping...');
        }
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
