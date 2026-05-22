import { NextResponse } from 'next/server';
import { createHash, randomInt } from 'crypto';
import { supabase } from '@/lib/supabase';
import { validateMahasiswaEmail, validateNIMTeknikIndustri } from '@/lib/auth';

const CODE_TTL_MINUTES = 10;

const hashCode = (code: string) =>
  createHash('sha256').update(code).digest('hex');

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Gagal mengirim kode verifikasi';

const getEmailHtml = (code: string) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
    <h2>Kode Verifikasi LabTrack</h2>
    <p>Gunakan kode berikut untuk menyelesaikan registrasi akun mahasiswa:</p>
    <div style="font-size:28px;font-weight:700;letter-spacing:6px;margin:24px 0">${code}</div>
    <p>Kode berlaku selama ${CODE_TTL_MINUTES} menit. Abaikan email ini jika Anda tidak melakukan registrasi.</p>
  </div>
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nim = String(body.nim || '').trim();
    const email = String(body.email || '').trim().toLowerCase();

    const nimValidation = validateNIMTeknikIndustri(nim);
    if (!nimValidation.valid) {
      return NextResponse.json({ success: false, error: nimValidation.error || 'NIM tidak valid' }, { status: 400 });
    }

    const emailValidation = validateMahasiswaEmail(email, nim);
    if (!emailValidation.valid) {
      return NextResponse.json({ success: false, error: emailValidation.error || 'Email tidak valid' }, { status: 400 });
    }

    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json({ success: false, error: 'Email sudah terdaftar' }, { status: 409 });
    }

    const { data: existingNim } = await supabase
      .from('users')
      .select('id')
      .eq('nim', nim)
      .maybeSingle();

    if (existingNim) {
      return NextResponse.json({ success: false, error: 'NIM sudah terdaftar' }, { status: 409 });
    }

    const code = String(randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();

    await supabase
      .from('pending_registrations')
      .delete()
      .or(`email.eq.${email},nim.eq.${nim}`);

    const { error: insertError } = await supabase
      .from('pending_registrations')
      .insert([{
        email,
        nim,
        code_hash: hashCode(code),
        expires_at: expiresAt
      }]);

    if (insertError) throw insertError;

    const resendKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || 'LabTrack <onboarding@resend.dev>';
    const subject = 'Kode Verifikasi Registrasi LabTrack';
    const text = `Kode verifikasi LabTrack Anda adalah ${code}. Kode berlaku selama ${CODE_TTL_MINUTES} menit.`;
    const html = getEmailHtml(code);

    if (!resendKey && process.env.NODE_ENV === 'production') {
      throw new Error('RESEND_API_KEY belum dikonfigurasi');
    }

    if (resendKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: email,
          subject,
          text,
          html
        })
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || 'Provider email menolak pengiriman');
      }
    } else {
      console.info(`[DEV] Kode verifikasi LabTrack untuk ${email}: ${code}`);
    }

    return NextResponse.json({
      success: true,
      message: `Kode verifikasi dikirim ke ${email}`,
      devCode: !resendKey && process.env.NODE_ENV !== 'production' ? code : undefined
    });
  } catch (error) {
    console.error('Send registration code error:', error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
