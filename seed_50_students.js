require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

const BATCHES = ['Batch-90', 'Batch-78'];
const DEPARTMENT = 'Computer Science & Engineering';
const COURSES_90 = ['0613-301', '0613-302', '0612-302', '0613-303', '0612-303'];
const COURSES_78 = ['CSE-405', 'CSE-406', 'CSE-407', 'CSE-408', 'CSE-411'];

async function seedStudents() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash('password123', saltRounds);
        console.log('Password hashed.');

        for (let i = 1; i <= 50; i++) {
            const isBatch90 = i <= 25;
            const batch = isBatch90 ? 'Batch-90' : 'Batch-78';
            const studentId = isBatch90
                ? `CSE250${100 + i}`    // e.g., CSE250101
                : `CSE260${200 + i}`;   // e.g., CSE260226

            const fullName = `Student ${i} (${batch})`;
            const email = `student${i}@diu.edu.bd`;

            // Insert User
            const [userRes] = await connection.query(
                `INSERT INTO users (
                    full_name, email, password_hash, role, is_verified, 
                    studentId, department, batch, gender, date_of_birth, address, phone_number
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE studentId=values(studentId), batch=values(batch)`,
                [
                    fullName, email, passwordHash, 'student', true,
                    studentId, DEPARTMENT, batch, i % 2 === 0 ? 'Male' : 'Female', '2000-01-01', 'Dhaka, Bangladesh', `017000000${i < 10 ? '0' + i : i}`
                ]
            );

            // Insert Accounts
            await connection.query(
                `INSERT INTO student_accounts (studentId, payable, paid) VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE payable=values(payable)`,
                [studentId, 60000, Math.floor(Math.random() * 40000)]
            );

            // Insert Results
            const randomCGPA = (Math.random() * (4.00 - 2.50) + 2.50).toFixed(2);
            await connection.query(
                `INSERT INTO student_results (studentId, cgpa, credits_completed) VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE cgpa=values(cgpa)`,
                [studentId, randomCGPA, isBatch90 ? 60 : 110]
            );

            // Enrollments
            const courses = isBatch90 ? COURSES_90 : COURSES_78;
            await connection.query('DELETE FROM enrollments WHERE studentId = ?', [studentId]);

            for (const code of courses) {
                // Ensure course exists first (optional but good practice, skipping for speed)
                await connection.query(
                    'INSERT IGNORE INTO courses (course_code, title, credit) VALUES (?, ?, ?)',
                    [code, 'Course ' + code, 3.0]
                );

                await connection.query(
                    'INSERT INTO enrollments (studentId, course_code) VALUES (?, ?)',
                    [studentId, code]
                );
            }
        }

        console.log('✅ Successfully seeded 50 mock students with routines and data.');
        console.log('👉 Sample Login: student1@diu.edu.bd / password123');
        console.log('👉 Sample Login: student26@diu.edu.bd / password123');

    } catch (error) {
        console.error('❌ Error seeding students:', error);
    } finally {
        if (connection) await connection.end();
    }
}

seedStudents();
