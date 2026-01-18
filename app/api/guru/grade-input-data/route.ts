import { NextRequest, NextResponse } from 'next/server';
import { requireGuruSession } from '@/lib/auth/guru-auth';
import { db } from '@/db';
import { classes, subjects, students, users, guruKelas, kelasMataPelajaran, grades } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

/**
 * GET /api/guru/grade-input-data
 * 
 * Consolidated endpoint that returns all data needed for the grade input page in a single call.
 * This replaces 4 separate API calls with 1 comprehensive call.
 * 
 * Returns:
 * - classes: All classes taught by the guru
 * - subjectsByClass: Subjects grouped by class ID
 * - studentsByClass: Students grouped by class ID
 * - existingGrades: All existing grades for this guru
 */
export async function GET(req: NextRequest) {
    try {
        // Validate session and get guru profile
        const teacher = await requireGuruSession();

        // 1. Get all classes taught by this teacher
        const teacherClasses = await db
            .select({
                id: classes.id,
                name: classes.name,
                academicYear: classes.academicYear,
            })
            .from(guruKelas)
            .innerJoin(classes, eq(guruKelas.classId, classes.id))
            .where(eq(guruKelas.teacherId, teacher.id))
            .orderBy(classes.name);

        if (teacherClasses.length === 0) {
            // Teacher has no classes assigned
            return NextResponse.json({
                classes: [],
                subjectsByClass: {},
                studentsByClass: {},
                existingGrades: {}
            });
        }

        const classIds = teacherClasses.map(c => c.id);

        // 2. Get all subjects for these classes (grouped by class)
        const classSubjects = await db
            .select({
                classId: kelasMataPelajaran.classId,
                subjectId: subjects.id,
                name: subjects.name,
                code: subjects.code,
                description: subjects.description,
            })
            .from(kelasMataPelajaran)
            .innerJoin(subjects, eq(kelasMataPelajaran.subjectId, subjects.id))
            .where(inArray(kelasMataPelajaran.classId, classIds))
            .orderBy(subjects.name);

        // Group subjects by classId
        const subjectsByClass: Record<string, any[]> = {};
        classSubjects.forEach(({ classId, subjectId, name, code, description }) => {
            if (!subjectsByClass[classId]) {
                subjectsByClass[classId] = [];
            }
            subjectsByClass[classId].push({
                id: subjectId,
                name,
                code,
                description,
            });
        });

        // 3. Get all students in these classes (grouped by class)
        const classStudents = await db
            .select({
                id: students.id,
                nis: students.nis,
                userId: students.userId,
                classId: students.classId,
                phone: students.phone,
                address: students.address,
                dateOfBirth: students.dateOfBirth,
            })
            .from(students)
            .where(inArray(students.classId, classIds))
            .orderBy(students.nis);

        // Get user info for all students
        const userIds = classStudents.map(s => s.userId);
        const studentUsers = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
            })
            .from(users)
            .where(inArray(users.id, userIds));

        // Create user lookup map
        const userMap = new Map(studentUsers.map(u => [u.id, u]));

        // Group students by classId with user info
        const studentsByClass: Record<string, any[]> = {};
        classStudents.forEach(student => {
            const user = userMap.get(student.userId);
            if (!studentsByClass[student.classId!]) {
                studentsByClass[student.classId!] = [];
            }
            studentsByClass[student.classId!].push({
                id: student.id,
                nis: student.nis,
                name: user?.name || '',
                email: user?.email || '',
                phone: student.phone,
                address: student.address,
                dateOfBirth: student.dateOfBirth,
            });
        });

        // 4. Get all existing grades for this teacher
        const studentIds = classStudents.map(s => s.id);
        const existingGrades = studentIds.length > 0
            ? await db
                .select({
                    id: grades.id,
                    studentId: grades.studentId,
                    subjectId: grades.subjectId,
                    classId: grades.classId,
                    score: grades.score,
                    semester: grades.semester,
                    academicYear: grades.academicYear,
                    remarks: grades.remarks,
                })
                .from(grades)
                .where(
                    and(
                        eq(grades.teacherId, teacher.id),
                        inArray(grades.studentId, studentIds)
                    )
                )
            : [];

        // Group grades by a composite key: classId-subjectId-semester-academicYear
        const gradesByKey: Record<string, any[]> = {};
        existingGrades.forEach(grade => {
            const key = `${grade.classId}-${grade.subjectId}-${grade.semester}-${grade.academicYear}`;
            if (!gradesByKey[key]) {
                gradesByKey[key] = [];
            }
            gradesByKey[key].push(grade);
        });

        return NextResponse.json({
            classes: teacherClasses,
            subjectsByClass,
            studentsByClass,
            existingGrades: gradesByKey,
        });
    } catch (error: any) {
        console.error('Error fetching grade input data:', error);

        // Handle specific error messages from validation helpers
        if (error.message?.includes('Unauthorized') || error.message?.includes('Teacher profile not found')) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch grade input data' },
            { status: 500 }
        );
    }
}
