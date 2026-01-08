-- UPDATE PASSWORD UNTUK USER YANG SUDAH ADA
-- Jalankan script ini di Supabase SQL Editor untuk update password

-- Update password admin (admin123)
UPDATE users 
SET password = '$2a$10$NLqCFJqZcobMDa8EgJogi.Qsh4rZMRv3SP7G5VQPNFxoixZSa0rsi' 
WHERE email = 'admin@sekolah.com';

-- Update password siswa (siswa123)
UPDATE users 
SET password = '$2a$10$EP6J1ISw/vnCwHR5mnQRtu0XNhChLhQ7uDFbJvkDzRXZkXLQ25aZW' 
WHERE email = 'siswa@sekolah.com';

-- Verify update
SELECT email, role, 
       CASE 
         WHEN password = '$2a$10$NLqCFJqZcobMDa8EgJogi.Qsh4rZMRv3SP7G5VQPNFxoixZSa0rsi' THEN '✓ admin123'
         WHEN password = '$2a$10$EP6J1ISw/vnCwHR5mnQRtu0XNhChLhQ7uDFbJvkDzRXZkXLQ25aZW' THEN '✓ siswa123'
         ELSE '✗ password berbeda'
       END as password_status
FROM users
WHERE email IN ('admin@sekolah.com', 'siswa@sekolah.com');
