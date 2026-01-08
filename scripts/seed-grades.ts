import 'dotenv/config';
import { db } from '../db';
import { grades, students, subjects, teachers } from '../db/schema';
import { eq } from 'drizzle-orm';

async function seedGrades() {
    try {
        console.log('🌱 Seeding grades...');

        // Get all students, subjects, and teachers
        const allStudents = await db.select().from(students);
        const allSubjects = await db.select().from(subjects);
        const allTeachers = await db.select().from(teachers);

        if (allStudents.length === 0) {
            console.log('⚠️ No students found. Please run seed-students first.');
            return;
        }

        if (allSubjects.length === 0) {
            console.log('⚠️ No subjects found. Please run seed-subjects first.');
            return;
        }

        if (allTeachers.length === 0) {
            console.log('⚠️ No teachers found. Please run seed-teachers first.');
            return;
        }

        const academicYear = '2024/2025';
        const semester = 1;
        const defaultTeacher = allTeachers[0]; // Use first teacher as default

        // Generate grades for each student
        for (const student of allStudents) {
            if (!student.classId) {
                console.log(`⚠️ Skipping student ${student.id} - no class assigned`);
                continue;
            }

            // Assign grades for 6-8 random subjects
            const numSubjects = Math.floor(Math.random() * 3) + 6; // 6-8 subjects
            const shuffledSubjects = [...allSubjects].sort(() => Math.random() - 0.5);
            const selectedSubjects = shuffledSubjects.slice(0, numSubjects);

            for (const subject of selectedSubjects) {
                // Generate random grade between 70 and 100
                const score = Math.floor(Math.random() * 31) + 70;

                // Generate remarks based on score
                let remarks = null;
                if (score >= 90) {
                    remarks = 'Sangat baik! Pertahankan prestasi.';
                } else if (score >= 80) {
                    remarks = 'Baik, tingkatkan lagi!';
                } else if (score >= 75) {
                    remarks = 'Cukup baik, perlu lebih fokus.';
                }

                await db.insert(grades).values({
                    studentId: student.id,
                    subjectId: subject.id,
                    classId: student.classId,
                    teacherId: defaultTeacher.id,
                    score,
                    semester,
                    academicYear,
                    remarks,
                });
            }

            console.log(`✅ Created grades for student ID: ${student.id}`);
        }

        console.log(`✅ Grades seeding completed! Created grades for ${allStudents.length} students.`);
    } catch (error) {
        console.error('❌ Error seeding grades:', error);
        throw error;
    }
}

// Run the seed
seedGrades()
    .then(() => {
        console.log('Seed completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exit(1);
    });
