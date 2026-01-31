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

async function seedUsers() {
    let connection;
    try {
        console.log('🌱 Starting user seeding...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL database');

        const saltRounds = 10;

        // Default passwords
        // Note: In a real app, use different passwords. These are for dev/demo.
        const passwords = {
            admin: await bcrypt.hash('Admin@123', saltRounds),
            faculty: await bcrypt.hash('Faculty@123', saltRounds),
            student: await bcrypt.hash('Student@123', saltRounds)
        };

        const users = [
            {
                full_name: 'System Administrator',
                email: 'admin@university.edu',
                password_hash: passwords.admin,
                role: 'admin',
                is_verified: true
            },
            {
                full_name: 'Dr. John Smith',
                email: 'faculty@university.edu',
                password_hash: passwords.faculty,
                role: 'faculty',
                department: 'Computer Science & Engineering',
                designation: 'Professor',
                is_verified: true
            },
            {
                full_name: 'Jane Doe',
                email: 'student@university.edu',
                password_hash: passwords.student,
                role: 'student',
                department: 'Computer Science & Engineering',
                batch: 'D-78A',
                studentId: 'CS2024001',
                is_verified: true
            },
            {
                full_name: 'Test Student',
                email: 'test.student@university.edu',
                password_hash: passwords.student,
                role: 'student',
                department: 'BBA',
                batch: 'BBA-20',
                studentId: 'BBA2024001',
                is_verified: true
            }
        ];

        let inserted = 0;
        let skipped = 0;

        for (const user of users) {
            // Check if user exists
            const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [user.email]);

            if (existing.length === 0) {
                await connection.query(`
          INSERT INTO users (full_name, email, password_hash, role, department, designation, batch, studentId, is_verified)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
                    user.full_name,
                    user.email,
                    user.password_hash,
                    user.role,
                    user.department || null,
                    user.designation || null,
                    user.batch || null,
                    user.studentId || null,
                    user.is_verified
                ]);
                inserted++;
                console.log(`  ✅ Added user: ${user.full_name} (${user.role})`);
            } else {
                skipped++;
                console.log(`  ⚠️  Skipped: ${user.email} (already exists)`);
            }
        }

        console.log(`\nSummary: ${inserted} users added, ${skipped} skipped.`);
        console.log('✅ User seeding completed!');

    } catch (error) {
        console.error('❌ Error seeding users:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

seedUsers();
