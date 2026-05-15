-- ==========================================
-- LabTrack Supabase Schema
-- ==========================================

-- 1. Create tables
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('mahasiswa', 'admin', 'asisten')),
  nim TEXT,
  kelas TEXT,
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
  created_at TIMESTAMPTZ DEFAULT now()
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

-- 2. Insert Initial Seed Data

-- Insert Laboratories
INSERT INTO public.laboratories (id, name, full_name, description, location, image) VALUES
('lsi', 'LSIPro', 'Laboratorium Sistem Informasi dan Proses', 'Fokus pada pengembangan sistem informasi, pemodelan proses bisnis, dan rekayasa perangkat lunak.', 'Lantai 2, Gedung A', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop'),
('rske', 'RSK&E', 'Laboratorium Rekayasa Sistem Kerja dan Ergonomi', 'Fokus pada perancangan sistem kerja, analisis biomekanika, dan lingkungan kerja fisik.', 'Lantai 1, Gedung B', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'),
('osik', 'OSI&K', 'Laboratorium Optimasi Sistem Industri dan Kualitas', 'Fokus pada riset operasi, pengendalian kualitas statistik, dan optimasi rantai pasok.', 'Lantai 2, Gedung B', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop'),
('smi', 'SMI', 'Laboratorium Sistem Manufaktur dan Inovasi', 'Fokus pada perancangan produk, proses manufaktur, CNC, dan otomatisasi industri.', 'Lantai Dasar, Gedung C', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop');

-- Insert Dummy Users
INSERT INTO public.users (id, email, name, role, nim, kelas) VALUES
('00000000-0000-0000-0000-000000000001', 'ahmad.fauzan@student.untirta.ac.id', 'Ahmad Fauzan', 'mahasiswa', '3333210001', 'TI-A 2021'),
('00000000-0000-0000-0000-000000000002', 'budi.santoso@student.untirta.ac.id', 'Budi Santoso', 'mahasiswa', '3333210002', 'TI-B 2021'),
('00000000-0000-0000-0000-000000000003', 'rizky.pratama@untirta.ac.id', 'Rizky Pratama', 'admin', NULL, NULL);

-- Insert Equipment
INSERT INTO public.equipment (id, name, description, lab_id, total_stock, available_stock, condition, status, image, category, specifications) VALUES
('eq-1', 'Timbangan Digital Analitik', 'Timbangan digital dengan presisi tinggi untuk pengukuran bahan lab.', 'lsi', 5, 5, 'Baik', 'tersedia', 'https://images.unsplash.com/photo-1593344685087-c15c884cd9c0?w=800&auto=format&fit=crop', 'Alat Ukur', 'Kapasitas maks: 200g\nAkurasi: 0.0001g'),
('eq-2', 'Stopwatch Digital Pro', 'Stopwatch presisi untuk pengukuran waktu kerja di lab RSK&E.', 'rske', 15, 12, 'Baik', 'tersedia', 'https://images.unsplash.com/photo-1499540633125-484965b60031?w=800&auto=format&fit=crop', 'Alat Ukur', 'Presisi: 1/100 detik\nWaterproof: Ya'),
('eq-3', 'Heart Rate Monitor', 'Alat pengukur detak jantung untuk praktikum beban kerja fisik.', 'rske', 8, 2, 'Baik', 'tersedia', 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&auto=format&fit=crop', 'Alat Medis', 'Konektivitas: Bluetooth 5.0\nBaterai: CR2032'),
('eq-4', 'Jangka Sorong Digital', 'Alat ukur dimensi panjang, lebar, dan diameter produk manufaktur.', 'smi', 20, 0, 'Baik', 'dipinjam', 'https://images.unsplash.com/photo-1620669274291-536afef45ea1?w=800&auto=format&fit=crop', 'Alat Ukur', 'Range: 0-150mm\nResolusi: 0.01mm'),
('eq-5', 'Mikrometer Sekrup', 'Alat ukur presisi untuk ketebalan material yang sangat tipis.', 'smi', 10, 10, 'Baik', 'tersedia', 'https://images.unsplash.com/photo-1582216503930-b3e32b4b4eb2?w=800&auto=format&fit=crop', 'Alat Ukur', 'Range: 0-25mm\nResolusi: 0.001mm'),
('eq-6', 'Lux Meter', 'Alat ukur intensitas cahaya untuk praktikum lingkungan kerja.', 'rske', 5, 0, 'Rusak', 'maintenance', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop', 'Alat Ukur', 'Range: 0-50000 Lux');

-- Enable RLS (Optional for security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (for demo purposes)
CREATE POLICY "Allow public read" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read labs" ON public.laboratories FOR SELECT USING (true);
CREATE POLICY "Allow public read equipment" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Allow public update equipment" ON public.equipment FOR UPDATE USING (true);
CREATE POLICY "Allow public insert equipment" ON public.equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete equipment" ON public.equipment FOR DELETE USING (true);
CREATE POLICY "Allow public read loans" ON public.loans FOR SELECT USING (true);
CREATE POLICY "Allow public insert loans" ON public.loans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update loans" ON public.loans FOR UPDATE USING (true);
CREATE POLICY "Allow public read logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- 3. Storage Policies (Run this if you haven't set up the bucket policies yet)
-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('equipment-images', 'equipment-images', true) ON CONFLICT DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'equipment-images');
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'equipment-images');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'equipment-images');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'equipment-images');
