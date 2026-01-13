import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, students, classes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET - Fetch all students with user and class info
export async function GET() {
    try {
        const session = await auth();
        if (!session || !['admin', 'staff'].includes(session.user.role)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch all students with their user info and class info
        const studentsData = await db
            .select({
                id: students.id,
                nis: students.nis,
                phone: students.phone,
                address: students.address,
                dateOfBirth: students.dateOfBirth,
                photoUrl: students.photoUrl,
                userId: students.userId,
                classId: students.classId,
                userName: users.name,
                userEmail: users.email,
                className: classes.name,
            })
            .from(students)
            .leftJoin(users, eq(students.userId, users.id))
            .leftJoin(classes, eq(students.classId, classes.id));

        return NextResponse.json(studentsData);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json(
            { error: 'Failed to fetch students' },
            { status: 500 }
        );
    }
}

// POST - Create new student
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
            nis,
            classId,
            phone,
            address,
            dateOfBirth
        } = body;

        // Debug logging
        console.log('=== CREATE STUDENT DEBUG ===');
        console.log('Phone:', phone);
        console.log('Address:', address);
        console.log('DateOfBirth:', dateOfBirth);
        console.log('DateOfBirth type:', typeof dateOfBirth);
        if (dateOfBirth) {
            console.log('DateOfBirth parsed:', new Date(dateOfBirth));
        }

        // Validate required fields
        if (!name || !email || !password || !nis) {
            return NextResponse.json(
                { error: 'Nama, email, password, dan NIS wajib diisi' },
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

        // Check if NIS already exists
        const existingNis = await db
            .select()
            .from(students)
            .where(eq(students.nis, nis))
            .limit(1);

        if (existingNis.length > 0) {
            return NextResponse.json(
                { error: 'NIS sudah terdaftar' },
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
                role: 'student',
            })
            .returning();

        // Create student record
        const [newStudent] = await db
            .insert(students)
            .values({
                userId: newUser.id,
                nis,
                classId: classId || null,
                phone: phone || null,
                address: address || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            })
            .returning();

        return NextResponse.json({
            success: true,
            student: {
                id: newStudent.id,
                nis: newStudent.nis,
                userName: newUser.name,
                userEmail: newUser.email,
                classId: newStudent.classId,
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating student:', error);
        return NextResponse.json(
            { error: 'Gagal membuat data siswa' },
            { status: 500 }
        );
    }
}

// PUT - Update student
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
            nis,
            classId,
            phone,
            address,
            dateOfBirth
        } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'ID siswa wajib diisi' },
                { status: 400 }
            );
        }

        // Get existing student
        const existingStudent = await db
            .select()
            .from(students)
            .where(eq(students.id, id))
            .limit(1);

        if (existingStudent.length === 0) {
            return NextResponse.json(
                { error: 'Siswa tidak ditemukan' },
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

            if (existingEmail.length > 0 && existingEmail[0].id !== existingStudent[0].userId) {
                return NextResponse.json(
                    { error: 'Email sudah digunakan pengguna lain' },
                    { status: 400 }
                );
            }
        }

        // Check if NIS is already used by another student
        if (nis) {
            const existingNis = await db
                .select()
                .from(students)
                .where(eq(students.nis, nis))
                .limit(1);

            if (existingNis.length > 0 && existingNis[0].id !== id) {
                return NextResponse.json(
                    { error: 'NIS sudah digunakan siswa lain' },
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
                .where(eq(users.id, existingStudent[0].userId));
        }

        // Update student info
        await db
            .update(students)
            .set({
                ...(nis && { nis }),
                classId: classId || null,
                phone: phone || null,
                address: address || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            })
            .where(eq(students.id, id));

        return NextResponse.json({
            success: true,
            message: 'Data siswa berhasil diperbarui'
        });
    } catch (error) {
        console.error('Error updating student:', error);
        return NextResponse.json(
            { error: 'Gagal memperbarui data siswa' },
            { status: 500 }
        );
    }
}

// DELETE - Delete student
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
                { error: 'ID siswa wajib diisi' },
                { status: 400 }
            );
        }

        // Get student to find userId
        const student = await db
            .select()
            .from(students)
            .where(eq(students.id, id))
            .limit(1);

        if (student.length === 0) {
            return NextResponse.json(
                { error: 'Siswa tidak ditemukan' },
                { status: 404 }
            );
        }

        // Delete student record (will cascade delete due to foreign key)
        await db
            .delete(students)
            .where(eq(students.id, id));

        // Delete user record
        await db
            .delete(users)
            .where(eq(users.id, student[0].userId));

        return NextResponse.json({
            success: true,
            message: 'Data siswa berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        return NextResponse.json(
            { error: 'Gagal menghapus data siswa' },
            { status: 500 }
        );
    }
}
