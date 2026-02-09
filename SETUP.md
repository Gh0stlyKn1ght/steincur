# Development Setup: Teacher Lesson Planning Portal

## ⚠️ SPECIFICATION DOCUMENT

This setup guide describes how to develop the app being built. The project has not been initialized yet.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** version 16+ (get from https://nodejs.org/)
- **npm** version 8+ (comes with Node)
- **Git** (for version control)
- **Code editor** (VS Code recommended)
- **Browser** (Chrome/Firefox with React DevTools extension)

---

## Quick Start (5 minutes)

### 1. Clone or Download the Repository

```bash
# If using Git
git clone <repo-url>
cd course-portal

# OR if you have a zip file
unzip course-portal.zip
cd course-portal
```

### 2. Install Dependencies

```bash
npm install
```

This reads `package.json` and downloads all required libraries.

### 3. Start Development Server

```bash
npm run dev
```

You'll see:
```
  VITE v4.5.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open your browser to `http://localhost:5173/`

### 4. You're Ready to Code!

Edit files in `/src/` and the browser auto-refreshes.

---

## Complete Setup (Detailed)

### Step 1: Environment Setup

#### macOS / Linux:
```bash
# Install Node.js using Homebrew (if not already installed)
brew install node

# Verify installation
node --version  # Should be v16 or higher
npm --version   # Should be 8 or higher
```

#### Windows:
1. Download from https://nodejs.org/
2. Run the installer (use default settings)
3. Restart your computer
4. Open PowerShell and verify:
```powershell
node --version
npm --version
```

### Step 2: Project Setup

```bash
# Navigate to project folder
cd /path/to/course-portal

# Install all dependencies (this takes 1-2 minutes)
npm install

# Verify installation was successful
npm list react
```

### Step 3: Configure the IDE

#### For VS Code:

**Install Extensions**:
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for and install:
   - **ES7+ React/Redux/React-Native snippets** (by dsznajder.es7-react-js-snippets)
   - **Tailwind CSS IntelliSense** (by bradlc.vscode-tailwindcss)
   - **Prettier - Code formatter** (by esbenp.prettier-vscode)

**Enable Format on Save**:
1. File → Preferences → Settings
2. Search "Format on Save"
3. Enable the checkbox

---

## Running the Application

### Development Mode

```bash
# Start development server with hot reload
npm run dev
```

- Opens on `http://localhost:5173/`
- Auto-refreshes when you save files
- React DevTools shows component tree
- Vite shows fast build times

### Production Build

```bash
# Creates optimized production build
npm run build
```

Output goes to `/dist/` folder. Ready to deploy.

### Preview Production Build Locally

```bash
# Build first if not already done
npm run build

# Preview the production build
npm run preview
```

Opens on `http://localhost:4173/` - this is what users will see.

### Lint Code

```bash
# Check for code quality issues
npm run lint
```

Fixes simple issues automatically:
```bash
npm run lint -- --fix
```

---

## Project Initialization (First Time)

If starting from scratch, here's what needs to exist:

### 1. Create React App with Vite

```bash
npm create vite@latest course-portal -- --template react
cd course-portal
npm install
```

### 2. Install Additional Dependencies

```bash
# Styling
npm install -D tailwindcss postcss autoprefixer
npm install next-themes

# UI Components
npm install shadcn-ui

# Routing
npm install react-router-dom

# PDF Export
npm install jspdf html2canvas

# Utilities
npm install clsx date-fns uuid

# Development
npm install -D vite-plugin-eslint eslint
```

### 3. Configure Tailwind

```bash
npx tailwindcss init -p
```

Edit `tailwind.config.js`:
```javascript
export default {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Add Absolute Imports

Edit `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
})
```

### 5. Create Data Files

Create `/public/data/` directory structure:
```bash
mkdir -p public/data/courses
mkdir -p public/data/courses/{tech-engineering,intro-electronics,electronics-robotics-2,honors-innovation,sustainable-engineering,social-responsibility}
```

Then populate with JSON files (see [DATA_SCHEMA.md](./DATA_SCHEMA.md)).

---

## Folder Structure After Setup

```
course-portal/
├── node_modules/              (created by npm install)
├── public/
│   └── data/                  (create manually, populate with JSON)
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── context/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── vite.config.js             (configure with aliases above)
├── tailwind.config.js          (auto-created by Tailwind init)
├── postcss.config.js           (auto-created by Tailwind init)
├── package.json
├── package-lock.json           (created by npm install)
└── .gitignore
```

---

## Common Issues & Solutions

### Issue: "npm: command not found"

**Cause**: Node.js not installed
**Solution**: Download and install from https://nodejs.org/

---

### Issue: Port 5173 Already in Use

**Cause**: Another process is using the port
**Solution**:
```bash
# Use different port
npm run dev -- --port 3000
```

---

### Issue: "Cannot find module '@components/...'"

**Cause**: Vite aliases not configured
**Solution**: Check `vite.config.js` has all aliases defined, restart dev server

---

### Issue: Styles Not Showing (Tailwind)

**Cause**: Tailwind not scanning JSX files
**Solution**: Check `tailwind.config.js` content array includes `"./src/**/*.{js,jsx}"`

---

### Issue: Changes Not Reflecting in Browser

**Cause**: Dev server cache, hot reload issues
**Solution**:
```bash
# Stop dev server (Ctrl+C)
# Clear node_modules cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

