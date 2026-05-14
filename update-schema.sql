-- ==========================================
-- LabTrack Schema Update
-- Jalankan ini jika Anda sudah punya database lama
-- ==========================================

-- Add missing columns to loans table
ALTER TABLE public.loans 
ADD COLUMN IF NOT EXISTS approved_by TEXT,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS letter_url TEXT;

-- Verify columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'loans' 
ORDER BY ordinal_position;

-- Expected output should include:
-- approved_by | text
-- approved_at | timestamp with time zone
-- letter_url | text
