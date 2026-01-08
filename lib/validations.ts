import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    role: z.enum(['admin', 'staff', 'student']),
});

// Student schemas
export const studentSchema = z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.string().email('Email tidak valid'),
    nis: z.string().min(5, 'NIS minimal 5 karakter'),
    classId: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
});

// Teacher schemas
export const teacherSchema = z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.string().email('Email tidak valid'),
    nip: z.string().min(5, 'NIP minimal 5 karakter'),
    subject: z.string().optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
});

// Class schemas
export const classSchema = z.object({
    name: z.string().min(2, 'Nama kelas minimal 2 karakter'),
    grade: z.number().min(1).max(12),
    academicYear: z.string().regex(/^\d{4}\/\d{4}$/, 'Format tahun akademik tidak valid (contoh: 2023/2024)'),
});

// Subject schemas
export const subjectSchema = z.object({
    name: z.string().min(2, 'Nama mata pelajaran minimal 2 karakter'),
    code: z.string().min(2, 'Kode mata pelajaran minimal 2 karakter'),
    credits: z.number().min(1).max(6),
    description: z.string().optional(),
});

// Grade schemas
export const gradeSchema = z.object({
    studentId: z.string(),
    subjectId: z.string(),
    score: z.number().min(0).max(100),
    semester: z.number().min(1).max(2),
    academicYear: z.string(),
    remarks: z.string().optional(),
});

// Schedule schemas
export const scheduleSchema = z.object({
    classId: z.string(),
    subjectId: z.string(),
    teacherId: z.string(),
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format waktu tidak valid (HH:MM)'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format waktu tidak valid (HH:MM)'),
    room: z.string().optional(),
});

// Announcement schemas
export const announcementSchema = z.object({
    title: z.string().min(5, 'Judul minimal 5 karakter'),
    content: z.string().min(10, 'Konten minimal 10 karakter'),
    isActive: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type TeacherInput = z.infer<typeof teacherSchema>;
export type ClassInput = z.infer<typeof classSchema>;
export type SubjectInput = z.infer<typeof subjectSchema>;
export type GradeInput = z.infer<typeof gradeSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
