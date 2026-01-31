require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

const BATCH_NAME = 'Batch-91';
const DEPT_NAME = 'Computer Science & Engineering';

const teachers = [
    { name: 'Md. Nazmus Sakib', designation: 'Lecturer', department: DEPT_NAME },
    { name: 'Md. Shariful Islam', designation: 'Lecturer', department: DEPT_NAME },
    { name: 'Safwan Ishrak', designation: 'Lecturer', department: DEPT_NAME },
    { name: 'Md. Fazle Rabbi Rizon', designation: 'Lecturer', department: DEPT_NAME },
    { name: 'M. Morsedur Rahman', designation: 'Lecturer', department: DEPT_NAME },
    { name: 'Md. Sifuzzaman', designation: 'Assistant Professor', department: DEPT_NAME }
];

const routines = [
    // Saturday (Room-604)
    { day: 'Saturday', start: '08:30:00', end: '09:45:00', room: 'Room-604', course: 'Information System Management (0612-301)', teacher: 'M. Morsedur Rahman' },
    { day: 'Saturday', start: '09:45:00', end: '11:00:00', room: 'Room-604', course: 'Data Communication (0612-302)', teacher: 'Md. Shariful Islam' },

    // Sunday (Room-604)
    { day: 'Sunday', start: '14:00:00', end: '15:40:00', room: 'Room-604', course: 'Operating System Lab (0613-302)', teacher: 'Md. Nazmus Sakib' },
    { day: 'Sunday', start: '15:40:00', end: '17:20:00', room: 'Room-604', course: 'Database Management System Lab (0612-304)', teacher: 'Md. Fazle Rabbi Rizon' },

    // Wednesday (Room-403)
    { day: 'Wednesday', start: '08:30:00', end: '09:45:00', room: 'Room-403', course: 'Complex Variables and Transforms (0541-301)', teacher: 'Md. Sifuzzaman' },
    { day: 'Wednesday', start: '09:45:00', end: '11:00:00', room: 'Room-403', course: 'Software Engineering (0613-303)', teacher: 'Safwan Ishrak' },
    { day: 'Wednesday', start: '11:00:00', end: '12:15:00', room: 'Room-403', course: 'Database Management System (0612-303)', teacher: 'Md. Fazle Rabbi Rizon' },
    { day: 'Wednesday', start: '12:15:00', end: '13:30:00', room: 'Room-403', course: 'Operating System (0613-301)', teacher: 'Md. Nazmus Sakib' },

    // Thursday (Room-403)
    { day: 'Thursday', start: '08:30:00', end: '09:45:00', room: 'Room-403', course: 'Operating System (0613-301)', teacher: 'Md. Nazmus Sakib' },
    { day: 'Thursday', start: '09:45:00', end: '11:00:00', room: 'Room-403', course: 'Complex Variables and Transforms (0541-301)', teacher: 'Md. Sifuzzaman' },
    { day: 'Thursday', start: '11:00:00', end: '12:15:00', room: 'Room-403', course: 'Data Communication (0612-302)', teacher: 'Md. Shariful Islam' },
    { day: 'Thursday', start: '12:15:00', end: '13:30:00', room: 'Room-403', course: 'Database Management System (0612-303)', teacher: 'Md. Fazle Rabbi Rizon' }
];

async function seedBatch91() {
    let connection;
    try {
        console.log('🌱 Starting Batch-91 Routine Seeding...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL database\n');

        // 1. Insert/Update Teachers
        console.log('👨‍🏫 Updating Teachers List...');
        for (const t of teachers) {
            // Check existence by name
            const [existing] = await connection.query('SELECT id FROM teachers WHERE name = ?', [t.name]);
            if (existing.length === 0) {
                await connection.query(
                    'INSERT INTO teachers (name, designation, department) VALUES (?, ?, ?)',
                    [t.name, t.designation, t.department]
                );
                console.log(`   ✅ Added Teacher: ${t.name}`);
            } else {
                console.log(`   ℹ️  Teacher exists: ${t.name}`);
            }
        }

        // 2. Insert Routines
        console.log('\n📅 Inserting Routines for Batch-91...');
        let insertedInfo = 0;

        // Optional: clear previous entries for this batch to avoid duplicates if re-run
        // await connection.query('DELETE FROM routines WHERE batch = ?', [BATCH_NAME]);

        for (const r of routines) {
            // Check for duplicate to avoid cluttering
            const [existing] = await connection.query(
                'SELECT id FROM routines WHERE batch = ? AND day = ? AND start_time = ? AND room_number = ?',
                [BATCH_NAME, r.day, r.start, r.room]
            );

            if (existing.length === 0) {
                await connection.query(
                    'INSERT INTO routines (course, teacher, department, day, start_time, end_time, batch, room_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [r.course, r.teacher, DEPT_NAME, r.day, r.start, r.end, BATCH_NAME, r.room]
                );
                insertedInfo++;
            }
        }
        console.log(`   ✅ Added ${insertedInfo} routine entries for ${BATCH_NAME}`);
        console.log('\n✅ Batch-91 seeding data complete!');

    } catch (error) {
        console.error('❌ Error seeding Batch-91:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

seedBatch91();
