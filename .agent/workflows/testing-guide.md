# 🧪 Guru RBAC Testing Guide

## 📋 Complete Testing Checklist

Use this guide to test all features of the Guru RBAC system.

---

## 🚀 SETUP TESTING

### Prerequisites
- [ ] Database is running
- [ ] Migrations applied (`add-guru-rbac.sql`)
- [ ] Seed data applied (`seed-guru-rbac.sql`)
- [ ] Dev server running (`npm run dev`)

### Test Credentials

**Admin User:**
- Email: admin@sekolah.com
- Password: (your existing admin password)

**Guru User (from seed):**
- Email: guru@sekolah.com
- Password: guru123 (or hash from seed)

**Student User (from seed):**
- Email: siswa1@sekolah.com
- Password: student123

---

## 1️⃣ AUTHENTICATION & AUTHORIZATION

### Test Login Redirects
- [ ] Login as admin → redirects to `/dashboard`
- [ ] Login as guru → redirects to `/guru`
- [ ] Login as student → redirects to `/student`
- [ ] Login as editor → redirects to `/editor`

### Test Route Protection
- [ ] Admin cannot access `/guru/*` (should redirect to `/dashboard`)
- [ ] Guru cannot access `/dashboard/*` (should redirect to `/guru`)
- [ ] Student cannot access admin or guru routes
- [ ] Unauthenticated users redirect to `/login`

**Test URLs:**
```
/guru (only guru can access)
/guru/modules (only guru can access)
/guru/grades (only guru can access)
/guru/announcements (only guru can access)
/dashboard (admin/staff only)
/dashboard/classes (admin/staff only)
/dashboard/kelas-mata-pelajaran (admin/staff only)
```

---

## 2️⃣ ADMIN FEATURES

### Kelola Kelas (Class Management)
- [ ] Navigate to `/dashboard/classes`
- [ ] See list of classes with student counts
- [ ] Click "Tambah Kelas"
- [ ] Fill form: Name, Grade, Academic Year
- [ ] Submit → Class appears in table
- [ ] Click "Edit" on a class
- [ ] Update class name
- [ ] Submit → Changes reflected
- [ ] Click "Hapus" on a class
- [ ] Confirm deletion → Class removed

**Expected:**
- ✅ Orange-themed buttons
- ✅ Student count displays correctly
- ✅ Toast notifications on success/error
- ✅ Empty state if no classes

### Kelola Mata Pelajaran (Subject-Class Assignment)
- [ ] Navigate to `/dashboard/kelas-mata-pelajaran`
- [ ] See list of class-subject assignments
- [ ] Click "Tambah Assignment"
- [ ] Select a class
- [ ] Select a subject
- [ ] Submit → Assignment appears in table
- [ ] Try to add same class-subject again
- [ ] Should show error: "already assigned"
- [ ] Click "Hapus" on an assignment
- [ ] Confirm → Assignment removed

**Expected:**
- ✅ Purple-themed buttons
- ✅ Duplicate prevention works
- ✅ Shows class grade and subject code
- ✅ Cannot delete if grades exist (optional check)

---

## 3️⃣ GURU DASHBOARD

### Access & Layout
- [ ] Login as guru
- [ ] See green-themed dashboard
- [ ] Logo shows "G" icon
- [ ] Name displays correctly
- [ ] Logout button works

### Statistics Cards
- [ ] **Total Modul** - shows count of modules created
- [ ] **Total Kelas** - shows count of assigned classes
- [ ] **Total Siswa** - shows total students in taught classes
- [ ] **Pengumuman Aktif** - shows count of active announcements

### Quick Actions
- [ ] "Kelola Modul" button (green) → navigates to `/guru/modules`
- [ ] "Input Nilai" button → navigates to `/guru/grades`
- [ ] "Buat Pengumuman" button → navigates to `/guru/announcements`

**Expected:**
- ✅ All stats load correctly
- ✅ Green gradient theme throughout
- ✅ Activity feed shows welcome message

---