---

## Development Workflow

### 1. Start Dev Server

```bash
npm run dev
```

### 2. Create/Edit Files

Edit files in `/src/` folder:
```
src/
├── components/YourNewComponent.jsx
├── pages/YourNewPage.jsx
└── hooks/useYourData.js
```

### 3. See Changes in Real-Time

Browser automatically reloads (hot module replacement)

### 4. When Adding New Data

Update files in `/public/data/`:
```
public/data/
├── courses.json
└── courses/
    └── tech-engineering/
        └── curriculum.json
```

Refresh browser, fetch() will load new data

### 5. Before Committing

```bash
# Check code quality
npm run lint

# Build to verify no errors
npm run build
```

---

## Git Workflow (Optional)

```bash
# Initialize git (first time)
git init

# Check what changed
git status

# Stage changes
git add .

# Commit with message
git commit -m "Feature: Add lesson editor component"

# Push to remote (if using GitHub)
git push origin main
```

---

## Deploying to Vercel

### One-Click Setup (Easiest)

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Click "Import Git Repository"
4. Select your repository
5. Click "Deploy"

Vercel auto-builds and deploys on every push!

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, done!
```

---

## Environment Variables (Phase 2)

When adding APIs (ChatGPT, Firebase, etc.):

1. Create `.env.local` file:
```
VITE_FIREBASE_KEY=xxx
VITE_OPENAI_KEY=xxx
```

2. Access in code:
```javascript
const apiKey = import.meta.env.VITE_OPENAI_KEY
```

3. **Never** commit `.env.local` - add to `.gitignore`

---

## Debugging

### React DevTools

1. Install React DevTools browser extension
2. Open DevTools (F12)
3. Go to "Components" tab
4. Inspect component tree
5. See props, state, hooks

### Console Debugging

```javascript
// In your component
console.log('Current lesson:', lesson)
console.log('All standards:', standards)
```

Open DevTools → Console tab to see output.

### Network Debugging

```javascript
// Check what JSON is loading
fetch('/data/courses.json')
  .then(r => r.json())
  .then(data => console.log('Loaded:', data))
```

Open DevTools → Network tab, filter to "XHR" to see requests.

---

## Performance Testing

### Build Analysis

```bash
# Show what's in your bundle
npm run build
# Check size in dist/ folder
```

Target: < 200KB (gzipped)

### Lighthouse (Chrome DevTools)

1. Open DevTools
2. Go to "Lighthouse" tab
3. Run audit
4. Fix issues (especially accessibility & performance)

---

## Testing (Optional for Phase 1)

### Run Tests

```bash
# If tests are configured
npm run test
```

### Writing Tests (later phases)

```javascript
// Example test file: utils/dateUtils.test.js
import { formatDate } from './dateUtils'

test('formatDate returns correct format', () => {
  const result = formatDate('2026-02-10')
  expect(result).toBe('2/10/2026')
})
```

---

## Useful npm Commands Reference

```bash
npm install          # Install dependencies from package.json
npm install pkg      # Install specific package
npm uninstall pkg    # Remove a package
npm update           # Update all packages
npm run dev          # Start dev server
npm run build        # Create production build
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run lint --fix   # Fix linting issues
npm test             # Run tests
npm start            # Alternative start command
npm list             # Show installed packages
```

---

## Troubleshooting Checklist

Before asking for help:

- [ ] Node.js version is 16+
- [ ] `npm install` completed successfully
- [ ] Dev server started with `npm run dev`
- [ ] Trying to access `http://localhost:5173/`
- [ ] Browser dev console shows no red errors
- [ ] Tried clearing browser cache (Ctrl+F5 or Cmd+Shift+R)
- [ ] Restarted dev server
- [ ] Checked that `/public/data/courses.json` exists

---

## Documentation References

- [README.md](./README.md) - Project overview
- [ROADMAP.md](./ROADMAP.md) - Timeline and features
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical design
- [DATA_SCHEMA.md](./DATA_SCHEMA.md) - Data structures
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - File organization

---

## Getting Help

### From AI Models

When asking for help, provide:
1. What you're trying to do
2. What error you're seeing (exact error message)
3. What you've already tried
4. References to relevant docs (e.g., "see ARCHITECTURE.md")

### External Resources

- **React docs**: https://react.dev/
- **Vite docs**: https://vitejs.dev/
- **Tailwind docs**: https://tailwindcss.com/docs
- **React Router docs**: https://reactrouter.com/

---

**Last Updated**: February 8, 2026
**Maintainer**: AI Development Team
