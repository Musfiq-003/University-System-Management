require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

const createTableSQL = `
CREATE TABLE IF NOT EXISTS routines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course VARCHAR(100) NOT NULL,
  teacher VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  day VARCHAR(20),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  batch VARCHAR(20) NOT NULL,
  room_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_day (day),
  INDEX idx_course (course),
  INDEX idx_batch (batch),
  INDEX idx_department (department)
);
`;

async function fixSchema() {
    let connection;
    try {
        console.log('🔧 Fixing Database Schema...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL');

        // Check if table exists and drop it to be safe (we want a clean slate for the new structure)
        console.log('🗑️  Dropping old routines table...');
        await connection.query('DROP TABLE IF EXISTS routines');

        console.log('✨ Creating new routines table...');
        await connection.query(createTableSQL);

        // Verify columns
        const [columns] = await connection.query('DESCRIBE routines');
        const columnNames = columns.map(c => c.Field);
        console.log('📋 Table Columns:', columnNames.join(', '));

        if (columnNames.includes('day') && columnNames.includes('start_time')) {
            console.log('✅ Schema Fix Applied Successfully!');
        } else {
            console.error('❌ Schema Verification Failed!');
        }

    } catch (error) {
        console.error('❌ Error fixing schema:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

fixSchema();
