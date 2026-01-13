import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, teachers, guruKelas } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET - Fetch all teachers with user info
export async function GET() {
    try {
        const session = await auth();
        if (!session || !['admin', 'staff'].includes(session.user.role)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch all teachers with their user info
        const teachersData = await db
            .select({
                id: teachers.id,
                nip: teachers.nip,
                subject: teachers.subject,
                phone: teachers.phone,
                dateOfBirth: teachers.dateOfBirth,
                userId: teachers.userId,
                userName: users.name,
                userEmail: users.email,
            })
            .from(teachers)
            .leftJoin(users, eq(teachers.userId, users.id));

        // Fetch class IDs for each teacher
        const teachersWithClasses = await Promise.all(
            teachersData.map(async (teacher) => {
                const teacherClasses = await db
                    .select({ classId: guruKelas.classId })
                    .from(guruKelas)
                    .where(eq(guruKelas.teacherId, teacher.id));

                return {
                    ...teacher,
                    classIds: teacherClasses.map(tc => tc.classId),
                };
            })
        );

        return NextResponse.json(teachersWithClasses);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch teachers' },
            { status: 500 }
        );
    }
}

// POST - Create new teacher
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            name,
            email,
            password,
            nip,
            subject,
            phone,
            dateOfBirth,
            classIds // array of class IDs
        } = body;

        // Validate required fields
        if (!name || !email || !password || !nip) {
            return NextResponse.json(
                { error: 'Nama, email, password, dan NIP wajib diisi' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: 'Email sudah terdaftar' },
                { status: 400 }
            );
        }

        // Check if NIP already exists
        const existingNip = await db
            .select()
            .from(teachers)
            .where(eq(teachers.nip, nip))
            .limit(1);

        if (existingNip.length > 0) {
            return NextResponse.json(
                { error: 'NIP sudah terdaftar' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user first
        const [newUser] = await db
            .insert(users)
            .values({
                name,
                email,
                password: hashedPassword,
                role: 'guru', // Changed from 'staff' - teachers are 'guru' role
            })
            .returning();

        // Create teacher record
        const [newTeacher] = await db
            .insert(teachers)
            .values({
                userId: newUser.id,
                nip,
                subject: subject || null,
                phone: phone || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            })
            .returning();

        // Save teacher-class relationships if classIds provided
        if (classIds && Array.isArray(classIds) && classIds.length > 0) {
            const guruKelasValues = classIds.map(classId => ({
                teacherId: newTeacher.id,
                classId,
            }));
            await db.insert(guruKelas).values(guruKelasValues);
        }

        return NextResponse.json({
            success: true,
            teacher: {
                id: newTeacher.id,
                nip: newTeacher.nip,
                userName: newUser.name,
                userEmail: newUser.email,
                subject: newTeacher.subject,
                classIds: classIds || [],
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating teacher:', error);
        return NextResponse.json(
            { error: 'Gagal membuat data guru' },
            { status: 500 }
        );
    }
}

// PUT - Update teacher
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            id,
            name,
            email,
            password, // Add password parameter
            nip,
            subject,
            phone,
            dateOfBirth,
            classIds // array of class IDs
        } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'ID guru wajib diisi' },
                { status: 400 }
            );
        }

        // Get existing teacher
        const existingTeacher = await db
            .select()
            .from(teachers)
            .where(eq(teachers.id, id))
            .limit(1);

        if (existingTeacher.length === 0) {
            return NextResponse.json(
                { error: 'Guru tidak ditemukan' },
                { status: 404 }
            );
        }

        // Check if email is already used by another user
        if (email) {
            const existingEmail = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (existingEmail.length > 0 && existingEmail[0].id !== existingTeacher[0].userId) {
                return NextResponse.json(
                    { error: 'Email sudah digunakan pengguna lain' },
                    { status: 400 }
                );
            }
        }

        // Check if NIP is already used by another teacher
        if (nip) {
            const existingNip = await db
                .select()
                .from(teachers)
                .where(eq(teachers.nip, nip))
                .limit(1);

            if (existingNip.length > 0 && existingNip[0].id !== id) {
                return NextResponse.json(
                    { error: 'NIP sudah digunakan guru lain' },
                    { status: 400 }
                );
            }
        }

        // Prepare user update data
        const userUpdateData: any = {
            ...(name && { name }),
            ...(email && { email }),
            updatedAt: new Date(),
        };

        // Hash password if provided
        if (password) {
            userUpdateData.password = await bcrypt.hash(password, 10);
        }

        // Update user info
        if (name || email || password) {
            await db
                .update(users)
                .set(userUpdateData)
                .where(eq(users.id, existingTeacher[0].userId));
        }

        // Update teacher info
        await db
            .update(teachers)
            .set({
                ...(nip && { nip }),
                subject: subject || null,
                phone: phone || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            })
            .where(eq(teachers.id, id));

        // Update teacher-class relationships
        // First, delete all existing relationships
        await db.delete(guruKelas).where(eq(guruKelas.teacherId, id));

        // Then, insert new relationships if classIds provided
        if (classIds && Array.isArray(classIds) && classIds.length > 0) {
            const guruKelasValues = classIds.map(classId => ({
                teacherId: id,
                classId,
            }));
            await db.insert(guruKelas).values(guruKelasValues);
        }

        return NextResponse.json({
            success: true,
            message: 'Data guru berhasil diperbarui'
        });
    } catch (error) {
        console.error('Error updating teacher:', error);
        return NextResponse.json(
            { error: 'Gagal memperbarui data guru' },
            { status: 500 }
        );
    }
}

// DELETE - Delete teacher
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID guru wajib diisi' },
                { status: 400 }
            );
        }

        // Get teacher to find userId
        const teacher = await db
            .select()
            .from(teachers)
            .where(eq(teachers.id, id))
            .limit(1);

        if (teacher.length === 0) {
            return NextResponse.json(
                { error: 'Guru tidak ditemukan' },
                { status: 404 }
            );
        }

        // Delete teacher record
        await db
            .delete(teachers)
            .where(eq(teachers.id, id));

        // Delete user record
        await db
            .delete(users)
            .where(eq(users.id, teacher[0].userId));

        return NextResponse.json({
            success: true,
            message: 'Data guru berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        return NextResponse.json(
            { error: 'Gagal menghapus data guru' },
            { status: 500 }
        );
    }
}
