-- ==========================================
-- FIX PASSWORD HASH - LabTrack v2.0
-- ==========================================

-- Kita perlu menggunakan SHA-256 hash yang sesuai dengan client
-- Karena client menggunakan SHA-256, bukan bcrypt

-- Hash untuk password "superadmin123" dengan SHA-256
-- Hash: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8

-- Hash untuk password "password123" dengan SHA-256  
-- Hash: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f

-- 1. Update super admin password
UPDATE public.users 
SET password_hash = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
WHERE email = 'superadmin@untirta.ac.id';

-- 2. Update existing demo users password
UPDATE public.users 
SET password_hash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'
WHERE email IN (
  'ahmad.fauzan@student.untirta.ac.id',
  'budi.santoso@student.untirta.ac.id',
  'rizky.pratama@untirta.ac.id'
);

-- 3. Verifikasi - Cek semua user dengan password
SELECT 
  email, 
  name, 
  role,
  CASE 
    WHEN password_hash IS NULL THEN '❌ No Password'
    WHEN password_hash = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' THEN '✅ superadmin123'
    WHEN password_hash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f' THEN '✅ password123'
    ELSE '⚠️ Unknown Hash'
  END as password_status
FROM public.users
ORDER BY role, email;
