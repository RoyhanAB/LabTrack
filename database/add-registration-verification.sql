CREATE TABLE IF NOT EXISTS public.pending_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  nim TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pending_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pending_registrations_select" ON public.pending_registrations;
DROP POLICY IF EXISTS "pending_registrations_insert" ON public.pending_registrations;
DROP POLICY IF EXISTS "pending_registrations_update" ON public.pending_registrations;
DROP POLICY IF EXISTS "pending_registrations_delete" ON public.pending_registrations;

CREATE POLICY "pending_registrations_select" ON public.pending_registrations FOR SELECT USING (true);
CREATE POLICY "pending_registrations_insert" ON public.pending_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "pending_registrations_update" ON public.pending_registrations FOR UPDATE USING (true);
CREATE POLICY "pending_registrations_delete" ON public.pending_registrations FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS idx_pending_registrations_email_nim ON public.pending_registrations(email, nim);
CREATE INDEX IF NOT EXISTS idx_pending_registrations_expires_at ON public.pending_registrations(expires_at);
