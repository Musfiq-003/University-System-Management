const fs = require('fs');
const path = require('path');

// Import all teacher data
const cseTeachers = require('./data/cseTeachers');
const eeeTeachers = require('./data/eeeTeachers');
const civilTeachers = require('./data/civilTeachers');
const { bbaTeachers } = require('./data/bbaTeachers');
const englishTeachers = require('./data/englishTeachers');
const lawTeachers = require('./data/lawTeachers');
const pharmacyTeachers = require('./data/pharmacyTeachers');
const bmbTeachers = require('./data/bmbTeachers');
const microbiologyTeachers = require('./data/microbiologyTeachers');
const sociologyTeachers = require('./data/sociologyTeachers');
const politicalScienceTeachers = require('./data/politicalScienceTeachers');
const economicsTeachers = require('./data/economicsTeachers');
const developmentStudiesTeachers = require('./data/developmentStudiesTeachers');

// SQL file header
let sql = `-- ======================================================
-- Teachers Data - All Departments (292 Teachers)
-- ======================================================
-- This file contains all faculty/teacher information
-- for all departments in the university
-- Auto-generated from data/*.js files
-- ======================================================

`;

function escapeSQL(str) {
  if (!str) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function generateInserts(teachers, deptName) {
  sql += `\n-- ${deptName} (${teachers.length} teachers)\n`;
  
  for (const teacher of teachers) {
    const name = escapeSQL(teacher.name);
    const designation = escapeSQL(teacher.designation);
    const department = escapeSQL(teacher.department);
    const email = escapeSQL(teacher.email);
    const phone = escapeSQL(teacher.phone || teacher.mobile);
    const specialization = escapeSQL(teacher.research_interests || teacher.specialization);
    
    sql += `INSERT INTO teachers (name, designation, department, email, phone, specialization) VALUES (${name}, ${designation}, ${department}, ${email}, ${phone}, ${specialization});\n`;
  }
}

// Generate INSERT statements for all departments
generateInserts(cseTeachers, 'Computer Science & Engineering');
generateInserts(eeeTeachers, 'Electrical & Electronic Engineering');
generateInserts(civilTeachers, 'Civil Engineering');
generateInserts(bbaTeachers, 'Business Administration');
generateInserts(englishTeachers, 'English');
generateInserts(lawTeachers, 'Law');
generateInserts(pharmacyTeachers, 'Pharmacy');
generateInserts(bmbTeachers, 'Biochemistry and Molecular Biology');
generateInserts(microbiologyTeachers, 'Microbiology');
generateInserts(sociologyTeachers, 'Sociology');
generateInserts(politicalScienceTeachers, 'Political Science');
generateInserts(economicsTeachers, 'Economics');
generateInserts(developmentStudiesTeachers, 'Development Studies');

// Write to file
fs.writeFileSync('database_teachers.sql', sql);
console.log('✅ Generated database_teachers.sql with all 292 teachers');
