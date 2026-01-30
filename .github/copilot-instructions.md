# University Management System - AI Coding Instructions

## Architecture Overview

**Monorepo Structure**: Express.js backend + React frontend (in `frontend/` subfolder)
- Backend serves API on port 3000; frontend proxies to it via `"proxy": "http://localhost:3000"` in `frontend/package.json`
- SQLite database (`university.db`) provides MySQL-compatible interface through `config/sqliteDb.js`
- Database automatically initializes tables and seeds data on first run

**Key Architecture Pattern**: Database abstraction layer
```javascript
// config/db.js exports either sqliteDb or mockDb
// Controllers import: const db = require('../config/db');
// Use: db.query() for MySQL-style queries OR db.prepare().run() for SQLite
```

## Critical Database Patterns

**SQLite with MySQL-Compatible API**: The system uses `better-sqlite3` but exposes a MySQL-like async interface in `config/sqliteDb.js`:
```javascript
// MySQL-style queries are wrapped:
db.query = (sql, params) => new Promise((resolve) => {
  // Converts synchronous SQLite to async MySQL format
  // Returns [rows, fields] tuple like mysql2
});
```

**Tables auto-created** on startup in `sqliteDb.initializeDatabase()`:
- `users` (auth with OTP, role-based access)
- `routines` (class schedules with department/batch filtering)
- `research_papers` (with status workflow)
- `hostel` (student allocations)
- `teachers` (seeded from `data/*.js` files)
- `departments` (faculty hierarchy)

## Authentication System

**JWT + Role-Based Access**:
- Roles: `pending` → `student`/`faculty`/`admin` (admin approval required)
- Password requirements enforced in `authController.validatePasswordStrength()`: 8+ chars, uppercase, lowercase, number, special char
- Account lockout: 5 failed attempts = 15 min lock (see `MAX_FAILED_ATTEMPTS` in `authController.js`)
- OTP verification via email (or console fallback if email not configured)
- Tokens in `Authorization: Bearer <token>` header, verified by `middleware/authMiddleware.js`

**Protected Routes Pattern**:
```javascript
router.post('/routines', verifyToken, requireRole(['faculty', 'admin']), addRoutine);
```

## Frontend Conventions

**Component Structure**: Functional components with hooks, no class components
- Dashboard components (Student/Faculty) use extensive mock data for demo purposes
- API calls use fetch with `Authorization` header from `localStorage.getItem('token')`
- User info stored in localStorage as `user_info` JSON object

**Styling Approach** (see `DESIGN_SYSTEM.md`):
- Gradient-first design: All major elements use `linear-gradient(135deg, ...)`
- Glassmorphism: `backdrop-filter: blur(10px)` + `rgba(255,255,255,0.95)`
- Consistent spacing scale: 0.5rem, 0.8rem, 1rem, 1.5rem, 2rem, 2.5rem, 3rem
- Border radius: 12-15px for cards/buttons, 20-25px for containers
- Micro-animations on all interactive elements

## Development Workflows

**Backend Start**:
```bash
npm start          # Production
npm run dev        # Development (nodemon auto-restart)
```

**Frontend Start** (separate terminal):
```bash
cd frontend
npm start          # Runs on port 3001, proxies API to :3000
```

**Database Reset**: Delete `university.db` file; it will regenerate on next start with seed data

**Email Service**: Configure via `.env` or falls back to console logging:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Gmail: use App Password, not regular password
JWT_SECRET=change-this-in-production
```

## Department & Teacher Data Pattern

**Hierarchical Faculty Structure**:
- Department data defined in `data/departments.js` (faculty → departments)
- Teacher data in separate files: `data/cseTeachers.js`, `data/civilTeachers.js`, etc.
- Seeded into database via `sqliteDb.seedTeachers()` on initialization
- Batch format: `D-78A`, `D-78B` (D prefix, hyphen, batch code)

**Adding New Department Teachers**:
1. Create `data/newDepartmentTeachers.js` with export array
2. Import in `sqliteDb.js` and add to `seedTeachers()` function
3. Database will auto-seed on next run

## API Response Pattern

**Consistent JSON Structure**:
```javascript
// Success
{ success: true, data: {}, message: 'Optional success message' }

// Error
{ success: false, message: 'Error description', error: {} }
```

Controllers use try-catch with database rollback on errors. Status codes: 200 (success), 201 (created), 400 (validation), 401 (auth), 403 (forbidden), 404 (not found), 500 (server error).

## Common Gotchas

1. **Database query format**: Use `await db.query(sql, [params])` not `db.execute()`
2. **JWT secret**: Must match between `authController.js` and `authMiddleware.js` (defaults to `your-secret-key-change-in-production`)
3. **Role checks**: Always verify user role on both frontend (UI) and backend (API security)
4. **Frontend proxy**: API calls use relative paths (`/api/routines`) not absolute URLs
5. **SQLite AUTO_INCREMENT**: Use `INTEGER PRIMARY KEY AUTOINCREMENT` not just `PRIMARY KEY`

## File Naming & Import Conventions

- Controllers: `*Controller.js` with exports object (`exports.functionName`)
- Routes: `*Routes.js` exporting Express router
- Frontend components: PascalCase files, organized by feature in `components/` subfolders
- CSS modules: Component-specific `.css` files imported in component
- Data files: camelCase with plural suffix (`cseTeachers.js`, `departments.js`)
