# Department and Batch Search Feature Documentation

## Overview
The University System now includes a powerful hierarchical search feature that allows users to filter routines by Department first, then by specific Batch within that department.

## Feature Details

### Department-Batch Hierarchy
The system implements a cascading filter system where:
1. Users first select a Department
2. The Batch dropdown dynamically populates with only the batches available in that department
3. Batch selection is disabled until a department is chosen

### Supported Departments and Batches

#### 1. **CSE (Computer Science & Engineering)**
- **D-Batches:** D-67 to D-105 (including D-78A, D-78B, D-100A, D-100B)
- **E-Batches:** E-83 to E-125
- **Total:** 82 batches

#### 2. **Law Department**
- **Batches:** 62 to 73
- **Total:** 12 batches

#### 3. **BBA (Business Administration)**
- **Batches:** P-93 to P-122
- **Total:** 30 batches

#### 4. **Civil Department**
- **D-Batches:** D-15 to D-27
- **E-Batches:** E-55 to E-73
- **Total:** 32 batches

#### 5. **Economics Department**
- **Batches:** 11 to 21
- **Total:** 11 batches

#### 6. **EEE (Electrical & Electronic Engineering)**
- **E-Batches:** E-47 to E-68
- **D-Batches:** D-35 to D-45
- **Total:** 33 batches

#### 7. **Political Science Department**
- **Batches:** 15 to 29
- **Total:** 15 batches

#### 8. **English Department**
- **Batches:** Bi-53 to Bi-63
- **Total:** 11 batches

#### 9. **Microbiology Department**
- **Batches:** 1 to 5
- **Total:** 5 batches

#### 10. **BMB (Biochemistry & Molecular Biology)**
- **Batches:** 1 to 5
- **Total:** 5 batches

#### 11. **Pharmacy Department**
- **Batches:** 24 to 40
- **Total:** 17 batches

#### 12. **Sociology Department**
- **Batches:** B-43 to B-50
- **Total:** 8 batches

#### 13. **Development Studies Department**
- **Batches:** 1 to 4
- **Total:** 4 batches

---

## Usage Guide

### For Users

#### Viewing All Routines
1. Navigate to the Routines section
2. Keep "Department" set to "All Departments"
3. All routines across all departments will be displayed

#### Filtering by Department
1. Click the "Department" dropdown
2. Select your desired department (e.g., "CSE")
3. The table will automatically filter to show only routines from that department
4. The "Batch" dropdown will activate and populate with batches from that department

#### Filtering by Batch
1. First select a Department
2. Click the "Batch" dropdown (now enabled)
3. Select a specific batch (e.g., "D-78A")
4. The table will show only routines for that specific batch

#### Resetting Filters
- Set Department back to "All Departments" to see all routines
- The Batch filter will automatically reset when changing departments

### Adding New Routines

When adding a new routine:
1. **Department:** Select from dropdown (required)
2. **Batch:** Automatically populates based on selected department (required)
3. The system ensures data consistency by enforcing department-batch relationships

---

## Technical Implementation

### Frontend Components

#### RoutineList.js
- **State Management:**
  - `filterDepartment`: Currently selected department
  - `filterBatch`: Currently selected batch
  - `routines`: Filtered routine data

- **Key Functions:**
  - `departmentBatchData`: Object containing all department-batch mappings
  - `getBatchOptions()`: Returns available batches for selected department
  - `handleDepartmentChange()`: Updates department and resets batch filter
  - `fetchRoutines()`: Fetches and filters routines client-side

#### AddRoutine.js
- **Cascading Dropdowns:**
  - Department selection enables batch dropdown
  - Batch options dynamically generated from selected department
  - Form validation ensures both fields are filled

### Backend Updates

#### routineController.js
- **addRoutine:** Updated to accept and validate `department` field
- **Validation:** Ensures all required fields including department are present

#### Database Schema
```sql
CREATE TABLE routines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course VARCHAR(100) NOT NULL,
  teacher VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,  -- NEW FIELD
  day VARCHAR(20),                   -- Now optional
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  batch VARCHAR(20) NOT FILES NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_department (department),
  INDEX idx_batch (batch)
);
```

### Migration

A migration script (`migration_add_department.sql`) is provided to update existing databases:
- Adds `department` column to `routines` table
- Creates index for performance
- Makes `day` column optional
- Sets default value 'CSE' for existing records

---

## UI/UX Features

