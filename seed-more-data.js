require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

async function seedMoreData() {
    let connection;
    try {
        console.log('🌱 Starting comprehensive data seeding...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL database\n');

        // --- 1. Seed Routines ---
        console.log('📅 Seeding Routines...');
        const routines = [
            { course: 'Artificial Intelligence', teacher: 'Dr. John Smith', department: 'Computer Science & Engineering', day: 'Monday', start_time: '11:00:00', end_time: '12:30:00', batch: 'D-78A', room_number: 'Room 304' },
            { course: 'Computer Networks', teacher: 'Prof. Sarah Johnson', department: 'Computer Science & Engineering', day: 'Tuesday', start_time: '09:00:00', end_time: '10:30:00', batch: 'D-78A', room_number: 'Room 301' },
            { course: 'Operating Systems', teacher: 'Dr. Mike Wilson', department: 'Computer Science & Engineering', day: 'Wednesday', start_time: '11:00:00', end_time: '12:30:00', batch: 'D-78B', room_number: 'Room 302' },
            { course: 'Software Engineering', teacher: 'Dr. Emily Brown', department: 'Computer Science & Engineering', day: 'Thursday', start_time: '14:00:00', end_time: '15:30:00', batch: 'D-79', room_number: 'Room 305' },
            { course: 'Digital Logic Design', teacher: 'Dr. John Smith', department: 'Electrical & Electronic Engineering', day: 'Sunday', start_time: '09:00:00', end_time: '10:30:00', batch: 'EEE-24', room_number: 'EEE-101' },
            { course: 'Circuit Analysis', teacher: 'Prof. Robert Davis', department: 'Electrical & Electronic Engineering', day: 'Monday', start_time: '14:00:00', end_time: '15:30:00', batch: 'EEE-24', room_number: 'EEE-102' },
            { course: 'Introduction to Business', teacher: 'Prof. Michael Scott', department: 'Business Administration', day: 'Tuesday', start_time: '10:00:00', end_time: '11:30:00', batch: 'BBA-25', room_number: 'BBA-201' },
            { course: 'Marketing Management', teacher: 'Dr. Pam Beesly', department: 'Business Administration', day: 'Wednesday', start_time: '12:00:00', end_time: '13:30:00', batch: 'BBA-24', room_number: 'BBA-202' },
            { course: 'Constitutional Law', teacher: 'Prof. Annalise Keating', department: 'Law', day: 'Sunday', start_time: '11:00:00', end_time: '12:30:00', batch: 'LAW-10', room_number: 'LAW-101' },
            { course: 'Criminal Procedures', teacher: 'Dr. Saul Goodman', department: 'Law', day: 'Thursday', start_time: '15:00:00', end_time: '16:30:00', batch: 'LAW-10', room_number: 'LAW-102' }
        ];

        for (const r of routines) {
            // Check for duplicate (same room, day, time)
            const [existing] = await connection.query(
                'SELECT id FROM routines WHERE room_number = ? AND day = ? AND start_time = ?',
                [r.room_number, r.day, r.start_time]
            );
            if (existing.length === 0) {
                await connection.query(
                    'INSERT INTO routines (course, teacher, department, day, start_time, end_time, batch, room_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [r.course, r.teacher, r.department, r.day, r.start_time, r.end_time, r.batch, r.room_number]
                );
            }
        }
        console.log(`   ✅ Processed ${routines.length} routines`);


        // --- 2. Seed Research Papers ---
        console.log('\n📚 Seeding Research Papers...');
        const papers = [
            { title: 'Deep Learning in Medical Imaging', author: 'Dr. John Smith', department: 'Computer Science & Engineering', year: 2024, status: 'Published', abstract: 'Using CNNs for early tumor detection.' },
            { title: '5G Network Security Challenges', author: 'Prof. Sarah Johnson', department: 'Computer Science & Engineering', year: 2023, status: 'Published', abstract: 'Analysis of security vulnerabilities in 5G protocols.' },
            { title: 'Sustainable Concrete Materials', author: 'Dr. Ahmed Khan', department: 'Civil Engineering', year: 2024, status: 'Under Review', abstract: 'Testing eco-friendly concrete mixtures.' },
            { title: 'Quantum Computing Algorithms', author: 'Dr. Mike Wilson', department: 'Computer Science & Engineering', year: 2025, status: 'Draft', abstract: 'New approaches to Shor\'s algorithm.' },
            { title: 'Micro-finance Impact in Rural Areas', author: 'Prof. Yunus Ali', department: 'Economics', year: 2023, status: 'Published', abstract: 'Study of micro-credit on rural poverty.' },
            { title: 'Modernist Literature Review', author: 'Dr. Elizabeth Bennet', department: 'English', year: 2024, status: 'Rejected', abstract: 'Critique of early 20th century poetry.' },
            { title: 'Solar Cell Efficiency Optimization', author: 'Prof. Robert Davis', department: 'Electrical & Electronic Engineering', year: 2024, status: 'Under Review', abstract: 'Improving photovoltaic cells using perovskites.' },
            { title: 'Corporate Governance Ethics', author: 'Dr. Pam Beesly', department: 'Business Administration', year: 2024, status: 'Published', abstract: 'Ethics in modern corporate structures.' }
        ];

        for (const p of papers) {
            const [existing] = await connection.query('SELECT id FROM research_papers WHERE title = ?', [p.title]);
            if (existing.length === 0) {
                await connection.query(
                    'INSERT INTO research_papers (title, author, department, year, status, abstract) VALUES (?, ?, ?, ?, ?, ?)',
                    [p.title, p.author, p.department, p.year, p.status, p.abstract]
                );
            }
        }
        console.log(`   ✅ Processed ${papers.length} research papers`);


        // --- 3. Seed Hostel Students ---
        console.log('\nqy Seeding Hostel Students...');
        // Using valid hostel names from config
        const hostelStudents = [
            { student_name: 'Rahim Uddin', student_id: 'CSE2023005', hostel_name: 'Shaheed Rafiq Uddin Hall', room_number: '101', department: 'Computer Science & Engineering', allocated_date: '2023-02-15' },
            { student_name: 'Karim Hasan', student_id: 'EEE2023012', hostel_name: 'Shaheed Rafiq Uddin Hall', room_number: '102', department: 'Electrical & Electronic Engineering', allocated_date: '2023-03-01' },
            { student_name: 'Jamal Ahmed', student_id: 'CE2023008', hostel_name: 'Shaheed Rafiq Uddin Hall', room_number: '103', department: 'Civil Engineering', allocated_date: '2024-01-10' },
            { student_name: 'Sumon Khan', student_id: 'BBA2022045', hostel_name: 'Shaheed Rafiq Uddin Hall', room_number: '201', department: 'Business Administration', allocated_date: '2022-11-20' },
            { student_name: 'Nasrin Akter', student_id: 'ENG2023002', hostel_name: 'Begum Sufia Kamal Hall', room_number: '101', department: 'English', allocated_date: '2023-05-12' },
            { student_name: 'Fatema Begum', student_id: 'PHM2023015', hostel_name: 'Begum Sufia Kamal Hall', room_number: '102', department: 'Pharmacy', allocated_date: '2023-06-01' },
            { student_name: 'Shirin Sultana', student_id: 'SOC2024003', hostel_name: 'Begum Sufia Kamal Hall', room_number: '103', department: 'Sociology', allocated_date: '2024-01-25' },
            { student_name: 'Laila Yasmin', student_id: 'LAW2023009', hostel_name: 'Begum Sufia Kamal Hall', room_number: '201', department: 'Law', allocated_date: '2023-08-14' }
        ];

        let hostelInserted = 0;
        for (const h of hostelStudents) {
            const [existing] = await connection.query('SELECT id FROM hostel_students WHERE student_id = ?', [h.student_id]);
            if (existing.length === 0) {
                await connection.query(
                    'INSERT INTO hostel_students (student_name, student_id, hostel_name, room_number, department, allocated_date) VALUES (?, ?, ?, ?, ?, ?)',
                    [h.student_name, h.student_id, h.hostel_name, h.room_number, h.department, h.allocated_date]
                );
                hostelInserted++;
            }
        }
        console.log(`   ✅ Added ${hostelInserted} hostel students`);

        console.log('\n✅ Comprehensive data seeding complete!');

    } catch (error) {
        console.error('❌ Error seeding comprehensive data:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

seedMoreData();
