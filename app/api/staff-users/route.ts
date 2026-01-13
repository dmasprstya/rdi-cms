import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET - Fetch all staff users
export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch all users with role='staff'
        const staffUsers = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                phone: users.phone,
                address: users.address,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.role, 'staff'));

        return NextResponse.json(staffUsers);
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json(
            { error: 'Failed to fetch staff' },
            { status: 500 }
        );
    }
}

// POST - Create new staff user
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
        const { name, email, password, phone, address } = body;

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Nama, email, dan password wajib diisi' },
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create staff user
        const [newStaff] = await db
            .insert(users)
            .values({
                name,
                email,
                password: hashedPassword,
                role: 'staff',
                phone: phone || null,
                address: address || null,
            })
            .returning();

        return NextResponse.json({
            success: true,
            staff: {
                id: newStaff.id,
                name: newStaff.name,
                email: newStaff.email,
                phone: newStaff.phone,
                address: newStaff.address,
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating staff:', error);
        return NextResponse.json(
            { error: 'Gagal membuat data staff' },
            { status: 500 }
        );
    }
}

// PUT - Update staff user
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
        const { id, name, email, password, phone, address } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'ID staff wajib diisi' },
                { status: 400 }
            );
        }

        // Get existing staff user
        const existingStaff = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (existingStaff.length === 0) {
            return NextResponse.json(
                { error: 'Staff tidak ditemukan' },
                { status: 404 }
            );
        }

        // Check if staff user has role='staff'
        if (existingStaff[0].role !== 'staff') {
            return NextResponse.json(
                { error: 'User bukan staff' },
                { status: 400 }
            );
        }

        // Check if email is already used by another user
        if (email) {
            const existingEmail = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (existingEmail.length > 0 && existingEmail[0].id !== id) {
                return NextResponse.json(
                    { error: 'Email sudah digunakan pengguna lain' },
                    { status: 400 }
                );
            }
        }

        // Prepare update data
        const updateData: any = {
            ...(name && { name }),
            ...(email && { email }),
            phone: phone || null,
            address: address || null,
            updatedAt: new Date(),
        };

        // Hash password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Update staff user
        await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, id));

        return NextResponse.json({
            success: true,
            message: 'Data staff berhasil diperbarui'
        });
    } catch (error) {
        console.error('Error updating staff:', error);
        return NextResponse.json(
            { error: 'Gagal memperbarui data staff' },
            { status: 500 }
        );
    }
}

// DELETE - Delete staff user
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
                { error: 'ID staff wajib diisi' },
                { status: 400 }
            );
        }

        // Get staff user
        const staffUser = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (staffUser.length === 0) {
            return NextResponse.json(
                { error: 'Staff tidak ditemukan' },
                { status: 404 }
            );
        }

        // Check if user has role='staff'
        if (staffUser[0].role !== 'staff') {
            return NextResponse.json(
                { error: 'User bukan staff' },
                { status: 400 }
            );
        }

        // Delete staff user
        await db
            .delete(users)
            .where(eq(users.id, id));

        return NextResponse.json({
            success: true,
            message: 'Data staff berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting staff:', error);
        return NextResponse.json(
            { error: 'Gagal menghapus data staff' },
            { status: 500 }
        );
    }
}
