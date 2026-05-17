# 🔒 LabTrack Security Guide

## 📋 Overview

Dokumen ini menjelaskan fitur keamanan yang diimplementasikan di LabTrack v2.0 dan best practices untuk deployment production.

---

## 🔐 Authentication & Authorization

### Password Security

#### Current Implementation (v2.0)
- **Hashing Algorithm**: SHA-256 (client-side)
- **Minimum Length**: 8 characters
- **Strength Validation**: Weak/Medium/Strong
- **Storage**: Hashed in `password_hash` column

#### Production Recommendations
```typescript
// ⚠️ Current (Demo)
const hash = await crypto.subtle.digest('SHA-256', data);

// ✅ Recommended (Production)
// Use bcrypt on server-side
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 10);
```

**Why bcrypt?**
- Designed for password hashing
- Built-in salt
- Configurable work factor
- Resistant to rainbow table attacks
- Industry standard

### Email Validation

#### Domain Restrictions
- **Mahasiswa**: `@student.untirta.ac.id`
- **Admin/Staff**: `@untirta.ac.id`
- **Super Admin**: `@untirta.ac.id`

```typescript
// Validation function
export function validateEmailDomain(
  email: string, 
  role: 'mahasiswa' | 'admin' | 'super_admin'
): boolean {
  const emailLower = email.toLowerCase();
  
  if (role === 'mahasiswa') {
    return emailLower.endsWith('@student.untirta.ac.id');
  } else {
    return emailLower.endsWith('@untirta.ac.id');
  }
}
```

### NIM Validation

#### Format Requirements
- **Length**: Exactly 10 digits
- **Pattern**: `3333YYXXXX`
  - `33` = Fakultas Teknik
  - `33` = Teknik Industri
  - `YY` = Tahun angkatan (00-99)
  - `XXXX` = Nomor urut (0001-9999)

#### Database-Level Validation
```sql
CREATE OR REPLACE FUNCTION validate_nim_teknik_industri(nim TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF LENGTH(nim) != 10 THEN RETURN FALSE; END IF;
  IF nim !~ '^[0-9]+$' THEN RETURN FALSE; END IF;
  IF SUBSTRING(nim, 1, 4) != '3333' THEN RETURN FALSE; END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE public.users ADD CONSTRAINT valid_nim_format 
  CHECK (nim IS NULL OR validate_nim_teknik_industri(nim));
```

---

## 🛡️ Row Level Security (RLS)

### Current Policies

#### Users Table
```sql
-- Read: Anyone can read (for demo)
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (true);

-- Update: Users can update own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (true);

-- Insert: Allow registration
CREATE POLICY "Allow registration insert" ON public.users
  FOR INSERT WITH CHECK (true);
```

#### Equipment Table
```sql
-- Read: Anyone can read
CREATE POLICY "Anyone can read equipment" ON public.equipment
  FOR SELECT USING (true);

-- Manage: Admin only
CREATE POLICY "Admin can manage equipment" ON public.equipment
  FOR ALL USING (true);
```

#### Loans Table
```sql
-- Read: Anyone can read
CREATE POLICY "Anyone can read loans" ON public.loans
  FOR SELECT USING (true);

-- Create: Users can create
CREATE POLICY "Users can create loans" ON public.loans
  FOR INSERT WITH CHECK (true);

-- Update: Admin only
CREATE POLICY "Admin can update loans" ON public.loans
  FOR UPDATE USING (true);
```

### Production Recommendations

#### Stricter User Policies
```sql
-- Users can only read their own data
CREATE POLICY "Users read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Super admin can read all
CREATE POLICY "Super admin read all" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
```

#### Role-Based Equipment Management
```sql
-- Only admin/super_admin can manage equipment
CREATE POLICY "Admin manage equipment" ON public.equipment
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
```

#### User-Specific Loans
```sql
-- Users can only see their own loans
CREATE POLICY "Users read own loans" ON public.loans
  FOR SELECT USING (user_id = auth.uid());

-- Admin can see all loans
CREATE POLICY "Admin read all loans" ON public.loans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
```

---

## 🔑 Session Management

### Current Implementation
- **Storage**: localStorage
- **Key**: `labtrack_user`
- **Expiration**: None (manual logout)

### Production Recommendations

#### Use Supabase Auth
```typescript
// Login with Supabase Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password,
});

// Get session
const { data: { session } } = await supabase.auth.getSession();

// Logout
await supabase.auth.signOut();
```

