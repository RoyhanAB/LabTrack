-- ==========================================
-- CHECK DATABASE STATUS - LabTrack v2.0
-- ==========================================

-- 1. Cek apakah kolom password_hash sudah ada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('password_hash', 'email_verified', 'last_login');

-- 2. Cek semua user yang ada
SELECT id, email, name, role, nim, 
       CASE 
         WHEN password_hash IS NULL THEN 'NO PASSWORD'
         ELSE 'HAS PASSWORD'
       END as pwd_status
FROM public.users
ORDER BY created_at DESC;

-- 3. Cek apakah super admin sudah ada
SELECT * FROM public.users 
WHERE email = 'superadmin@untirta.ac.id';

-- 4. Cek role constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'users_role_check';

-- 5. Cek function validasi NIM
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'validate_nim_teknik_industri';
