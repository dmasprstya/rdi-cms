import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { grades, students, subjects, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/student/grades - Get all grades for the authenticated student
export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        // Authentication check
        if (!session || session.user.role !== 'student') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get student profile with user info in a single query
        const [studentProfile] = await db
            .select({
                studentId: students.id,
                studentName: users.name,
                classId: students.classId,
                userId: students.userId,
            })
            .from(students)
            .innerJoin(users, eq(students.userId, users.id))
            .where(eq(students.userId, session.user.id))
            .limit(1);

        // Edge case: Student profile not found
        if (!studentProfile) {
            return NextResponse.json(
                { error: 'Student profile not found' },
                { status: 404 }
            );
        }

        // Edge case: Student doesn't have studentId (should not happen but defense in depth)
        if (!studentProfile.studentId) {
            return NextResponse.json(
                { error: 'Student ID not assigned' },
                { status: 400 }
            );
        }

        // Edge case: Student not assigned to any class yet
        if (!studentProfile.classId) {
            return NextResponse.json({
                grades: [],
                message: 'You are not assigned to any class yet',
                isEmpty: true,
            });
        }

        // Authorization check: Ensure we're fetching grades for the authenticated student only
        const authorizedStudentId = studentProfile.studentId;

        // Optimized query: Single query with JOIN to get all grades with subject info
        const studentGrades = await db
            .select({
                id: grades.id,
                score: grades.score,
                semester: grades.semester,
                academicYear: grades.academicYear,
                remarks: grades.remarks,
                createdAt: grades.createdAt,
                // Subject info
                subjectId: subjects.id,
                subjectName: subjects.name,
                subjectCode: subjects.code,
            })
            .from(grades)
            .innerJoin(subjects, eq(grades.subjectId, subjects.id)) // INNER JOIN to handle deleted subjects
            .where(eq(grades.studentId, authorizedStudentId))
            .orderBy(grades.academicYear, grades.semester, subjects.name);

        // Edge case: No grades found
        if (studentGrades.length === 0) {
            return NextResponse.json({
                grades: [],
                message: 'No grades available yet',
                isEmpty: true,
            });
        }

        // Group grades by academic year and semester for better organization
        const groupedGrades = studentGrades.reduce((acc, grade) => {
            const key = `${grade.academicYear}-${grade.semester}`;
            if (!acc[key]) {
                acc[key] = {
                    academicYear: grade.academicYear,
                    semester: grade.semester,
                    grades: [],
                };
            }
            acc[key].grades.push({
                id: grade.id,
                subject: grade.subjectName,
                subjectCode: grade.subjectCode,
                score: grade.score,
                remarks: grade.remarks,
                createdAt: grade.createdAt,
            });
            return acc;
        }, {} as Record<string, any>);

        // Convert to array and sort by year and semester (most recent first)
        const gradesArray = Object.values(groupedGrades).sort((a: any, b: any) => {
            // Sort by academic year descending
            if (a.academicYear !== b.academicYear) {
                return b.academicYear.localeCompare(a.academicYear);
            }
            // Then by semester descending
            return b.semester - a.semester;
        });

        return NextResponse.json({
            grades: gradesArray,
            studentInfo: {
                name: studentProfile.studentName,
                classId: studentProfile.classId,
            },
            isEmpty: false,
            totalGrades: studentGrades.length,
        });
    } catch (error) {
        console.error('Error fetching student grades:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch grades',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