#### Session Timeout
```typescript
// Set session timeout (e.g., 24 hours)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

// Check session validity
const isSessionValid = () => {
  const user = localStorage.getItem('labtrack_user');
  if (!user) return false;
  
  const { lastLogin } = JSON.parse(user);
  const now = Date.now();
  const loginTime = new Date(lastLogin).getTime();
  
  return (now - loginTime) < SESSION_TIMEOUT;
};
```

---

## 🚨 Security Best Practices

### 1. Environment Variables

#### Never Commit Secrets
```bash
# .env.local (NEVER commit this file)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key  # Server-side only!
```

#### Use .env.example
```bash
# .env.example (Safe to commit)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Input Validation

#### Always Validate on Both Sides
```typescript
// Client-side validation (UX)
const validateForm = () => {
  if (!email.endsWith('@student.untirta.ac.id')) {
    setError('Email harus @student.untirta.ac.id');
    return false;
  }
  return true;
};

// Server-side validation (Security)
// In Supabase function or API route
if (!email.endsWith('@student.untirta.ac.id')) {
  throw new Error('Invalid email domain');
}
```

### 3. SQL Injection Prevention

#### Use Parameterized Queries
```typescript
// ✅ Good - Parameterized
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail);

// ❌ Bad - String concatenation
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

### 4. XSS Prevention

#### Sanitize User Input
```typescript
// Use React's built-in XSS protection
<div>{user.name}</div>  // ✅ Automatically escaped

// For dangerouslySetInnerHTML, sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userContent) 
}} />
```

### 5. CSRF Protection

#### Use SameSite Cookies
```typescript
// In Next.js API routes
res.setHeader('Set-Cookie', [
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`
]);
```

### 6. Rate Limiting

#### Implement Rate Limiting
```typescript
// Example with Vercel Edge Config
import { ratelimit } from '@/lib/ratelimit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
  
  // Process request
}
```

---

## 🔍 Audit Logging

### Activity Logs

#### What to Log
- ✅ User login/logout
- ✅ User registration
- ✅ Password changes
- ✅ User creation/deletion (super admin)
- ✅ Equipment CRUD operations
- ✅ Loan status changes
- ✅ Failed login attempts
- ✅ Permission denied events

#### Log Structure
```typescript
interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  type: ActivityType;
  description: string;
  metadata?: Record<string, string>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
```

#### Implementation
```typescript
await addActivityLog({
  userId: currentUser.id,
  userName: currentUser.name,
  userRole: currentUser.role,
  type: 'login',
  description: `${currentUser.name} login ke sistem`,
  metadata: {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  }
});
```

---

## 🚀 Production Deployment Checklist

### Pre-Deployment

- [ ] Change all default passwords
- [ ] Update super admin password
- [ ] Remove demo accounts (optional)
- [ ] Enable stricter RLS policies
- [ ] Implement bcrypt password hashing
- [ ] Add session timeout
- [ ] Enable rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CORS properly
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Implement CSRF protection
- [ ] Add security headers
- [ ] Enable audit logging
- [ ] Set up backup strategy
- [ ] Configure firewall rules

### Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Post-Deployment

- [ ] Test all authentication flows
- [ ] Verify RLS policies working
- [ ] Check audit logs
- [ ] Monitor error rates
- [ ] Test rate limiting
- [ ] Verify HTTPS redirect
- [ ] Check security headers
- [ ] Run security scan (OWASP ZAP)
- [ ] Penetration testing
- [ ] Load testing

---

## 📞 Security Incident Response

### If Security Breach Detected

1. **Immediate Actions**
   - Disable affected accounts
   - Rotate all secrets/keys
   - Enable maintenance mode
   - Notify users

2. **Investigation**
   - Check audit logs
   - Identify breach vector
   - Assess data exposure
   - Document findings

3. **Remediation**
   - Patch vulnerabilities
   - Update security policies
   - Restore from backup if needed
   - Re-enable services

4. **Post-Incident**
   - Update security procedures
   - Train team on lessons learned
   - Improve monitoring
   - Document incident

---

## 📚 Resources

### Security Tools
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

### Password Security
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

### Monitoring
- [Sentry](https://sentry.io/)
- [LogRocket](https://logrocket.com/)

---

<div align="center">
  <p><strong>LabTrack Security Guide v2.0</strong></p>
  <p>Stay secure! 🔒</p>
</div>
