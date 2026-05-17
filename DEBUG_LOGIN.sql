-- ==========================================
-- DEBUG LOGIN - Cek Super Admin
-- ==========================================

-- 1. Cek apakah super admin ada
SELECT 
  id,
  email, 
  name, 
  role,
  password_hash,
  email_verified,
  created_at
FROM public.users 
WHERE email = 'superadmin@untirta.ac.id';

-- 2. Cek semua user dengan password hash
SELECT 
  email,
  role,
  LEFT(password_hash, 30) as hash_preview,
  LENGTH(password_hash) as hash_length
FROM public.users
ORDER BY created_at DESC;

-- 3. Jika super admin tidak ada, buat sekarang dengan hash yang benar
-- Uncomment baris di bawah jika super admin tidak ada:

/*
INSERT INTO public.users (
  id, 
  email, 
  name, 
  role, 
  password_hash, 
  email_verified,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000099',
  'superadmin@untirta.ac.id',
  'Super Administrator',
  'super_admin',
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  true,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  password_hash = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  email_verified = true;
*/

-- 4. Update password hash super admin (jika sudah ada tapi hash salah)
UPDATE public.users 
SET password_hash = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
WHERE email = 'superadmin@untirta.ac.id';

-- 5. Verifikasi lagi
SELECT 
  email,
  role,
  password_hash = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' as correct_hash
FROM public.users
WHERE email = 'superadmin@untirta.ac.id';
