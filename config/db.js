// Database configuration and connection setup
// Switch between SQLite and MySQL based on your needs

// ======================================================
// Choose your database:
// ======================================================
// Option 1: MySQL (for XAMPP) - Recommended for production
const mysqlDb = require('./mysqlDb');
console.log('✅ Using MySQL database (XAMPP)');
module.exports = mysqlDb;

// Option 2: SQLite (for development) - Uncomment to use
// const sqliteDb = require('./sqliteDb');
// console.log('✅ Using SQLite database for persistent data storage');
// module.exports = sqliteDb;
