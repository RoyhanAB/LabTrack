/**
 * Authentication utilities
 * Password hashing, validation, and NIM validation
 */

/**
 * Simple hash function for demo purposes
 * In production, use bcrypt or similar on the server side
 */
export async function hashPassword(password: string): Promise<string> {
  // For demo, we'll use a simple hash
  // In production, this should be done server-side with bcrypt
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * Validate email domain for UNTIRTA
 * Mahasiswa: 3333YYXXXX@untirta.ac.id (NIM sebagai email)
 * Admin/Staff: nama@untirta.ac.id
 */
export function validateEmailDomain(email: string, role: 'mahasiswa' | 'admin' | 'asisten' | 'super_admin'): boolean {
  const emailLower = email.toLowerCase();
  if (role === 'mahasiswa') {
    return /^3333\d{6}@untirta\.ac\.id$/.test(emailLower);
  }
  return emailLower.endsWith('@untirta.ac.id');
}

/**
 * Validate mahasiswa email format: must be NIM@untirta.ac.id
 * Example: 3333230001@untirta.ac.id
 */
export function validateMahasiswaEmail(email: string, nim?: string): {
  valid: boolean;
  error?: string;
} {
  const emailLower = email.toLowerCase().trim();
  
  if (!emailLower.endsWith('@untirta.ac.id')) {
    return { valid: false, error: 'Email harus menggunakan domain @untirta.ac.id' };
  }
  
  const prefix = emailLower.replace('@untirta.ac.id', '');
  
  // Check prefix is a valid NIM format (3333YYXXXX)
  if (!/^3333\d{6}$/.test(prefix)) {
    return { valid: false, error: 'Email harus berformat NIM@untirta.ac.id (contoh: 3333230001@untirta.ac.id)' };
  }
  
  // Cross-validate with NIM field if provided
  if (nim && prefix !== nim) {
    return { valid: false, error: 'Email harus sesuai dengan NIM Anda (NIM@untirta.ac.id)' };
  }
  
  return { valid: true };
}

/**
 * Validate NIM format for Teknik Industri
 * Format: 3333YYXXXX
 * - 33 = Fakultas Teknik
 * - 33 = Teknik Industri
 * - YY = Tahun angkatan (00-99)
 * - XXXX = Nomor urut (0001-9999)
 */
export function validateNIMTeknikIndustri(nim: string): {
  valid: boolean;
  error?: string;
} {
  // Check length
  if (nim.length !== 10) {
    return {
      valid: false,
      error: 'NIM harus 10 digit'
    };
  }

  // Check if all numeric
  if (!/^\d+$/.test(nim)) {
    return {
      valid: false,
      error: 'NIM harus berupa angka'
    };
  }

  // Check fakultas code (33 = Fakultas Teknik)
  const fakultasCode = nim.substring(0, 2);
  if (fakultasCode !== '33') {
    return {
      valid: false,
      error: 'NIM harus dimulai dengan 33 (Fakultas Teknik)'
    };
  }

  // Check prodi code (33 = Teknik Industri)
  const prodiCode = nim.substring(2, 4);
  if (prodiCode !== '33') {
    return {
      valid: false,
      error: 'NIM harus memiliki kode prodi 33 (Teknik Industri). Format: 3333YYXXXX'
    };
  }

  // Check tahun angkatan (YY)
  const tahunAngkatan = nim.substring(4, 6);
  const tahunNum = parseInt(tahunAngkatan, 10);
  const currentYear = new Date().getFullYear() % 100; // Get last 2 digits
  
  // Validate tahun angkatan (reasonable range: not in the future)
  if (tahunNum > currentYear + 1) {
    return {
      valid: false,
      error: `Tahun angkatan ${2000 + tahunNum} melebihi tahun saat ini`
    };
  }
  
  if (tahunNum < 15) { // Minimal angkatan 2015
    return {
      valid: false,
      error: 'Tahun angkatan terlalu lama (minimal angkatan 2015)'
    };
  }

  // Check nomor urut (XXXX)
  const nomorUrut = nim.substring(6, 10);
  const nomorUrutNum = parseInt(nomorUrut, 10);
  
  if (nomorUrutNum < 1 || nomorUrutNum > 9999) {
    return {
      valid: false,
      error: 'Nomor urut harus antara 0001-9999'
    };
  }

  return { valid: true };
}

/**
 * Extract info from NIM
 */
export function parseNIM(nim: string): {
  fakultas: string;
  prodi: string;
  angkatan: string;
  nomorUrut: string;
} | null {
  const validation = validateNIMTeknikIndustri(nim);
  if (!validation.valid) {
    return null;
  }

  return {
    fakultas: nim.substring(0, 2), // 33
    prodi: nim.substring(2, 4),    // 33
    angkatan: nim.substring(4, 6), // YY
    nomorUrut: nim.substring(6, 10) // XXXX
  };
}



/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  error?: string;
  strength?: 'weak' | 'medium' | 'strong';
} {
  if (password.length < 8) {
    return {
      valid: false,
      error: 'Password minimal 8 karakter'
    };
  }

  if (password.length < 12) {
    return {
      valid: true,
      strength: 'weak'
    };
  }

  // Check for mix of characters
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (criteriaCount >= 3) {
    return {
      valid: true,
      strength: 'strong'
    };
  } else if (criteriaCount >= 2) {
    return {
      valid: true,
      strength: 'medium'
    };
  } else {
    return {
      valid: true,
      strength: 'weak'
    };
  }
}
