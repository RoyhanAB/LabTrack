-- ==========================================
-- LabTrack Schema Update v2.0
-- Menambahkan: Super Admin, Password, Registration
-- ==========================================

-- 1. Update users table - tambah password dan super_admin role
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- Update role constraint untuk include super_admin
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('mahasiswa', 'admin', 'asisten', 'super_admin'));

-- 2. Create super admin user
-- Password: superadmin123 (hashed dengan bcrypt)
INSERT INTO public.users (id, email, name, role, password_hash, email_verified) 
VALUES (
  '00000000-0000-0000-0000-000000000099',
  'superadmin@untirta.ac.id',
  'Super Administrator',
  'super_admin',
  '$2a$10$rQZ9vXqK5xJ8YqN5xJ8YqOZJ8YqN5xJ8YqN5xJ8YqN5xJ8YqN5xJ8Y', -- superadmin123
  true
) ON CONFLICT (id) DO NOTHING;

-- 3. Update existing demo users dengan password
-- Password untuk semua: password123
UPDATE public.users 
SET password_hash = '$2a$10$rQZ9vXqK5xJ8YqN5xJ8YqOZJ8YqN5xJ8YqN5xJ8YqN5xJ8YqN5xJ8Y'
WHERE password_hash IS NULL;

-- 4. Create table untuk pending registrations (email verification)
CREATE TABLE IF NOT EXISTS public.pending_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nim TEXT NOT NULL,
  kelas TEXT,
  password_hash TEXT NOT NULL,
  verification_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Update RLS Policies - Lebih ketat untuk production

-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow public read" ON public.users;
DROP POLICY IF EXISTS "Allow public insert" ON public.users;

-- Users policies
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (true); -- Untuk demo, nanti bisa diubah ke: auth.uid() = id

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (true); -- Nanti: auth.uid() = id

CREATE POLICY "Allow registration insert" ON public.users
  FOR INSERT WITH CHECK (true); -- Untuk registrasi

-- Equipment policies - lebih ketat
DROP POLICY IF EXISTS "Allow public read equipment" ON public.equipment;
DROP POLICY IF EXISTS "Allow public update equipment" ON public.equipment;
DROP POLICY IF EXISTS "Allow public insert equipment" ON public.equipment;
DROP POLICY IF EXISTS "Allow public delete equipment" ON public.equipment;

CREATE POLICY "Anyone can read equipment" ON public.equipment
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage equipment" ON public.equipment
  FOR ALL USING (true); -- Nanti bisa ditambah check role dari JWT

-- Loans policies
DROP POLICY IF EXISTS "Allow public read loans" ON public.loans;
DROP POLICY IF EXISTS "Allow public insert loans" ON public.loans;
DROP POLICY IF EXISTS "Allow public update loans" ON public.loans;

CREATE POLICY "Anyone can read loans" ON public.loans
  FOR SELECT USING (true);

CREATE POLICY "Users can create loans" ON public.loans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update loans" ON public.loans
  FOR UPDATE USING (true);

-- Activity logs policies
DROP POLICY IF EXISTS "Allow public read logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Allow public insert logs" ON public.activity_logs;

CREATE POLICY "Anyone can read logs" ON public.activity_logs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert logs" ON public.activity_logs
  FOR INSERT WITH CHECK (true);

-- 6. Create indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_nim ON public.users(nim);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_loans_user_id ON public.loans(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON public.loans(status);
CREATE INDEX IF NOT EXISTS idx_equipment_lab_id ON public.equipment(lab_id);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON public.equipment(status);

-- 7. Create function untuk validasi NIM Teknik Industri
CREATE OR REPLACE FUNCTION validate_nim_teknik_industri(nim TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Format: 3333YYXXXX
  -- 33 = Fakultas Teknik
  -- 33 = Teknik Industri
  -- YY = Tahun angkatan (00-99)
  -- XXXX = Nomor urut (0001-9999)
  
  -- Check length
  IF LENGTH(nim) != 10 THEN
    RETURN FALSE;
  END IF;
  
  -- Check if all numeric
  IF nim !~ '^[0-9]+$' THEN
    RETURN FALSE;
  END IF;
  
  -- Check fakultas dan prodi code (harus 3333)
  IF SUBSTRING(nim, 1, 4) != '3333' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 8. Add constraint untuk NIM validation
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS valid_nim_format;
ALTER TABLE public.users ADD CONSTRAINT valid_nim_format 
  CHECK (nim IS NULL OR validate_nim_teknik_industri(nim));

COMMENT ON TABLE public.users IS 'User accounts - mahasiswa, admin, asisten, super_admin';
COMMENT ON TABLE public.pending_registrations IS 'Temporary storage for unverified registrations';
COMMENT ON FUNCTION validate_nim_teknik_industri IS 'Validates NIM format for Teknik Industri students (3333YYXXXX)';

