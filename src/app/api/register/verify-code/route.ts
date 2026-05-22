import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { supabase } from '@/lib/supabase';
import { validateMahasiswaEmail, validateNIMTeknikIndustri } from '@/lib/auth';

const MAX_ATTEMPTS = 5;

const hashCode = (code: string) =>
  createHash('sha256').update(code).digest('hex');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nim = String(body.nim || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const code = String(body.code || '').trim();

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ success: false, error: 'Kode verifikasi harus 6 digit' }, { status: 400 });
    }

    const nimValidation = validateNIMTeknikIndustri(nim);
    if (!nimValidation.valid) {
      return NextResponse.json({ success: false, error: nimValidation.error || 'NIM tidak valid' }, { status: 400 });
    }

    const emailValidation = validateMahasiswaEmail(email, nim);
    if (!emailValidation.valid) {
      return NextResponse.json({ success: false, error: emailValidation.error || 'Email tidak valid' }, { status: 400 });
    }

    const { data: pending, error } = await supabase
      .from('pending_registrations')
      .select('id, code_hash, attempts, expires_at')
      .eq('email', email)
      .eq('nim', nim)
      .eq('consumed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!pending) {
      return NextResponse.json({ success: false, error: 'Kode verifikasi tidak ditemukan. Kirim ulang kode.' }, { status: 404 });
    }

    if (new Date(pending.expires_at).getTime() < Date.now()) {
      await supabase.from('pending_registrations').delete().eq('id', pending.id);
      return NextResponse.json({ success: false, error: 'Kode verifikasi sudah kedaluwarsa. Kirim ulang kode.' }, { status: 410 });
    }

    if ((pending.attempts || 0) >= MAX_ATTEMPTS) {
      return NextResponse.json({ success: false, error: 'Terlalu banyak percobaan. Kirim ulang kode.' }, { status: 429 });
    }

    if (pending.code_hash !== hashCode(code)) {
      await supabase
        .from('pending_registrations')
        .update({ attempts: (pending.attempts || 0) + 1 })
        .eq('id', pending.id);

      return NextResponse.json({ success: false, error: 'Kode verifikasi salah' }, { status: 400 });
    }

    await supabase
      .from('pending_registrations')
      .update({ consumed: true })
      .eq('id', pending.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify registration code error:', error);
    return NextResponse.json({ success: false, error: 'Gagal memverifikasi kode' }, { status: 500 });
  }
}
