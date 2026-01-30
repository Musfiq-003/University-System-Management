// Database configuration and connection setup
// Uses SQLite for persistent storage with MySQL-compatible API

const sqliteDb = require('./sqliteDb');

console.log('✅ Using SQLite database for persistent data storage');

// Export SQLite database with MySQL-compatible interface
module.exports = sqliteDb;