## 4️⃣ KELOLA MODUL (Guru)

- [ ] Navigate to `/guru/modules`
- [ ] See list of teacher's modules (not other teachers')
- [ ] Click "Tambah Modul"
- [ ] Fill form:
  - Title: "Test Modul"
  - Subject: Select "Matematika"
  - Class: Select "10-A" or "Semua Kelas"
  - Description: Enter some text
  - Content: Enter module content
  - File URL: (optional) Enter URL
  - Publish: Check/uncheck
- [ ] Submit → Module appears in table
- [ ] Verify subject and class display correctly
- [ ] Check publish status (eye icon)
- [ ] Click "Edit" on module
- [ ] Change title
- [ ] Submit → Changes reflected
- [ ] Click "Hapus"
- [ ] Confirm → Module deleted

**Expected:**
- ✅ Only see modules created by logged-in teacher
- ✅ Subject dropdown shows all subjects
- ✅ Class dropdown shows only teacher's classes
- ✅ "Semua Kelas" option available
- ✅ Green gradient buttons
- ✅ Toast notifications

---

## 5️⃣ INPUT NILAI (Guru) ⭐ CRITICAL

### Step 1: Select Class
- [ ] Navigate to `/guru/grades`
- [ ] See "Langkah 1: Pilih Kelas"
- [ ] Dropdown shows only classes teacher teaches
- [ ] Select "10-A"
- [ ] Click "Lanjut ke Pilih Mata Pelajaran"

### Step 2: Select Subject & Details
- [ ] See selected class displayed
- [ ] Subject dropdown shows only subjects assigned to that class
- [ ] Select "Matematika"
- [ ] Select Semester (1 or 2)
- [ ] Enter Academic Year (e.g., "2024/2025")
- [ ] Click "Lanjut ke Input Nilai"

### Step 3: Input Grades
- [ ] See list of ALL students in the class
- [ ] Each student has:
  - Name and NIS displayed
  - Score input (0-100)
  - Remarks input (optional)
- [ ] Fill in grades for students:
  - Student 1: 85, "Bagus"
  - Student 2: 90, "Excellent"
  - Student 3: 75, "Perlu latihan"
- [ ] Click "Simpan Semua Nilai"
- [ ] Success toast shows count of saved grades
- [ ] Redirects back to Step 1

### Edit Existing Grades
- [ ] Repeat Steps 1-2 with same class/subject/semester/year
- [ ] In Step 3, grades should load automatically
- [ ] Change grade for Student 1: 85 → 88
- [ ] Save → Should update, not create duplicate

**Expected:**
- ✅ Step indicators show progress
- ✅ Purple gradient theme
- ✅ Back buttons work correctly
- ✅ Validation: scores must be 0-100
- ✅ Loading states during fetch
- ✅ Grades persist correctly
- ✅ Can edit previously entered grades

---

## 6️⃣ BUAT PENGUMUMAN (Guru)

- [ ] Navigate to `/guru/announcements`
- [ ] See list of teacher's announcements only
- [ ] Click "Buat Pengumuman"
- [ ] Fill form:
  - Title: "Ujian Besok"
  - Content: "Harap belajar dengan baik"
  - Target: "Siswa"
  - Active: Check
- [ ] Submit → Announcement appears
- [ ] Verify date displays correctly
- [ ] Check active status (eye icon)
- [ ] Click "Edit"
- [ ] Change title
- [ ] Uncheck "Aktifkan"
- [ ] Submit → Changes reflected
- [ ] Status should show "Non-aktif"
- [ ] Click "Hapus"
- [ ] Confirm → Announcement deleted

**Expected:**
- ✅ Only see own announcements
- ✅ Yellow gradient buttons
- ✅ Date formatted in Indonesian
- ✅ Status toggle works
- ✅ Target shows correctly

---

## 7️⃣ DATA INTEGRITY

### Ownership Verification
- [ ] Create module as Guru A
- [ ] Try to access module via API as Guru B
- [ ] Should get 403/404 error
- [ ] Same test for grades and announcements

