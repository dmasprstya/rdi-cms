import { pgTable, text, timestamp, integer, varchar, boolean, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['admin', 'staff', 'student', 'editor', 'guru']);
export const dayEnum = pgEnum('day', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

// Users table - main authentication table
export const users = pgTable('users', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role: roleEnum('role').notNull().default('student'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Classes table
export const classes = pgTable('classes', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar('name', { length: 100 }).notNull(),
    grade: integer('grade').notNull(), // e.g., 10, 11, 12
    academicYear: varchar('academic_year', { length: 20 }).notNull(), // e.g., "2023/2024"
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Students table
export const students = pgTable('students', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    nis: varchar('nis', { length: 20 }).notNull().unique(), // Student ID number
    classId: text('class_id').references(() => classes.id, { onDelete: 'set null' }),
    photoUrl: text('photo_url'),
    address: text('address'),
    phone: varchar('phone', { length: 20 }),
    dateOfBirth: timestamp('date_of_birth'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Teachers table
export const teachers = pgTable('teachers', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    nip: varchar('nip', { length: 20 }).notNull().unique(), // Teacher ID number
    subject: varchar('subject', { length: 100 }), // Primary subject taught
    phone: varchar('phone', { length: 20 }),
    dateOfBirth: timestamp('date_of_birth'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Subjects table
export const subjects = pgTable('subjects', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: varchar('name', { length: 100 }).notNull(),
    code: varchar('code', { length: 20 }).notNull().unique(),
    credits: integer('credits').notNull().default(2),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Grades table
export const grades = pgTable('grades', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
    subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
    classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    teacherId: text('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
    score: integer('score').notNull(), // 0-100
    semester: integer('semester').notNull(), // 1 or 2
    academicYear: varchar('academic_year', { length: 20 }).notNull(),
    remarks: text('remarks'), // Optional notes
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Schedules table
export const schedules = pgTable('schedules', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
    teacherId: text('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
    day: dayEnum('day').notNull(),
    startTime: varchar('start_time', { length: 5 }).notNull(), // e.g., "08:00"
    endTime: varchar('end_time', { length: 5 }).notNull(), // e.g., "09:30"
    room: varchar('room', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Announcements table
export const announcements = pgTable('announcements', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Junction table: Teachers can teach multiple classes, classes can have multiple teachers
export const guruKelas = pgTable('guru_kelas', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    teacherId: text('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
    classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Junction table: Classes can have multiple subjects, subjects can be in multiple classes
export const kelasMataPelajaran = pgTable('kelas_mata_pelajaran', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Landing Page Content for CMS
export const landingPageContent = pgTable('landing_page_content', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    section: varchar('section', { length: 50 }).notNull().unique(), // hero, about, features, testimonials, contact, footer
    content: jsonb('content').notNull(), // JSON content for each section
    isPublished: boolean('is_published').notNull().default(true),
    lastEditedBy: text('last_edited_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
    student: one(students, {
        fields: [users.id],
        references: [students.userId],
    }),
    teacher: one(teachers, {
        fields: [users.id],
        references: [teachers.userId],
    }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
    user: one(users, {
        fields: [students.userId],
        references: [users.id],
    }),
    class: one(classes, {
        fields: [students.classId],
        references: [classes.id],
    }),
    grades: many(grades),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
    user: one(users, {
        fields: [teachers.userId],
        references: [users.id],
    }),
    schedules: many(schedules),
    guruKelas: many(guruKelas),
    grades: many(grades),
    modules: many(modules),
}));

export const classesRelations = relations(classes, ({ many }) => ({
    students: many(students),
    schedules: many(schedules),
    guruKelas: many(guruKelas),
    kelasMataPelajaran: many(kelasMataPelajaran),
    grades: many(grades),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
    grades: many(grades),
    schedules: many(schedules),
    kelasMataPelajaran: many(kelasMataPelajaran),
    modules: many(modules),
}));

export const gradesRelations = relations(grades, ({ one }) => ({
    student: one(students, {
        fields: [grades.studentId],
        references: [students.id],
    }),
    subject: one(subjects, {
        fields: [grades.subjectId],
        references: [subjects.id],
    }),
    class: one(classes, {
        fields: [grades.classId],
        references: [classes.id],
    }),
    teacher: one(teachers, {
        fields: [grades.teacherId],
        references: [teachers.id],
    }),
}));

export const schedulesRelations = relations(schedules, ({ one }) => ({
    class: one(classes, {
        fields: [schedules.classId],
        references: [classes.id],
    }),
    subject: one(subjects, {
        fields: [schedules.subjectId],
        references: [subjects.id],
    }),
    teacher: one(teachers, {
        fields: [schedules.teacherId],
        references: [teachers.id],
    }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
    author: one(users, {
        fields: [announcements.authorId],
        references: [users.id],
    }),
}));

// Learning Modules table
export const modules = pgTable('modules', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    content: text('content'), // Rich text content or HTML
    fileUrl: text('file_url'), // Link to downloadable file
    subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
    classId: text('class_id').references(() => classes.id, { onDelete: 'cascade' }), // Optional: if null, available to all classes taking the subject
    teacherId: text('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
    isPublished: boolean('is_published').notNull().default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const modulesRelations = relations(modules, ({ one }) => ({
    subject: one(subjects, {
        fields: [modules.subjectId],
        references: [subjects.id],
    }),
    class: one(classes, {
        fields: [modules.classId],
        references: [classes.id],
    }),
    teacher: one(teachers, {
        fields: [modules.teacherId],
        references: [teachers.id],
    }),
}));

// Junction table relations
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


// Dropdown Menu table for customizable navbar dropdown
export const dropdownMenu = pgTable('dropdown_menu', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar('title', { length: 100 }).notNull(), // Menu title (e.g., "Jerman", "Taiwan", "Jepang", "Haltec")
    slug: varchar('slug', { length: 100 }).notNull().unique(), // URL slug (e.g., "jerman", "taiwan", "jepang", "haltec")
    content: jsonb('content').notNull(), // JSON content for the page
    order: integer('order').notNull().default(0), // Display order in dropdown
    isPublished: boolean('is_published').notNull().default(true),
    lastEditedBy: text('last_edited_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// News table for CMS Berita feature
export const news = pgTable('news', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    excerpt: text('excerpt').notNull(), // Summary for card display
    content: text('content').notNull(), // Rich text HTML content
    featuredImage: text('featured_image').notNull(), // Required thumbnail image
    publishedAt: timestamp('published_at'),
    status: varchar('status', { length: 20 }).notNull().default('draft'), // 'draft' | 'published'
    category: varchar('category', { length: 100 }), // Optional category
    tags: jsonb('tags').$type<string[]>(), // Optional tags array
    authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    viewCount: integer('view_count').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// News Images table for multiple images per news article
export const newsImages = pgTable('news_images', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    newsId: text('news_id').notNull().references(() => news.id, { onDelete: 'cascade' }),
    imageUrl: text('image_url').notNull(),
    caption: text('caption'), // Optional caption
    order: integer('order').notNull().default(0), // Display order
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// News relations
export const newsRelations = relations(news, ({ one, many }) => ({
    author: one(users, {
        fields: [news.authorId],
        references: [users.id],
    }),
    images: many(newsImages),
}));

export const newsImagesRelations = relations(newsImages, ({ one }) => ({
    news: one(news, {
        fields: [newsImages.newsId],
        references: [news.id],
    }),
}));

// Hero Images table for slideshow background images
export const heroImages = pgTable('hero_images', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    sectionId: text('section_id').notNull(), // 'rdi-hero'
    imageUrl: text('image_url').notNull(),
    altText: text('alt_text').notNull(), // Required for accessibility
    order: integer('order').notNull().default(0), // Display order
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Hero Images relations
export const heroImagesRelations = relations(heroImages, ({ one }) => ({
    // No direct FK to landingPageContent to keep it flexible
    // FK constraint is defined in SQL migration
}));
