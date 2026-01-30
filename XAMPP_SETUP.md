# XAMPP MySQL Database Setup Guide

This guide will help you connect your University Management System to XAMPP's MySQL database.

## Prerequisites

1. **Install XAMPP** (if not already installed)
   - Download from: https://www.apachefriends.org/
   - Install with MySQL/MariaDB component

2. **Start XAMPP Services**
   - Open XAMPP Control Panel
   - Start **Apache** (for phpMyAdmin access)
   - Start **MySQL** (for database server)

## Step 1: Configure Environment Variables

Create or update the `.env` file in your project root:

```env
# Database Configuration for XAMPP
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=university_management

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production

# Email Configuration (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Note:** By default, XAMPP MySQL has:
- Username: `root`
- Password: *(empty)*
- Host: `localhost`
- Port: `3306`

## Step 2: Switch to MySQL Database

Update the `config/db.js` file to use MySQL instead of SQLite:

```javascript
// config/db.js
const mysqlDb = require('./mysqlDb');

console.log('✅ Using MySQL database (XAMPP)');

module.exports = mysqlDb;
```

## Step 3: Verify MySQL Connection

1. **Check XAMPP MySQL is Running**
   - Open XAMPP Control Panel
   - Verify MySQL shows "Running" status
   - Port should be 3306

2. **Test phpMyAdmin Access**
   - Open browser: http://localhost/phpmyadmin
   - Login with username: `root`, password: *(leave empty)*
   - You should see the phpMyAdmin interface

## Step 4: Start the Application

```bash
# Install dependencies (if not already done)
npm install

# Start the backend server
npm start

# Or for development with auto-restart
npm run dev
```

The application will:
- ✅ Connect to MySQL on XAMPP
- ✅ Create `university_management` database automatically
- ✅ Create all required tables
- ✅ Seed initial data (admin, faculty, student accounts)

## Step 5: Verify Database in phpMyAdmin

1. Open http://localhost/phpmyadmin
2. You should see `university_management` database in the left panel
3. Click on it to view tables:
   - `users`
   - `routines`
   - `research_papers`
   - `hostel_students`
   - `departments`
   - `teachers`
   - `login_attempts`

## Default Login Credentials

After setup, you can login with these accounts:

**Admin Account:**
- Email: `admin@university.edu`
- Password: `Admin@123`

**Faculty Account:**
- Email: `faculty@university.edu`
- Password: `Faculty@123`

**Student Account:**
- Email: `student@university.edu`
- Password: `Student@123`

## Troubleshooting

### Error: "Cannot connect to MySQL"

**Solution:**
1. Verify MySQL is running in XAMPP Control Panel
2. Check if port 3306 is not blocked by firewall
3. Verify credentials in `.env` file

### Error: "Access denied for user 'root'"

**Solution:**
1. In XAMPP, MySQL default password is empty
2. Set `DB_PASSWORD=` (empty) in `.env`
3. Or set a password in phpMyAdmin and update `.env`

### Error: "Port 3306 already in use"

**Solution:**
1. Another MySQL instance might be running
2. Stop other MySQL services from Task Manager
3. Or change port in XAMPP config and update `.env`

### Database Not Creating

**Solution:**
1. Check MySQL logs in XAMPP: `xampp/mysql/data/mysql_error.log`
2. Ensure user has CREATE DATABASE permission
3. Try creating database manually in phpMyAdmin:
   ```sql
   CREATE DATABASE university_management;
   ```

## Setting MySQL Root Password (Optional but Recommended)

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click on "User accounts" tab
3. Find "root" user with "localhost" host
4. Click "Edit privileges"
5. Click "Change password"
6. Set a strong password
7. Update `.env` file with new password:
   ```env
   DB_PASSWORD=your_new_password
   ```

## Manual Database Import (Alternative Method)

If automatic setup fails, you can import manually:

1. Open phpMyAdmin
2. Create database: `university_management`
3. Click on the database
4. Go to "Import" tab
5. Choose file: `database.sql` (includes schema)
6. Then import: `database_auth.sql` (user management tables)
7. Then import: `database_teachers.sql` (teacher data)
8. Click "Go"

## Switching Back to SQLite

If you want to switch back to SQLite:

1. Update `config/db.js`:
   ```javascript
   const sqliteDb = require('./sqliteDb');
   module.exports = sqliteDb;
   ```

2. Restart the server

## Performance Tips

1. **Enable Query Cache** (in XAMPP MySQL config)
2. **Add Indexes** (already included in schema)
3. **Regular Backups** (use phpMyAdmin Export)
4. **Monitor Slow Queries** (check MySQL logs)

## Backup Database

**Via phpMyAdmin:**
1. Select `university_management` database
2. Click "Export" tab
3. Choose "Quick" or "Custom" export
4. Select "SQL" format
5. Click "Go"

**Via Command Line:**
```bash
# From XAMPP mysql/bin directory
mysqldump -u root university_management > backup.sql
```

## Restore Database

**Via phpMyAdmin:**
1. Select `university_management` database
2. Click "Import" tab
3. Choose your backup file
4. Click "Go"

**Via Command Line:**
```bash
# From XAMPP mysql/bin directory
mysql -u root university_management < backup.sql
```

## Next Steps

- Configure production database settings
- Set strong MySQL root password
- Enable SSL for MySQL connections
- Set up automated backups
- Monitor database performance

## Support

If you encounter issues:
1. Check XAMPP MySQL error logs
2. Verify all credentials in `.env`
3. Test connection with phpMyAdmin first
4. Ensure no firewall blocking port 3306
