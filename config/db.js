// Database configuration and connection setup
// Using Mock Database (In-Memory) since MySQL is not installed

const mockDb = require('./mockDb');

console.log('⚠️  Using Mock Database (In-Memory)');
console.log('   MySQL is not available - using in-memory storage');

// Export mock database
module.exports = mockDb;
