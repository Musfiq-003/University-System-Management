require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

const sampleCourses = [
    { code: 'CSE311', title: 'Database Systems', credit: 3.0, department: 'Computer Science & Engineering' },
    { code: 'CSE312', title: 'Software Engineering', credit: 3.0, department: 'Computer Science & Engineering' },
    { code: 'CSE313', title: 'Computer Networks', credit: 3.0, department: 'Computer Science & Engineering' },
    { code: 'GED201', title: 'Professional Ethics', credit: 2.0, department: 'General' },
    { code: 'EEE101', title: 'Electrical Circuits', credit: 3.0, department: 'Electrical Engineering' }
];

const sampleNotices = [
    { title: 'Spring 2026 Semester Begins', content: 'Welcome back! Classes start from Jan 31st.', publish_date: '2026-01-31' },
    { title: 'Tuition Fee Payment Deadline', content: 'Last date for payment without fine is Feb 15.', publish_date: '2026-02-05' },
    { title: 'Library Renovation', content: 'The central library will remain closed on Friday.', publish_date: '2026-02-10' }
];

async function seedDashboardData() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // 1. Seed Courses
        for (const course of sampleCourses) {
            await connection.query(
                'INSERT IGNORE INTO courses (course_code, title, credit, department) VALUES (?, ?, ?, ?)',
                [course.code, course.title, course.credit, course.department]
            );
        }
        console.log('✅ Courses seeded.');

        // 2. Seed Notices
        for (const notice of sampleNotices) {
            await connection.query(
                'INSERT INTO notices (title, content, publish_date) VALUES (?, ?, ?)',
                [notice.title, notice.content, notice.publish_date]
            );
        }
        console.log('✅ Notices seeded.');

        // 3. Seed Student Data (Find some students first)
        const [students] = await connection.query("SELECT studentId, email FROM users WHERE role = 'student' AND studentId IS NOT NULL LIMIT 5");

        if (students.length === 0) {
            console.log('⚠️ No students found to seed data for.');
        } else {
            console.log(`Found ${students.length} students. Seeding personal data...`);

            for (const student of students) {
                const sid = student.studentId;

                // Seed Accounts
                await connection.query(
                    `INSERT INTO student_accounts (studentId, payable, paid) 
                     VALUES (?, ?, ?) 
                     ON DUPLICATE KEY UPDATE payable=VALUES(payable), paid=VALUES(paid)`,
                    [sid, 60000.00, 25000.00] // Example amounts
                );

                // Seed Results
                await connection.query(
                    `INSERT INTO student_results (studentId, cgpa, credits_completed) 
                     VALUES (?, ?, ?) 
                     ON DUPLICATE KEY UPDATE cgpa=VALUES(cgpa), credits_completed=VALUES(credits_completed)`,
                    [sid, 3.55, 42.0]
                );

                // Seed Enrollments (CSE students get CSE courses)
                if (sid.startsWith('CS') || true) { // Assign to all found for now
                    await connection.query('DELETE FROM enrollments WHERE studentId = ?', [sid]);
                    const coursesToEnroll = ['CSE311', 'CSE312', 'GED201'];
                    for (const code of coursesToEnroll) {
                        await connection.query(
                            'INSERT INTO enrollments (studentId, course_code, semester) VALUES (?, ?, ?)',
                            [sid, code, 'Spring 2026']
                        );
                    }
                }
            }
            console.log('✅ Student specific data (Accounts, Results, Enrollments) seeded.');
        }

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        if (connection) await connection.end();
    }
}

seedDashboardData();
