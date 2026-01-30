-- Migration script to add department column to routines table
-- Run this if you have an existing database

USE university_system;

-- Add department column
ALTER TABLE routines 
ADD COLUMN department VARCHAR(50) NOT NULL DEFAULT 'CSE' AFTER teacher;

-- Add index for better query performance
ALTER TABLE routines 
ADD INDEX idx_department (department);

-- Make day column nullable (since it's optional now)
ALTER TABLE routines 
MODIFY COLUMN day VARCHAR(20);

-- Display success message
SELECT 'Migration completed successfully! Department column added to routines table.' AS message;
