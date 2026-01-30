const sqlite = require('better-sqlite3');
const db = sqlite('university.db');

// Check tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('teachers', 'departments')").all();
console.log('Existing tables:', JSON.stringify(tables, null, 2));

// Check teachers count
try {
  const teacherCount = db.prepare('SELECT COUNT(*) as count FROM teachers').get();
  console.log('Teachers count:', teacherCount.count);
  
  // Show sample
  const sample = db.prepare('SELECT * FROM teachers LIMIT 3').all();
  console.log('Sample teachers:', JSON.stringify(sample, null, 2));
} catch(e) {
  console.log('Teachers table error:', e.message);
}

// Check departments
try {
  const deptCount = db.prepare('SELECT COUNT(*) as count FROM departments').get();
  console.log('Departments count:', deptCount.count);
  
  const depts = db.prepare('SELECT * FROM departments LIMIT 5').all();
  console.log('Sample departments:', JSON.stringify(depts, null, 2));
} catch(e) {
  console.log('Departments table error:', e.message);
}

db.close();