### Cascade Deletes
- [ ] Delete a class that has students
- [ ] Students should be removed from class (classId = null)
- [ ] Grades should still exist
- [ ] Delete a subject
- [ ] Related assignments should be deleted

### Duplicate Prevention
- [ ] Try to assign same subject to class twice
- [ ] Should show error message
- [ ] Try to create grade for same student/subject/semester/year
- [ ] Should update existing, not create duplicate

---

## 8️⃣ UI/UX TESTS

### Responsive Design
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] All dialogs fit on screen
- [ ] Tables scroll horizontally if needed

### Loading States
- [ ] All data fetches show loading spinner
- [ ] Tables show "Loading..." message
- [ ] Buttons show "Menyimpan..." when submitting

### Empty States
- [ ] Visit `/guru/modules` with no modules
- [ ] Should show helpful empty message
- [ ] Same for grades list, announcements

### Error Handling
- [ ] Disconnect database
- [ ] Try to fetch data → Should show error toast
- [ ] Reconnect → Should work again
- [ ] Submit invalid form → Should show validation errors

---

## 9️⃣ PERFORMANCE

### Load Times
- [ ] Dashboard loads < 2 seconds
- [ ] Module list loads < 1 second
- [ ] Grade input Step 3 loads < 2 seconds
- [ ] No console errors

### Database Queries
- [ ] Check server logs for N+1 queries
- [ ] Verify joins are used correctly
- [ ] No unnecessary database calls

---

## 🔟 SECURITY TESTS

### API Endpoint Protection
Test each endpoint with different roles:

#### `/api/guru/modules`
- [ ] ✅ Guru can access
- [ ] ❌ Admin gets 401
- [ ] ❌ Student gets 401
- [ ] ❌ Unauthenticated gets 401

#### `/api/guru/grades`
- [ ] ✅ Guru can access
- [ ] ❌ Others get 401

#### `/api/guru/announcements`
- [ ] ✅ Guru can access
- [ ] ❌ Others get 401

#### `/api/classes` (Admin only)
- [ ] ✅ Admin can access
- [ ] ✅ Staff can access
- [ ] ❌ Guru gets 401
- [ ] ❌ Student gets 401

---

## ✅ FINAL CHECKLIST

### Core Functionality
- [ ] All CRUD operations work
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No database errors

### User Experience
- [ ] All toasts show correct messages
- [ ] Loading states everywhere
- [ ] Empty states helpful
- [ ] Colors consistent

### Security
- [ ] Role-based access works
- [ ] Ownership verification works
- [ ] No unauthorized data access
- [ ] SQL injection prevented

### Data Integrity
- [ ] Foreign keys enforced
- [ ] Cascades work correctly
- [ ] Duplicates prevented
- [ ] Validation works

---

## 🐛 KNOWN ISSUES TO CHECK

1. **Announcements Table** - May not have targetRole field
   - Check if announcements table exists
   - Verify schema matches code

2. **Password Hashing** - Seed data uses placeholder
   - Need to generate proper bcrypt hashes
   - Or create users via signup form

3. **Timezone** - Dates may show in UTC
   - Check date formatting
   - Verify Indonesian locale

---

## 📝 TESTING NOTES

**Date Tested**: _____________  
**Tester**: _____________  
**Environment**: Development / Staging / Production  

**Issues Found**:
1. 
2. 
3. 

**Overall Status**: ⭕ Pass / ❌ Fail  

---

## 🎯 ACCEPTANCE CRITERIA

For the system to be considered **production-ready**, all of these must pass:

✅ All authentication/authorization tests pass  
✅ All CRUD operations work correctly  
✅ No security vulnerabilities  
✅ No data integrity issues  
✅ UI/UX is smooth and intuitive  
✅ Performance is acceptable  
✅ Error handling is comprehensive  

**Current Status**: _____________  
**Ready for Production?**: Yes / No / Needs Work  

---

*Last Updated*: 2025-12-24  
*Version*: 1.0  
*For*: Guru RBAC System