### Visual Indicators
- **Department Badge:** Blue background (#007bff)
- **Batch Badge:** Gray background (#6c757d)
- **Disabled State:** Batch dropdown is visually disabled until department is selected

### Responsive Design
- Filters arranged horizontally with adequate spacing (20px gap)
- Dropdowns have minimum widths for readability:
  - Department: 200px
  - Batch: 150px

### User Feedback
- Total routine count updates dynamically based on filters
- Clear "No routines found" message when filters return empty results
- Loading states during data fetching

---

## Performance Optimizations

1. **Client-Side Filtering:**
   - Routines fetched once from server
   - Filtering done in browser for instant response
   - Reduces server load and network traffic

2. **Database Indexes:**
   - Index on `department` column
   - Index on `batch` column
   - Faster query performance on large datasets

3. **Smart Re-rendering:**
   - useEffect triggers only on filter changes
   - Prevents unnecessary API calls

---

## Data Integrity

### Validation Rules
- Department must be selected before batch
- Only valid batches for selected department are shown
- Form cannot be submitted with invalid department-batch combinations

### Consistency
- Frontend and backend share same department-batch mappings
- Prevents data entry errors
- Ensures all routines have valid department associations

---

## Future Enhancements

### Potential Features
1. **Multi-batch Selection:** Select multiple batches at once
2. **Department-specific Views:** Custom columns/actions per department
3. **Batch Performance Analytics:** Aggregate statistics by department/batch
4. **Export Filtered Data:** Download filtered routines as PDF/Excel
5. **Saved Filter Presets:** Save frequently used filter combinations
6. **Search within Results:** Text search within filtered routines

### Scalability Considerations
- As batch numbers grow, consider pagination within batch dropdown
- For very large datasets, consider server-side filtering
- Cache department-batch mappings to reduce data duplication

---

## Troubleshooting

### Common Issues

**Batch dropdown not populating:**
- Ensure department is selected first
- Check browser console for JavaScript errors
- Verify departmentBatchData object is correctly defined

**Routines not filtering:**
- Check network tab for API response
- Verify routines have `department` field populated
- Clear browser cache and hard refresh (Ctrl+Shift+R)

**Missing departments in dropdown:**
- Verify department name matches exactly in:
  - RoutineList.js dropdown options
  - AddRoutine.js dropdown options
  - departmentBatchData object keys

---

## API Reference

### GET /api/routines
Returns all routines with department and batch information.

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": 1,
      "course": "Database Systems",
      "teacher": "Dr. Abdul Based",
      "department": "CSE",
      "batch": "D-78A",
      "start_time": "09:00:00",
      "end_time": "10:30:00",
      "created_at": "2025-12-30T..."
    }
  ]
}
```

### POST /api/routines
Creates a new routine with department and batch.

**Request Body:**
```json
{
  "course": "Database Systems",
  "teacher": "Dr. Abdul Based",
  "department": "CSE",
  "batch": "D-78A",
  "start_time": "09:00:00",
  "end_time": "10:30:00"
}
```

---

## Code Examples

### Adding Department-Batch Data for New Department

```javascript
// In RoutineList.js and AddRoutine.js
const departmentBatchData = {
  // ... existing departments
  'New Department': Array.from({ length: 10 }, (_, i) => `ND-${i + 1}`)
  // Generates: ND-1, ND-2, ..., ND-10
};
```

### Custom Batch Naming Patterns

```javascript
// Pattern 1: Simple numeric range
'Economics': Array.from({ length: 21 - 11 + 1 }, (_, i) => `${11 + i}`)
// Result: 11, 12, 13, ..., 21

// Pattern 2: Prefix-number format
'BBA': Array.from({ length: 122 - 93 + 1 }, (_, i) => `P-${93 + i}`)
// Result: P-93, P-94, ..., P-122

// Pattern 3: Multiple ranges combined
'Civil': [
  ...Array.from({ length: 27 - 15 + 1 }, (_, i) => `D-${15 + i}`),
  ...Array.from({ length: 73 - 55 + 1 }, (_, i) => `E-${55 + i}`)
]
// Result: D-15, D-16, ..., D-27, E-55, E-56, ..., E-73

// Pattern 4: With special cases
'CSE': [
  ...Array.from({ length: 105 - 67 + 1 }, (_, i) => {
    const num = 67 + i;
    if (num === 78) return ['D-78A', 'D-78B'];
    if (num === 100) return ['D-100A', 'D-100B'];
    return `D-${num}`;
  }).flat(),
  ...Array.from({ length: 125 - 83 + 1 }, (_, i) => `E-${83 + i}`)
]
// Result: D-67, ..., D-78A, D-78B, ..., D-100A, D-100B, ..., E-125
```

---

## Testing Checklist

- [ ] All 13 departments appear in dropdown
- [ ] Batch dropdown disabled when "All Departments" selected
- [ ] Batch dropdown enables when specific department selected
- [ ] Correct batches shown for each department
- [ ] Table filters correctly by department
- [ ] Table filters correctly by batch
- [ ] Combination filters work (department + batch)
- [ ] Filter reset works when changing departments
- [ ] Add routine form enforces department-batch relationship
- [ ] New routines appear in filtered views correctly
- [ ] Total count updates accurately
- [ ] Backend validates department field
- [ ] Migration script executes without errors

---

## Maintenance Notes

### Updating Batch Ranges

When a new academic year starts or batch numbers change:

1. Update `departmentBatchData` in both files:
   - `/frontend/src/components/Routines/RoutineList.js`
   - `/frontend/src/components/Routines/AddRoutine.js`

2. Ensure both files have identical data structures

3. Test thoroughly with new batch numbers

### Adding New Department

1. Add to `departmentBatchData` object with batch array
2. Add `<option>` to department dropdown in both components
3. Update this documentation
4. Communicate changes to administrators

---

## Contact & Support

For issues or feature requests related to the department-batch search:
- Check GitHub issues
- Contact development team
- Review code comments in source files

---

**Last Updated:** December 30, 2025
**Version:** 1.0
**Author:** University Management System Team
