// Seed Database Script - Populate departments and teachers
require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'university_management'
};

async function seedDatabase() {
  let connection;
  
  try {
    console.log('🌱 Starting database seeding...\n');
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database\n');

    // Seed Departments
    await seedDepartments(connection);
    
    // Seed Teachers
    await seedTeachers(connection);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Run test-mysql-connection.js to verify the data');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function seedDepartments(connection) {
  console.log('📚 Seeding departments...');
  
  const { allDepartments } = require('./data/departments');
  
  let inserted = 0;
  let skipped = 0;
  
  for (const dept of allDepartments) {
    try {
      const [result] = await connection.query(`
        INSERT IGNORE INTO departments (name, code, description)
        VALUES (?, ?, ?)
      `, [dept.name, dept.code, `${dept.name}`]);
      
      if (result.affectedRows > 0) {
        inserted++;
        console.log(`  ✅ Added: ${dept.name} (${dept.code})`);
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`  ❌ Error adding ${dept.name}:`, error.message);
    }
  }
  
  console.log(`\n  Summary: ${inserted} departments added, ${skipped} skipped (already exist)`);
}

async function seedTeachers(connection) {
  console.log('\n👨‍🏫 Seeding teachers...');
  
  const teacherFiles = [
    './data/cseTeachers',
    './data/eeeTeachers',
    './data/civilTeachers',
    './data/bbaTeachers',
    './data/bmbTeachers',
    './data/lawTeachers',
    './data/englishTeachers',
    './data/economicsTeachers',
    './data/politicalScienceTeachers',
    './data/sociologyTeachers',
    './data/developmentStudiesTeachers',
    './data/microbiologyTeachers',
    './data/pharmacyTeachers'
  ];

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const file of teacherFiles) {
    try {
      const teachers = require(file);
      const deptName = file.split('/').pop().replace('Teachers.js', '').replace('Teachers', '');
      
      console.log(`\n  Processing ${deptName}...`);
      
      for (const teacher of teachers) {
        try {
          const [result] = await connection.query(`
            INSERT INTO teachers (name, designation, department, email, phone, specialization, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name=name
          `, [
            teacher.name,
            teacher.designation,
            teacher.department,
            teacher.email || null,
            teacher.phone || null,
            teacher.specialization || null,
            teacher.image || null
          ]);
          
          if (result.affectedRows > 0) {
            totalInserted++;
          } else {
            totalSkipped++;
          }
        } catch (error) {
          // Skip duplicates or errors
          totalSkipped++;
        }
      }
      
      console.log(`    ✅ ${teachers.length} teachers processed`);
    } catch (error) {
      console.log(`    ⚠️  File not found or error: ${file}`);
    }
  }
  
  console.log(`\n  Summary: ${totalInserted} teachers added, ${totalSkipped} skipped/duplicates`);
}

// Run the seeding
seedDatabase();
