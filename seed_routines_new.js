require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

const batch90Routines = [
    // Saturday
    { day: 'Saturday', start: '14:00', end: '15:40', course: '0613-302 Lab-1 (OS Lab)', teacher: 'Shobnom Mushtary', room: '605' },
    { day: 'Saturday', start: '15:40', end: '17:20', course: '0612-304 Lab-1 (DBMS Lab)', teacher: 'Anik Mahmud Shanto', room: '605' },
    // Sunday
    { day: 'Sunday', start: '08:30', end: '09:45', course: '0612-302 (Data Comm)', teacher: 'Md. Didar Ahmed', room: '605' },
    { day: 'Sunday', start: '09:45', end: '11:00', course: '0541-301 (Complex Vars)', teacher: 'Md. Sifuzzaman', room: '605' },
    // Wednesday
    { day: 'Wednesday', start: '08:30', end: '09:45', course: '0613-303 (Soft Eng)', teacher: 'Safwan Ishrak', room: '605' },
    { day: 'Wednesday', start: '09:45', end: '11:00', course: '0612-301 (Info Sys)', teacher: 'Md. Manirujjaman', room: '605' },
    { day: 'Wednesday', start: '11:00', end: '12:15', course: '0613-301 (OS)', teacher: 'Shobnom Mushtary', room: '605' },
    { day: 'Wednesday', start: '12:15', end: '13:30', course: '0612-303 (DBMS)', teacher: 'Anik Mahmud Shanto', room: '605' },
    // Thursday
    { day: 'Thursday', start: '08:30', end: '09:45', course: '0612-302 (Data Comm)', teacher: 'Md. Didar Ahmed', room: '605' },
    { day: 'Thursday', start: '09:45', end: '11:00', course: '0613-301 (OS)', teacher: 'Shobnom Mushtary', room: '605' },
    { day: 'Thursday', start: '11:00', end: '12:15', course: '0541-301 (Complex Vars)', teacher: 'Md. Sifuzzaman', room: '605' },
    { day: 'Thursday', start: '12:15', end: '13:30', course: '0612-303 (DBMS)', teacher: 'Anik Mahmud Shanto', room: '605' }
];

const batch78Routines = [
    // Wednesday
    { day: 'Wednesday', start: '08:30', end: '09:45', course: 'CSE-411 (Parallel Proc)', teacher: 'Kazi Farhan Hasan', room: '208' },
    { day: 'Wednesday', start: '09:45', end: '11:00', course: 'CSE-405 (Graphics)', teacher: 'Md. Mahabubur Rahman', room: '208' },
    { day: 'Wednesday', start: '11:00', end: '12:15', course: 'CSE-405 (Graphics)', teacher: 'Md. Mahabubur Rahman', room: '208' },
    { day: 'Wednesday', start: '12:15', end: '13:30', course: 'CSE-407 (AI)', teacher: 'Md. Shariful Islam', room: '208' },
    { day: 'Wednesday', start: '14:00', end: '15:40', course: 'CSE-408 Lab-1 (AI Lab)', teacher: 'Md. Shariful Islam', room: '208' },
    // Thursday
    { day: 'Thursday', start: '08:30', end: '09:45', course: 'CSE-411 (Parallel Proc)', teacher: 'Kazi Farhan Hasan', room: '208' },
    { day: 'Thursday', start: '09:45', end: '11:00', course: 'CSE-407 (AI)', teacher: 'Md. Shariful Islam', room: '208' },
    { day: 'Thursday', start: '11:00', end: '13:30', course: 'AELC (English)', teacher: 'Mainul Islam', room: '208' },
    { day: 'Thursday', start: '14:00', end: '15:40', course: 'CSE-406 Lab-1 (Graphics Lab)', teacher: 'Md. Mahabubur Rahman', room: '208' }
];

async function seedRoutines() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Clear existing routines for these batches to avoid duplicates
        await connection.query('DELETE FROM routines WHERE batch IN (?, ?)', ['Batch-90', 'Batch-78']);
        console.log('Cleaned old routines for Batch-90 and Batch-78.');

        // Insert Batch-90
        for (const r of batch90Routines) {
            await connection.query(
                `INSERT INTO routines (day, start_time, end_time, course, teacher, room_number, batch, department)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [r.day, r.start, r.end, r.course, r.teacher, r.room, 'Batch-90', 'Computer Science & Engineering']
            );
        }
        console.log('✅ Batch-90 routines inserted.');

        // Insert Batch-78
        for (const r of batch78Routines) {
            await connection.query(
                `INSERT INTO routines (day, start_time, end_time, course, teacher, room_number, batch, department)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [r.day, r.start, r.end, r.course, r.teacher, r.room, 'Batch-78', 'Computer Science & Engineering']
            );
        }
        console.log('✅ Batch-78 routines inserted.');

    } catch (error) {
        console.error('❌ Error seeding routines:', error);
    } finally {
        if (connection) await connection.end();
    }
}

seedRoutines();
