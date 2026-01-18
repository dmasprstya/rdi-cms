import { auth } from '@/auth';
import { db } from '@/db';
import { teachers, guruKelas } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Get the current guru's profile from the database
 * @throws Error if user is not authenticated or teacher profile not found
 */
export async function getGuruProfile(userId: string) {
    const [teacher] = await db
        .select()
        .from(teachers)
        .where(eq(teachers.userId, userId))
        .limit(1);

    if (!teacher) {
        throw new Error('Teacher profile not found');
    }

    return teacher;
}

/**
 * Verify that a guru teaches a specific class
 * @throws Error if guru does not teach the class
 */
export async function verifyGuruTeachesClass(teacherId: string, classId: string) {
    const [teaches] = await db
        .select()
        .from(guruKelas)
        .where(
            and(
                eq(guruKelas.teacherId, teacherId),
                eq(guruKelas.classId, classId)
            )
        )
        .limit(1);

    if (!teaches) {
        throw new Error('You do not teach this class');
    }

    return teaches;
}

/**
 * Require guru access to a class - validates session, role, and class access
 * @returns Teacher ID and profile
 * @throws Error if unauthorized or forbidden
 */
export async function requireGuruAccess(classId: string) {
    const session = await auth();

    if (!session || session.user.role !== 'guru') {
        throw new Error('Unauthorized - Guru access required');
    }

    const teacher = await getGuruProfile(session.user.id);
    await verifyGuruTeachesClass(teacher.id, classId);

    return teacher;
}

/**
 * Validate session and return guru profile (without class validation)
 * @throws Error if unauthorized
 */
export async function requireGuruSession() {
    const session = await auth();

    if (!session || session.user.role !== 'guru') {
        throw new Error('Unauthorized - Guru access required');
    }

    const teacher = await getGuruProfile(session.user.id);
    return teacher;
}
