-- ==========================================
-- LabTrack FULL DATABASE RESET
-- Jalankan di Supabase SQL Editor
-- ==========================================

-- STEP 1: Drop semua data lama
TRUNCATE public.activity_logs CASCADE;
TRUNCATE public.loans CASCADE;
TRUNCATE public.equipment CASCADE;
TRUNCATE public.users CASCADE;
TRUNCATE public.laboratories CASCADE;

-- Drop table jika ada yang mismatch
DROP TABLE IF EXISTS public.pending_registrations CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.loans CASCADE;
DROP TABLE IF EXISTS public.equipment CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.laboratories CASCADE;

-- ==========================================
-- STEP 2: Recreate Tables (Clean)
-- ==========================================

CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('mahasiswa', 'admin', 'asisten', 'super_admin')),
  nim TEXT,
  kelas TEXT,
  password_hash TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.pending_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  nim TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.laboratories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.equipment (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  lab_id TEXT REFERENCES public.laboratories(id) ON DELETE CASCADE,
  total_stock INTEGER NOT NULL DEFAULT 0,
  available_stock INTEGER NOT NULL DEFAULT 0,
  condition TEXT NOT NULL DEFAULT 'Baik',
  status TEXT NOT NULL DEFAULT 'tersedia',
  image TEXT,
  category TEXT NOT NULL,
  specifications TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.loans (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_nim TEXT,
  user_kelas TEXT,
  equipment_id TEXT REFERENCES public.equipment(id) ON DELETE CASCADE,
  equipment_name TEXT NOT NULL,
  lab_id TEXT REFERENCES public.laboratories(id) ON DELETE CASCADE,
  lab_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  borrow_date TIMESTAMPTZ NOT NULL,
  return_date TIMESTAMPTZ NOT NULL,
  actual_return_date TIMESTAMPTZ,
  status TEXT NOT NULL,
  notes TEXT,
  return_condition TEXT,
  return_notes TEXT,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  letter_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.activity_logs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- STEP 3: Enable RLS + Policies
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "users_select" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update" ON public.users FOR UPDATE USING (true);
CREATE POLICY "users_delete" ON public.users FOR DELETE USING (true);

-- Pending Registrations
CREATE POLICY "pending_registrations_select" ON public.pending_registrations FOR SELECT USING (true);
CREATE POLICY "pending_registrations_insert" ON public.pending_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "pending_registrations_update" ON public.pending_registrations FOR UPDATE USING (true);
CREATE POLICY "pending_registrations_delete" ON public.pending_registrations FOR DELETE USING (true);

-- Laboratories
CREATE POLICY "labs_select" ON public.laboratories FOR SELECT USING (true);

-- Equipment
CREATE POLICY "eq_select" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "eq_insert" ON public.equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "eq_update" ON public.equipment FOR UPDATE USING (true);
CREATE POLICY "eq_delete" ON public.equipment FOR DELETE USING (true);

-- Loans
CREATE POLICY "loans_select" ON public.loans FOR SELECT USING (true);
CREATE POLICY "loans_insert" ON public.loans FOR INSERT WITH CHECK (true);
CREATE POLICY "loans_update" ON public.loans FOR UPDATE USING (true);
CREATE POLICY "loans_delete" ON public.loans FOR DELETE USING (true);

-- Activity Logs
CREATE POLICY "logs_select" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "logs_insert" ON public.activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "logs_delete" ON public.activity_logs FOR DELETE USING (true);

-- ==========================================
-- STEP 4: Indexes
-- ==========================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_pending_registrations_email_nim ON public.pending_registrations(email, nim);
CREATE INDEX idx_pending_registrations_expires_at ON public.pending_registrations(expires_at);
CREATE INDEX idx_loans_user_id ON public.loans(user_id);
CREATE INDEX idx_loans_status ON public.loans(status);
CREATE INDEX idx_equipment_lab_id ON public.equipment(lab_id);

-- ==========================================
-- STEP 4B: Transaction Helpers
-- ==========================================

CREATE OR REPLACE FUNCTION public.approve_loan_transaction(
  p_loan_id TEXT,
  p_equipment_id TEXT,
  p_quantity INTEGER,
  p_approved_by TEXT,
  p_approved_at TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_available_stock INTEGER;
BEGIN
  SELECT available_stock
  INTO v_available_stock
  FROM public.equipment
  WHERE id = p_equipment_id
  FOR UPDATE;

  IF v_available_stock IS NULL THEN
    RAISE EXCEPTION 'Alat tidak ditemukan';
  END IF;

  IF v_available_stock < p_quantity THEN
    RAISE EXCEPTION 'Stok tidak mencukupi';
  END IF;

  UPDATE public.loans
  SET
    status = 'dipinjam',
    approved_by = p_approved_by,
    approved_at = p_approved_at
  WHERE id = p_loan_id
    AND equipment_id = p_equipment_id
    AND status = 'menunggu';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Peminjaman sudah diproses atau tidak ditemukan';
  END IF;

  UPDATE public.equipment
  SET
    available_stock = available_stock - p_quantity,
    status = CASE
      WHEN available_stock - p_quantity <= 0 THEN 'dipinjam'
      ELSE 'tersedia'
    END,
    updated_at = now()
  WHERE id = p_equipment_id;
END;
$$;

-- ==========================================
-- STEP 5: Seed Data
-- ==========================================

-- Laboratories
INSERT INTO public.laboratories (id, name, full_name, description, location, image) VALUES
('lsi', 'LSIPro', 'Laboratorium Sistem Produksi', 'Fokus pada simulasi proses produksi dan analisis produktivitas kerja.', 'Lantai 2, Gedung A', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop'),
('rske', 'RSK&E', 'Laboratorium Rekayasa Sistem Kerja dan Ergonomi', 'Fokus pada perancangan sistem kerja, analisis biomekanika, dan lingkungan kerja fisik.', 'Lantai 1, Gedung B', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'),
('osik', 'OSI&K', 'Laboratorium Optimasi Sistem Industri dan Kualitas', 'Fokus pada riset operasi, pengendalian kualitas statistik, dan optimasi rantai pasok.', 'Lantai 2, Gedung B', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop'),
('smi', 'SMI', 'Studio Manajemen Industri', 'Fokus pada simulasi manajemen industri, perencanaan produksi, analisis sistem bisnis, dan pengambilan keputusan.', 'Lantai Dasar, Gedung C', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop');

-- ==========================================
-- USERS — PASSWORD = SHA-256 HASH
-- ==========================================
-- mahasiswa123 => 9464fb01de62761d5691f5eb89e80aa1e40a84bea6ee5d2ab5ca90efd9776b47
-- admin123     => 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
-- superadmin123 => e34f92a20532a873cb3184398070b4b82a8fa29cf48572c203dc5f0fa6158231

INSERT INTO public.users (id, email, name, role, nim, kelas, password_hash) VALUES
('00000000-0000-0000-0000-000000000001', '3333210001@untirta.ac.id', 'Ahmad Fauzan', 'mahasiswa', '3333210001', 'TI-A 2021', '9464fb01de62761d5691f5eb89e80aa1e40a84bea6ee5d2ab5ca90efd9776b47'),
('00000000-0000-0000-0000-000000000002', '3333210002@untirta.ac.id', 'Budi Santoso', 'mahasiswa', '3333210002', 'TI-B 2021', '9464fb01de62761d5691f5eb89e80aa1e40a84bea6ee5d2ab5ca90efd9776b47'),
('00000000-0000-0000-0000-000000000003', 'rizky.pratama@untirta.ac.id', 'Rizky Pratama', 'admin', NULL, NULL, '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'),
('00000000-0000-0000-0000-000000000099', 'superadmin@untirta.ac.id', 'Super Administrator', 'super_admin', NULL, NULL, 'e34f92a20532a873cb3184398070b4b82a8fa29cf48572c203dc5f0fa6158231');

-- Equipment
INSERT INTO public.equipment (id, name, description, lab_id, total_stock, available_stock, condition, status, image, category, specifications) VALUES
('eq-1', 'Timbangan Digital Analitik', 'Timbangan digital dengan presisi tinggi untuk pengukuran bahan lab.', 'lsi', 5, 5, 'Baik', 'tersedia', 'https://images.unsplash.com/photo-1593344685087-c15c884cd9c0?w=800&auto=format&fit=crop', 'Alat Ukur', 'Kapasitas maks: 200g\nAkurasi: 0.0001g'),
('eq-2', 'Stopwatch Digital Pro', 'Stopwatch presisi untuk pengukuran waktu kerja di lab RSK&E.', 'rske', 15, 12, 'Baik', 'tersedia', 'https://images.unsplash.com/photo-1499540633125-484965b60031?w=800&auto=format&fit=crop', 'Alat Ukur', 'Presisi: 1/100 detik\nWaterproof: Ya'),
('eq-3', 'Heart Rate Monitor', 'Alat pengukur detak jantung untuk praktikum beban kerja fisik.', 'rske', 8, 8, 'Baik', 'tersedia', 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&auto=format&fit=crop', 'Alat Medis', 'Konektivitas: Bluetooth 5.0\nBaterai: CR2032'),
('eq-4', 'Jangka Sorong Digital', 'Alat ukur dimensi panjang, lebar, dan diameter produk manufaktur.', 'smi', 20, 20, 'Baik', 'tersedia', 'https://images.unsplash.com/photo-1620669274291-536afef45ea1?w=800&auto=format&fit=crop', 'Alat Ukur', 'Range: 0-150mm\nResolusi: 0.01mm'),
('eq-5', 'Mikrometer Sekrup', 'Alat ukur presisi untuk ketebalan material yang sangat tipis.', 'smi', 10, 10, 'Baik', 'tersedia', 'https://images.unsplash.com/photo-1582216503930-b3e32b4b4eb2?w=800&auto=format&fit=crop', 'Alat Ukur', 'Range: 0-25mm\nResolusi: 0.001mm'),
('eq-6', 'Lux Meter', 'Alat ukur intensitas cahaya untuk praktikum lingkungan kerja.', 'rske', 5, 0, 'Rusak', 'maintenance', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop', 'Alat Ukur', 'Range: 0-50000 Lux');

-- ==========================================
-- STEP 6: Storage bucket
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES ('equipment-images', 'equipment-images', true) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "storage_select" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

CREATE POLICY "storage_select" ON storage.objects FOR SELECT USING (bucket_id = 'equipment-images');
CREATE POLICY "storage_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'equipment-images');
CREATE POLICY "storage_update" ON storage.objects FOR UPDATE USING (bucket_id = 'equipment-images');
CREATE POLICY "storage_delete" ON storage.objects FOR DELETE USING (bucket_id = 'equipment-images');

-- ==========================================
-- SELESAI! Akun Login:
-- ==========================================
-- MAHASISWA:    3333210001@untirta.ac.id              /  mahasiswa123
-- MAHASISWA:    3333210002@untirta.ac.id              /  mahasiswa123
-- ADMIN:        rizky.pratama@untirta.ac.id           /  admin123
-- SUPER ADMIN:  superadmin@untirta.ac.id              /  superadmin123
-- ==========================================
