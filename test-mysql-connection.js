// Test MySQL connection to XAMPP
// Run this to verify your database connection works

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing MySQL Connection to XAMPP...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_management'
  };

  console.log('Configuration:');
  console.log('  Host:', config.host);
  console.log('  Port:', config.port);
  console.log('  User:', config.user);
  console.log('  Password:', config.password ? '***' : '(empty)');
  console.log('  Database:', config.database);
  console.log('');

  try {
    // Test connection without database
    console.log('Step 1: Testing connection to MySQL server...');
    const tempConn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password
    });
    console.log('✅ Successfully connected to MySQL server!\n');

    // Check if database exists
    console.log('Step 2: Checking for database...');
    const [databases] = await tempConn.query(
      `SHOW DATABASES LIKE '${config.database}'`
    );
    
    if (databases.length === 0) {
      console.log(`⚠️  Database '${config.database}' does not exist`);
      console.log('   It will be created when you start the application\n');
    } else {
      console.log(`✅ Database '${config.database}' exists!\n`);
      
      // Connect to the database
      await tempConn.query(`USE ${config.database}`);
      
      // List tables
      console.log('Step 3: Checking tables...');
      const [tables] = await tempConn.query('SHOW TABLES');
      
      if (tables.length === 0) {
        console.log('⚠️  No tables found');
        console.log('   Tables will be created when you start the application\n');
      } else {
        console.log(`✅ Found ${tables.length} tables:`);
        tables.forEach(table => {
          const tableName = Object.values(table)[0];
          console.log('   -', tableName);
        });
        console.log('');

        // Count records in each table
        console.log('Step 4: Checking data...');
        for (const table of tables) {
          const tableName = Object.values(table)[0];
          const [count] = await tempConn.query(
            `SELECT COUNT(*) as count FROM ${tableName}`
          );
          console.log(`   ${tableName}: ${count[0].count} records`);
        }
        console.log('');
      }
    }

    await tempConn.end();
    
    console.log('✅ Connection test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure XAMPP MySQL is running');
    console.log('   2. Run: npm start');
    console.log('   3. Visit: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Connection test failed!\n');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Is XAMPP MySQL running?');
    console.error('   2. Check XAMPP Control Panel - MySQL should show "Running"');
    console.error('   3. Verify credentials in .env file');
    console.error('   4. Try accessing phpMyAdmin: http://localhost/phpmyadmin');
    process.exit(1);
  }
}

testConnection();
