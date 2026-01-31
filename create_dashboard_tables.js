require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

async function createDashboardTables() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const queries = [
            // 1. Courses Table
            `CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                course_code VARCHAR(20) NOT NULL UNIQUE,
                title VARCHAR(100) NOT NULL,
                credit DECIMAL(3, 1) NOT NULL,
                department VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // 2. Enrollments Table (Links Students to Courses)
            `CREATE TABLE IF NOT EXISTS enrollments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                studentId VARCHAR(20) NOT NULL,
                course_code VARCHAR(20) NOT NULL,
                semester VARCHAR(20),
                status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
                enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (course_code) REFERENCES courses(course_code) ON DELETE CASCADE
            )`,

            // 3. Student Accounts Table (Financials)
            `CREATE TABLE IF NOT EXISTS student_accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                studentId VARCHAR(20) NOT NULL UNIQUE,
                payable DECIMAL(10, 2) DEFAULT 0.00,
                paid DECIMAL(10, 2) DEFAULT 0.00,
                due DECIMAL(10, 2) GENERATED ALWAYS AS (payable - paid) STORED,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`,

            // 4. Student Results Table (CGPA, Credits)
            `CREATE TABLE IF NOT EXISTS student_results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                studentId VARCHAR(20) NOT NULL UNIQUE,
                cgpa DECIMAL(3, 2) DEFAULT 0.00,
                credits_completed DECIMAL(5, 1) DEFAULT 0.0,
                total_credits_required DECIMAL(5, 1) DEFAULT 140.0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`,

            // 5. Notices Table
            `CREATE TABLE IF NOT EXISTS notices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                publish_date DATE,
                target_audience ENUM('all', 'students', 'faculty') DEFAULT 'all',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const query of queries) {
            await connection.query(query);
            console.log('Executed table creation query.');
        }

        console.log('✅ Dashboard tables created successfully.');

    } catch (error) {
        console.error('❌ Error creating tables:', error);
    } finally {
        if (connection) await connection.end();
    }
}

createDashboardTables();
