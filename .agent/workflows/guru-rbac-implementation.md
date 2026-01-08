---
description: Guru RBAC & Admin Restructure Implementation Plan
---

# Sistem Terintegrasi - Guru RBAC Implementation Plan

## 🎯 Project Overview
Comprehensive restructure of the school management system to:
1. Simplify admin menu to 3 core features
2. Add new "Guru" (Teacher) role with dedicated dashboard and features
3. Implement proper role-based access control (RBAC)
4. Create grade input system for teachers
5. Move existing features from admin to appropriate roles

## 📋 Phase 1: Database Schema Updates

### 1.1 Update Role Enum
**File**: `db/schema.ts`
- Add 'guru' to roleEnum: `['admin', 'staff', 'student', 'editor', 'guru']`

### 1.2 Create New Tables

#### Table: `guru_kelas` (Junction table for many-to-many)
```typescript
export const guruKelas = pgTable('guru_kelas', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    teacherId: text('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
    classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

#### Table: `kelas_mata_pelajaran` (Classes and their subjects)
```typescript
export const kelasMataPelajaran = pgTable('kelas_mata_pelajaran', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 1.3 Update Existing Tables

#### Update `grades` table
Add foreign keys:
- `classId`: link to which class the grade was for
- `teacherId`: which teacher input the grade

```typescript
export const grades = pgTable('grades', {
    // ... existing fields
    classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    teacherId: text('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
});
```

#### Update `modules` table
Already has `teacherId`, ensure it's properly used

#### Update `announcements` table
Already has `authorId`, ensure teachers can create their own

### 1.4 Add Relations
```typescript
export const guruKelasRelations = relations(guruKelas, ({ one }) => ({
    teacher: one(teachers, {
        fields: [guruKelas.teacherId],
        references: [teachers.id],
    }),
    class: one(classes, {
        fields: [guruKelas.classId],
        references: [classes.id],
    }),
}));

export const kelasMataPelajaranRelations = relations(kelasMataPelajaran, ({ one }) => ({
    class: one(classes, {
        fields: [kelasMataPelajaran.classId],
        references: [classes.id],
    }),
    subject: one(subjects, {
        fields: [kelasMataPelajaran.subjectId],
        references: [subjects.id],
    }),
}));
```

### 1.5 Database Migration
```bash
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

## 📋 Phase 2: Middleware & Authentication Updates

### 2.1 Update Middleware
**File**: `middleware.ts`

Add guru route protection:
```typescript
const isGuruPage = nextUrl.pathname.startsWith('/guru');

// Protect guru routes (guru only)
if (isGuruPage) {
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    if (userRole !== 'guru') {
        if (userRole === 'student') {
            return NextResponse.redirect(new URL('/student', req.url));
        }
        if (userRole === 'editor') {
            return NextResponse.redirect(new URL('/editor', req.url));
        }
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
}
```

Update login redirect logic to handle 'guru' role:
```typescript
if (isAuthPage && isLoggedIn) {
    if (userRole === 'student') {
        return NextResponse.redirect(new URL('/student', req.url));
    }
    if (userRole === 'editor') {
        return NextResponse.redirect(new URL('/editor', req.url));
    }
    if (userRole === 'guru') {
        return NextResponse.redirect(new URL('/guru', req.url));
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
}
```

### 2.2 Update Auth Config
**File**: `auth.ts`

Ensure callback handles 'guru' role properly (should already work)

## 📋 Phase 3: Admin Dashboard Restructure

### 3.1 Update Admin Dashboard
**File**: `app/dashboard/page.tsx`

Update to show only 3 menu items:
- Kelola Siswa
- Kelola Guru  
- Kelola Kelas

Remove:
- Kelola Modul (moved to guru)
- Input Nilai (moved to guru)
- Buat Pengumuman (moved to guru)

### 3.2 Create "Kelola Kelas" Feature

#### API Routes

**File**: `app/api/classes/route.ts`
```typescript
// GET - List all classes
// POST - Create new class
```

**File**: `app/api/classes/[id]/route.ts`
```typescript
// GET - Get class details
// PUT - Update class
// DELETE - Delete class
```

**File**: `app/api/classes/[id]/students/route.ts`
```typescript
// GET - Get students in a class
// PUT - Assign students to class
```

#### UI Component

**File**: `components/admin/classes-management.tsx`
- DataTable with columns: Nama Kelas, Jumlah Siswa, Aksi
- Add Class Dialog
- Edit Class Dialog
- Delete Confirmation
- View Students in Class

**File**: `app/dashboard/classes/page.tsx`
- Main page that uses ClassesManagement component

### 3.3 Update "Kelola Siswa" Feature

**File**: `components/admin/students-management.tsx`

Add:
- Class selection dropdown in Add/Edit Student form
- Display class name in student list table

### 3.4 Update "Kelola Guru" Feature

**File**: `components/admin/teachers-management.tsx`

Add:
- Multiple class selection in Add/Edit Teacher form
- Display assigned classes in teacher list table

**File**: `app/api/teachers/[id]/classes/route.ts`
```typescript
// GET - Get teacher's classes
// PUT - Update teacher's classes
```

## 📋 Phase 4: Create Guru Dashboard

### 4.1 Create Guru Layout

**File**: `app/guru/layout.tsx`
```typescript
// Similar to dashboard/layout.tsx but:
// - Check for 'guru' role
// - Display "Guru Dashboard" title
// - Different color scheme (green theme)
```

### 4.2 Create Guru Dashboard Page

**File**: `app/guru/page.tsx`

Display:
1. **Stats Cards**:
   - Total Modul Pelajaran (from modules where teacherId = current user)
   - Total Siswa (count from assigned classes)
   - Total Pengumuman Aktif (from announcements where authorId = current user)

2. **Quick Actions**:
   - Tambah Modul → /guru/modules
   - Input Nilai → /guru/grades
   - Buat Pengumuman → /guru/announcements

3. **Recent Activity**:
   - Latest modules created
   - Latest grades input
   - Latest announcements

### 4.3 API Routes for Guru Dashboard

**File**: `app/api/guru/stats/route.ts`
```typescript
// GET - Get dashboard statistics for logged-in teacher
```

## 📋 Phase 5: Guru Menu - Kelola Modul

### 5.1 Move Module Management

**File**: `app/guru/modules/page.tsx`
- Copy from `app/dashboard/modules/page.tsx`
- Filter to show only modules created by logged-in teacher

**File**: `components/guru/modules-management.tsx`
- Similar to admin version
- Only show teacher's own modules
- Auto-assign teacherId when creating module

**File**: `app/api/guru/modules/route.ts`
```typescript
// GET - List modules for logged-in teacher
// POST - Create module (auto-assign teacherId)
```

**File**: `app/api/guru/modules/[id]/route.ts`
```typescript
// GET - Get module details (ensure teacher owns it)
// PUT - Update module (ensure teacher owns it)
// DELETE - Delete module (ensure teacher owns it)
```

## 📋 Phase 6: Guru Menu - Input Nilai

### 6.1 Create "Kelola Mata Pelajaran" Feature (Admin)

First, admin needs to assign subjects to classes.

**File**: `app/dashboard/kelas-mata-pelajaran/page.tsx`
- Manage which subjects are taught in which classes

**File**: `components/admin/kelas-mata-pelajaran-management.tsx`
- CRUD for class-subject assignments

**File**: `app/api/kelas-mata-pelajaran/route.ts`
```typescript
// GET - List all class-subject assignments
// POST - Create assignment
```

### 6.2 Create Grade Input Flow for Guru

**File**: `app/guru/grades/page.tsx`

**Flow**:
1. Teacher selects a class they teach (from guru_kelas)
2. Teacher selects a subject in that class (from kelas_mata_pelajaran)
3. Display list of students in that class
4. Input/edit scores for each student

**File**: `components/guru/grade-input.tsx`
- Step 1: Class Selector
- Step 2: Subject Selector
- Step 3: Student List with Score Input

**File**: `app/api/guru/grades/route.ts`
```typescript
// GET - Get grades for teacher's class/subject
// POST - Batch create/update grades
```

**File**: `app/api/guru/classes/route.ts`
```typescript
// GET - Get classes taught by logged-in teacher
```

**File**: `app/api/guru/classes/[id]/subjects/route.ts`
```typescript
// GET - Get subjects taught in a specific class
```

**File**: `app/api/guru/classes/[id]/students/route.ts`
```typescript
// GET - Get students in a specific class
```

## 📋 Phase 7: Guru Menu - Buat Pengumuman

### 7.1 Move Announcements to Guru

**File**: `app/guru/announcements/page.tsx`
- Copy from `app/dashboard/announcements/page.tsx`
- Filter to show only announcements by logged-in teacher

**File**: `components/guru/announcements-management.tsx`
- Similar to admin version
- Only show teacher's own announcements
- Auto-assign authorId when creating

**File**: `app/api/guru/announcements/route.ts`
```typescript
// GET - List announcements for logged-in teacher
// POST - Create announcement (auto-assign authorId)
```

**File**: `app/api/guru/announcements/[id]/route.ts`
```typescript
// GET - Get announcement details (ensure teacher owns it)
// PUT - Update announcement (ensure teacher owns it)
// DELETE - Delete announcement (ensure teacher owns it)
```

## 📋 Phase 8: UI/UX Consistency

### 8.1 Color Scheme
- **Admin**: Yellow/Gold theme (existing)
- **Guru**: Green theme
- **Siswa**: Blue theme (existing)
- **Kelas**: Orange accents
- **Mata Pelajaran**: Purple accents

### 8.2 Components to Update/Create
- [ ] `<DataTable>` - reusable table component
- [ ] `<StatusBadge>` - for status indicators
- [ ] `<ConfirmDialog>` - for delete confirmations
- [ ] `<MultiSelect>` - for selecting multiple classes
- [ ] `<ClassSelector>` - for grade input flow
- [ ] `<SubjectSelector>` - for grade input flow
- [ ] `<GradeInputTable>` - for batch grade input

### 8.3 Toast Notifications
Ensure all operations show:
- Success: "Data berhasil disimpan"
- Error: "Terjadi kesalahan: {error message}"
- Delete: "Data berhasil dihapus"

## 📋 Phase 9: Testing & Validation

### 9.1 Role-Based Access Testing
- [ ] Admin cannot access /guru routes
- [ ] Guru cannot access /dashboard routes
- [ ] Student cannot access admin or guru routes
- [ ] Proper redirects after login based on role

### 9.2 Feature Testing
- [ ] Admin: CRUD Kelas works correctly
- [ ] Admin: Assign students to kelas works
- [ ] Admin: Assign teachers to multiple kelas works
- [ ] Admin: Assign subjects to kelas works
- [ ] Guru: Can only see/edit own modules
- [ ] Guru: Grade input flow works end-to-end
- [ ] Guru: Can only input grades for own classes/subjects
- [ ] Guru: Can only see/edit own announcements

### 9.3 Data Integrity
- [ ] Cascade deletes work properly
- [ ] Students can be reassigned between classes
- [ ] Teachers can teach multiple classes
- [ ] Grades linked to correct class, student, subject, and teacher

## 📋 Phase 10: Documentation & Cleanup

### 10.1 Remove Old Files
- [ ] Remove old `/dashboard/modules` if moved completely
- [ ] Remove old `/dashboard/grades` if moved completely
- [ ] Remove old `/dashboard/announcements` if moved completely

Or keep them if admin still needs read-only access.

### 10.2 Update README
- [ ] Document new role structure
- [ ] Document API endpoints
- [ ] Document database schema changes

### 10.3 Code Comments
- [ ] Add JSDoc comments to new functions
- [ ] Document complex business logic
- [ ] Add inline comments for authorization checks

## 🚀 Implementation Order

### Stage 1: Database & Auth (Do First)
1. Update schema.ts
2. Run migrations
3. Update middleware.ts
4. Test role-based redirects

### Stage 2: Admin Restructure
1. Create Kelola Kelas feature
2. Update Kelola Siswa (add class assignment)
3. Update Kelola Guru (add multiple class selection)
4. Update admin dashboard page

### Stage 3: Guru Dashboard
1. Create guru layout
2. Create guru dashboard page
3. Create guru stats API

### Stage 4: Guru Features
1. Move Kelola Modul to guru (with filtering)
2. Create Kelola Mata Pelajaran (admin)
3. Create Input Nilai feature (guru)
4. Move Buat Pengumuman to guru (with filtering)

### Stage 5: Polish & Test
1. UI/UX consistency pass
2. Test all scenarios
3. Fix bugs
4. Documentation

## ⚠️ Important Notes

1. **Data Migration**: Existing data may need migration:
   - Teachers need to be assigned to classes in `guru_kelas`
   - Subjects need to be assigned to classes in `kelas_mata_pelajaran`
   - Existing grades may need `classId` and `teacherId` populated

2. **Backward Compatibility**: Consider if you need to maintain old admin routes for migration period

3. **Permissions**: Every API route must check:
   - User is authenticated
   - User has correct role
   - User owns the resource (for guru-specific routes)

4. **UI Consistency**: Use semantic color tokens from globals.css

## 📝 SQL Seed Data Examples

### Create a guru user
```sql
INSERT INTO users (id, name, email, password, role)
VALUES (
    gen_random_uuid(),
    'Guru Test',
    'guru@test.com',
    -- hash of 'password123'
    '$2a$10$...',
    'guru'
);
```

### Assign guru to classes
```sql
INSERT INTO guru_kelas (id, teacher_id, class_id)
SELECT 
    gen_random_uuid(),
    t.id,
    c.id
FROM teachers t
CROSS JOIN classes c
WHERE t.user_id = 'guru-user-id'
AND c.name IN ('X-1', 'X-2');
```

### Assign subjects to classes
```sql
INSERT INTO kelas_mata_pelajaran (id, class_id, subject_id)
SELECT
    gen_random_uuid(),
    c.id,
    s.id
FROM classes c
CROSS JOIN subjects s
WHERE c.name = 'X-1';
```

---

**Total Estimated Files to Create/Modify**: ~40 files
**Estimated Implementation Time**: 3-5 days for complete implementation
**Complexity**: High (involves database, auth, and multiple UI changes)
