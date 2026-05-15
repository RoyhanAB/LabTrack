# 🤝 Contributing to LabTrack

Terima kasih atas minat Anda untuk berkontribusi pada LabTrack! Dokumen ini berisi panduan untuk berkontribusi pada proyek ini.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Bug Reports](#bug-reports)
8. [Feature Requests](#feature-requests)

## 📜 Code of Conduct

### Our Pledge

Kami berkomitmen untuk menjadikan partisipasi dalam proyek ini sebagai pengalaman yang bebas dari pelecehan bagi semua orang, terlepas dari usia, ukuran tubuh, disabilitas, etnisitas, identitas dan ekspresi gender, tingkat pengalaman, kebangsaan, penampilan pribadi, ras, agama, atau identitas dan orientasi seksual.

### Our Standards

**Perilaku yang Diharapkan:**
- Menggunakan bahasa yang ramah dan inklusif
- Menghormati sudut pandang dan pengalaman yang berbeda
- Menerima kritik konstruktif dengan baik
- Fokus pada yang terbaik untuk komunitas
- Menunjukkan empati terhadap anggota komunitas lainnya

**Perilaku yang Tidak Dapat Diterima:**
- Penggunaan bahasa atau gambar seksual
- Trolling, komentar menghina/merendahkan, dan serangan pribadi atau politik
- Pelecehan publik atau pribadi
- Mempublikasikan informasi pribadi orang lain tanpa izin
- Perilaku lain yang dapat dianggap tidak pantas dalam lingkungan profesional

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ atau Bun
- Git
- Code editor (VS Code recommended)
- Akun GitHub
- Akun Supabase (untuk testing)

### Setup Development Environment

1. **Fork Repository**
   ```bash
   # Klik tombol "Fork" di GitHub
   ```

2. **Clone Fork Anda**
   ```bash
   git clone https://github.com/YOUR_USERNAME/labtrack-app.git
   cd labtrack-app
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/labtrack-app.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   # atau
   bun install
   ```

5. **Setup Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local dengan credentials Anda
   ```

6. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Strategy

Kami menggunakan **Git Flow** workflow:

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes
- `release/*` - Release preparation

### Creating a Feature Branch

```bash
# Update develop branch
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature
# ...

# Commit changes
git add .
git commit -m "feat: add your feature"

# Push to your fork
git push origin feature/your-feature-name
```

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream develop into your develop
git checkout develop
git merge upstream/develop

# Rebase your feature branch
git checkout feature/your-feature-name
git rebase develop
```

## 💻 Coding Standards

### TypeScript

- **Always use TypeScript** - No plain JavaScript files
- **Define types explicitly** - Avoid `any` type
- **Use interfaces** for object shapes
- **Use type aliases** for unions and primitives

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  role: 'mahasiswa' | 'admin';
}

// ❌ Bad
const user: any = { ... };
```

### React Components

- **Use functional components** with hooks
- **Use proper naming** - PascalCase for components
- **One component per file** (except small related components)
- **Props interface** for every component

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### File Structure

```
src/
├── app/              # Next.js pages
│   ├── (auth)/      # Auth group
│   ├── admin/       # Admin pages
│   └── mahasiswa/   # Student pages
├── components/       # Reusable components
│   ├── ui/          # UI components
│   └── layout/      # Layout components
├── lib/             # Utilities
│   ├── hooks/       # Custom hooks
│   ├── utils/       # Helper functions
│   └── types.ts     # Type definitions
└── styles/          # Global styles
```

### Naming Conventions

- **Components**: PascalCase (`UserCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (`UserProfile`)
- **CSS Classes**: kebab-case (`user-card`)

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line length**: Max 100 characters
- **Trailing commas**: Yes

```typescript
// ✅ Good
const user = {
  name: 'John',
  email: 'john@example.com',
};

// ❌ Bad
const user = {
  name: "John",
  email: "john@example.com"
}
```

### Comments

- **Use JSDoc** for functions
- **Explain WHY**, not WHAT
- **Keep comments updated**

```typescript
/**
 * Calculates the number of days between two dates
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns Number of days between the dates
 */
function daysBetween(startDate: Date, endDate: Date): number {
  // Implementation
}
```

## 📝 Commit Guidelines

Kami menggunakan **Conventional Commits** specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(auth): add password reset functionality"

# Bug fix
git commit -m "fix(inventory): correct stock calculation on return"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(api): simplify loan approval logic"

# Multiple changes
git commit -m "feat(notifications): add real-time notifications

- Add notification dropdown component
- Implement mark as read functionality
- Add notification badge counter

Closes #123"
```

### Commit Best Practices

- **One logical change per commit**
- **Write clear, descriptive messages**
- **Use present tense** ("add feature" not "added feature")
- **Reference issues** when applicable
- **Keep commits atomic** and focused

## 🔀 Pull Request Process

### Before Submitting

1. **Update your branch** with latest develop
2. **Run tests** (when available)
3. **Check linting** - `npm run lint`
4. **Build successfully** - `npm run build`
5. **Test manually** in browser
6. **Update documentation** if needed

### PR Title

Follow the same format as commit messages:

```
feat(inventory): add bulk import functionality
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
[Add screenshots here]

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on mobile
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated (if applicable)

## Related Issues
Closes #123
Related to #456
```

### Review Process

1. **Automated checks** must pass
2. **At least one approval** required
3. **Address review comments**
4. **Squash commits** if requested
5. **Maintainer will merge**

### After Merge

1. **Delete your branch**
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your fork**
   ```bash
   git checkout develop
   git pull upstream develop
   git push origin develop
   ```

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** - Bug might already be reported
2. **Try latest version** - Bug might be fixed
3. **Reproduce consistently** - Ensure it's not a one-time issue

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information.
```

## 💡 Feature Requests

### Before Requesting

1. **Search existing requests** - Feature might be planned
2. **Check roadmap** - Feature might be in progress
3. **Consider alternatives** - Existing features might work

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.

**Would you like to implement this feature?**
- [ ] Yes, I can work on this
- [ ] No, just suggesting
```

## 🎯 Areas for Contribution

### High Priority

- [ ] Supabase Storage integration
- [ ] Email notifications
- [ ] Push notifications
- [ ] Advanced search filters
- [ ] Export improvements (PDF library)
- [ ] Unit tests
- [ ] E2E tests

### Medium Priority

- [ ] Dark mode
- [ ] Multi-language support
- [ ] User profile management
- [ ] Password reset
- [ ] Calendar view
- [ ] Bulk operations

### Low Priority

- [ ] QR Code scanner
- [ ] Barcode integration
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] AI recommendations

## 📚 Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Tools

- [VS Code](https://code.visualstudio.com/)
- [GitHub Desktop](https://desktop.github.com/)
- [Postman](https://www.postman.com/)
- [Figma](https://www.figma.com/)

## 💬 Communication

### Channels

- **GitHub Issues** - Bug reports & feature requests
- **GitHub Discussions** - General questions & ideas
- **Pull Requests** - Code review & discussion
- **Email** - support@labtrack.untirta.ac.id

### Response Time

- **Bug reports**: 1-3 days
- **Feature requests**: 1 week
- **Pull requests**: 2-5 days
- **Questions**: 1-2 days

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- CHANGELOG.md for significant contributions
- GitHub contributors page

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

<div align="center">
  <p><strong>Thank you for contributing to LabTrack!</strong></p>
  <p>Your contributions help make laboratory management better for everyone.</p>
</div>
