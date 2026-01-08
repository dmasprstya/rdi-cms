-- Create modules table if not exists
CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    file_url TEXT,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_modules_subject ON modules(subject_id);
CREATE INDEX IF NOT EXISTS idx_modules_class ON modules(class_id);
CREATE INDEX IF NOT EXISTS idx_modules_teacher ON modules(teacher_id);
CREATE INDEX IF NOT EXISTS idx_modules_published ON modules(is_published);

-- Display success message
SELECT 'Modules table created successfully!' as message;
