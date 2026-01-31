// const fetch = require('node-fetch'); // Native fetch in Node v18+
require('dotenv').config();
const mysql = require('mysql2/promise');

const API_URL = 'http://localhost:3004/api/auth/register';

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
};

async function testRegistration() {
    let connection;
    try {
        console.log('🧪 Starting Registration Tests...');

        // 1. Test Student Registration
        const studentData = {
            role: 'student',
            full_name: 'Test Student Auto',
            email: `teststudent_${Date.now()}@example.com`,
            password: 'Password123!',
            studentId: `CS${Date.now()}`,
            department: 'Computer Science & Engineering',
            batch: 'Batch-99',
            gender: 'Male',
            date_of_birth: '2000-01-01',
            address: '123 Student Lane',
            phone_number: '01700000000'
        };

        const resStudent = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        const jsonStudent = await resStudent.json();

        if (jsonStudent.success) {
            console.log('✅ Student Registration API: Success');
        } else {
            console.error('❌ Student Registration API: Failed', jsonStudent);
        }

        // 2. Test Faculty Registration
        const facultyData = {
            role: 'faculty',
            full_name: 'Test Faculty Auto',
            email: `testfaculty_${Date.now()}@example.com`,
            password: 'Password123!',
            department: 'Electrical Engineering',
            designation: 'Assistant Professor',
            gender: 'Female',
            date_of_birth: '1985-05-05',
            address: '456 Faculty Road',
            phone_number: '01800000000'
        };

        const resFaculty = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(facultyData)
        });
        const jsonFaculty = await resFaculty.json();

        if (jsonFaculty.success) {
            console.log('✅ Faculty Registration API: Success');
        } else {
            console.error('❌ Faculty Registration API: Failed', jsonFaculty);
        }

        // 3. Verify in Database
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query(
            'SELECT email, role, studentId, batch, designation FROM users WHERE email IN (?, ?)',
            [studentData.email, facultyData.email]
        );

        console.log('\n📊 Database Verification Results:');
        rows.forEach(row => {
            console.log(`User: ${row.email}`);
            console.log(`  Role: ${row.role}`);
            if (row.role === 'student') {
                console.log(`  Match Student: ${row.studentId === studentData.studentId ? '✅' : '❌'}`);
            } else if (row.role === 'faculty') {
                console.log(`  Match Faculty: ${row.designation === facultyData.designation ? '✅' : '❌'}`);
            }
        });

    } catch (error) {
        console.error('Test script error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

testRegistration();
