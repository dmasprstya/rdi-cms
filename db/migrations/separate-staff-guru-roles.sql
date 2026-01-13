-- Migration: Separate Staff and Guru Roles
-- Purpose: Update existing teachers from 'staff' role to 'guru' role
-- Date: 2026-01-12
-- 
-- CRITICAL: Run this migration AFTER deploying code changes that fix
-- teacher creation and API authorization checks

-- =============================================================================
-- FASE 1: Update Teachers to 'guru' Role
-- =============================================================================
-- This updates ONLY users who are in the teachers table
-- Safe because teachers table = guru (teachers who teach)

BEGIN;

-- Update users who are teachers
UPDATE users 
SET role = 'guru',
    updated_at = NOW()
WHERE id IN (
  SELECT user_id 
  FROM teachers 
  WHERE user_id IS NOT NULL
);

-- Log the number of affected rows
-- Expected: All records in teachers table

COMMIT;

-- =============================================================================
-- FASE 2: Audit - Check for Orphaned 'staff' Users
-- =============================================================================
-- This query identifies users with role='staff' who are NOT in teachers table
-- These might be:
-- 1. Admin assistants (intentional staff users)
-- 2. Data corruption (should be investigated)

SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.created_at
FROM users u
LEFT JOIN teachers t ON u.id = t.user_id
WHERE u.role = 'staff' 
  AND t.user_id IS NULL
ORDER BY u.created_at DESC;

-- If this query returns results:
-- ACTION REQUIRED: Manually review each user to determine if they should be:
-- - Converted to 'guru' (if they should have a teacher record)
-- - Left as 'staff' (if they are admin assistants)
-- - Deleted (if they are orphaned/corrupt data)

-- =============================================================================
-- FASE 3 (Optional): Create Staff Admin Users
-- =============================================================================
-- Only run this if you have actual admin assistant staff who need access
-- to manage classes but NOT teach

-- Example: Create a staff admin user
-- UNCOMMENT AND MODIFY AS NEEDED:

/*
INSERT INTO users (id, name, email, password, role, created_at, updated_at)
VALUES (
    gen_random_uuid()::text,
    'Staff Admin Name',
    'staff@sekolah.com',
    '$2a$10$...', -- hashed password using bcrypt
    'staff',
    NOW(),
    NOW()
);
*/

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Count users by role (should show guru count = teachers table count)
SELECT role, COUNT(*) as count
FROM users
GROUP BY role
ORDER BY role;

-- Verify all teachers have 'guru' role
SELECT 
    t.id as teacher_id,
    u.id as user_id,
    u.name,
    u.email,
    u.role,
    CASE 
        WHEN u.role = 'guru' THEN '✅ Correct'
        ELSE '❌ WRONG ROLE: ' || u.role
    END as status
FROM teachers t
INNER JOIN users u ON t.user_id = u.id
ORDER BY u.role, u.name;

-- Check for any remaining guru/staff role confusion
SELECT 
    'Teachers with wrong role' as issue,
    COUNT(*) as count
FROM teachers t
INNER JOIN users u ON t.user_id = u.id
WHERE u.role != 'guru';

-- =============================================================================
-- ROLLBACK SCRIPT (USE ONLY IF MIGRATION FAILS)
-- =============================================================================
-- CAUTION: This will revert users back to 'staff' role
-- Only use if you need to rollback the migration

/*
BEGIN;

UPDATE users 
SET role = 'staff',
    updated_at = NOW()
WHERE id IN (
  SELECT user_id 
  FROM teachers 
  WHERE user_id IS NOT NULL
);

COMMIT;
*/

-- =============================================================================
-- POST-MIGRATION CHECKLIST
-- =============================================================================
-- [ ] Run FASE 1 (UPDATE users)
-- [ ] Run FASE 2 (Audit query) and review results
-- [ ] Run verification queries
-- [ ] Test guru login and dashboard access
-- [ ] Test guru can create modules, input grades, create announcements
-- [ ] Test guru CANNOT access /staff routes
-- [ ] If staff admin users exist, test they can manage classes
-- [ ] If staff admin users exist, test they CANNOT create modules/grades
-- [ ] Verify no 500 errors in application logs
-- [ ] Document any orphaned users found and actions taken
