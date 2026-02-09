# Architecture: Teacher Lesson Planning Portal

## ⚠️ SPECIFICATION DOCUMENT

This is the technical design specification for the app being built, not documentation of an existing system.

---

## System Design Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface (React)                   │
│  Dashboard │ LessonEditor │ Standards │ Export │ Progress    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              React Context + Custom Hooks                    │
│  useLessonPlans │ useCourses │ useStandards │ useCalendar    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Data Layer                                  │
│  localStorage (browser)  │  /public/data/ (JSON files)       │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Principles

1. **Teacher-First** - Every feature prioritizes ease of use for teachers
2. **Offline-First** - Works without internet (localStorage); syncs when online (Phase 2)
3. **Data-Driven** - JSON-based data structure, easy to export/import
4. **Modular** - Components are small, reusable, testable
5. **Progressive** - MVP is minimal; features build progressively
6. **Standards-Aligned** - NJ standards are core, not an afterthought

---

## Technology Stack Rationale

| Technology | Why | Alternatives Considered |
|------------|-----|--------------------------|
| React 18 | Modern, component-based, large ecosystem | Vue, Svelte |
| Vite | Fast dev server, quick builds, modern tooling | Webpack, Create React App |
| Tailwind CSS | Utility-first, minimal CSS to write, responsive | Material-UI, styled-components |
| shadcn/ui | Pre-built accessible components, Tailwind-based | Chakra UI, Ant Design |
| React Router v6 | Industry standard, file-based routing compatible | TanStack Router |
| Context API | Simple state management, no external deps for MVP | Redux, Zustand, Jotai |
| localStorage | Browser-native, no server needed initially | IndexedDB, sessionStorage |
| JSON files | Simple, version-controllable, no DB needed | SQLite, MongoDB, Firebase |

---

## State Management Architecture

### Global State (React Context)

#### `CoursesContext`
```javascript
{
  courses: Course[],
  activeCourse: Course | null,
  setCourse: (courseId) => void
}
```
**Used by**: Dashboard, Navigation, CoursePage

#### `LessonPlansContext`
```javascript
{
  lessonPlans: LessonPlan[],
  addLessonPlan: (lesson) => void,
  updateLessonPlan: (id, updates) => void,
  deleteLessonPlan: (id) => void,
  getLessonsByDate: (date) => LessonPlan[],
  getLessonsByCourse: (courseId) => LessonPlan[]
}
```
**Used by**: LessonEditor, Dashboard, ProgressTracker, Export

#### `StandardsContext`
```javascript
{
  standards: Standard[],
  getStandardsByCourse: (courseId) => Standard[],
  getStandardsByUnit: (courseId, unitId) => Standard[]
}
```
**Used by**: StandardsAligner, Dashboard

### Local State (Component-Level)

Used for:
- Form inputs (useFormState or individual useState)
- UI state (modal open/closed, dropdown expanded, etc.)
- Temporary calculations
- Search results

**Rule**: Lift state up only if multiple components need it

---

## Data Flow Architecture

### Writing a Lesson Plan

```
Teacher Input (LessonEditor)
    ↓
Validate Data (client-side)
    ↓
Add to LessonPlansContext
    ↓
Persist to localStorage
    ↓
Show success toast
    ↓
Redirect to Dashboard
```

### Reading Lesson Plans

```
App Mounts
    ↓
Load from localStorage in useEffect
    ↓
Populate LessonPlansContext
    ↓
Components subscribe to context
    ↓
Re-render when data changes
```

### Loading Curriculum Data

```
App Mounts
    ↓
Fetch /public/data/courses.json
    ↓
Fetch /public/data/nj-standards.json
    ↓
Fetch /public/data/lesson-plan-templates.json
    ↓
Store in CoursesContext & StandardsContext
    ↓
Ready for UI to use
```

---

## Component Architecture

### Component Hierarchy

```
App
├── Router
│   ├── Layout (navbar, sidebar)
│   │   ├── Dashboard (page)
│   │   ├── YearPlanner (page)
│   │   ├── LessonPlanPage (page)
│   │   │   └── LessonEditor (component)
│   │   │       ├── TemplateSelector
│   │   │       ├── StandardsAligner
│   │   │       └── MaterialsLinker
│   │   ├── CoursePlanPage (page)
│   │   │   └── CourseView (component)
│   │   │       ├── UnitList
│   │   │       └── LessonList
│   │   └── ProgressPage (page)
│   │       └── ProgressTracker (component)
│   │
│   └── ErrorBoundary
│       └── 404 Page
│
└── Providers
    ├── CoursesProvider
    ├── LessonPlansProvider
    └── StandardsProvider
```

### Component Naming Conventions

- **Pages**: `DashboardPage.jsx`, `LessonPlanPage.jsx` - full screen components
- **Layouts**: `MainLayout.jsx` - wrapper components
- **Components**: `LessonEditor.jsx`, `TemplateSelector.jsx` - reusable UI pieces
- **Hooks**: `useLessonPlans.js`, `useStandards.js` - custom logic

### Component Props Pattern

Keep props shallow. Pass data and callbacks:

```javascript
// ✅ Good
<LessonEditor
  lesson={lesson}
  templates={templates}
  standards={standards}
  onSave={handleSave}
  onCancel={handleCancel}
/>

// ❌ Avoid
<LessonEditor
  lessonId={id}
  courseId={cId}
  unitId={uId}
  // ... many derived props
/>
```

---

## Data Schema Design

### Core Entities

```
Course
├── id: string
├── name: string
├── code: string
├── grade: string
├── description: string
├── color: string (hex)
└── units: string[] (unit IDs)

Unit
├── id: string
├── courseId: string
├── name: string
├── description: string
├── sequence: number
└── lessons: string[] (lesson IDs)

LessonPlan
├── id: string
├── courseId: string
├── unitId: string
├── date: ISO date string
├── title: string
├── duration: number (minutes)
├── status: "planned" | "in-progress" | "taught" | "assessed"
├── objectives: string[]
├── agenda: { time: string, activity: string }[]
├── materials: Material[]
├── standards: string[] (standard codes)
├── assessment: string
├── homework: string
├── notes: string
└── createdAt: ISO timestamp

Material
├── id: string
├── type: "pdf" | "doc" | "link" | "slide-deck" | "video" | "other"
├── title: string
├── path: string (local) | url (external)
└── description: string

Standard
├── code: string (e.g., "NJ.9.4.A.1")
├── description: string
├── course: string (which course uses this)
└── unit: string (which unit primarily covers this)

Template
├── id: string
├── name: string (e.g., "Lab-Based Lesson")
├── description: string
├── agenda: { time: string, activity: string }[]
├── defaultDuration: number
└── placeholderObjectives: string[]
```

**Full schema with examples**: See [DATA_SCHEMA.md](./DATA_SCHEMA.md)

---

## Storage Strategy

### Phase 1: localStorage Only

```javascript
// Lesson plans stored in localStorage
localStorage.setItem('lessonPlans', JSON.stringify(lessonPlans))

// Courses/standards/templates loaded from /public/data/
fetch('/data/courses.json').then(r => r.json())
```

**Pros**: No backend, works offline, simple
**Cons**: Single device only, limited storage (~5-10MB)

### Phase 2: Cloud Sync (Firebase/Supabase)

```javascript
// Lesson plans sync to Firestore/Supabase
// localStorage as cache, cloud as source of truth
if (online) {
  syncToCloud()
}
```

**Pros**: Multi-device, backup, shareable
**Cons**: Requires internet, external service

### Transition Strategy

- Phase 1 code uses `useLocalStorage()` hook
- Phase 2 replaces with cloud sync hook: `useCloudStorage()`
- Components don't change, just the hook implementation

---

## Error Handling Strategy

### Client-Side Validation

Every form validates before saving:
```javascript
// In LessonEditor
const validate = (lesson) => {
  const errors = []
  if (!lesson.title) errors.push("Title is required")
  if (!lesson.date) errors.push("Date is required")
  if (lesson.duration < 1) errors.push("Duration must be > 0")
  return errors
}
```

### User Feedback

- **Success**: Toast notification "Lesson saved!"
- **Error**: Toast + error message "Title is required"
- **Loading**: Spinner while saving

### Browser Errors

- Error boundary catches React errors
- Console logs for debugging
- User-friendly message: "Something went wrong. Try refreshing."

---

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - Page components loaded lazily via React.lazy()
   - Heavy components (PDFExport) lazy-loaded

2. **Memoization**
   - useMemo() for expensive calculations (lesson filtering)
   - useCallback() for handler functions passed to children

3. **Data Fetching**
   - Curriculum data loaded once at app startup
   - Lesson plans loaded on-demand per course

4. **localStorage Queries**
   - Cache lesson lists by course
   - Re-fetch only when lesson plans change

### Bundle Size Goals
- Initial: < 200KB (gzipped)
- Lazy chunks: < 50KB each

---

## Testing Strategy

### Unit Tests
- Custom hooks: `useLessonPlans.test.js`
- Utility functions: `dateUtils.test.js`
- Data validation: `validation.test.js`

### Component Tests
- LessonEditor: Can save, edit, validate
- Dashboard: Displays week correctly
- TemplateSelector: Populates editor correctly

### Integration Tests
- Create lesson → see it in dashboard → export to PDF
- Change course → see correct lessons
- Tag standard → see in standards report

### E2E Tests (Phase 2)
- Full user flow: Create course → Add lessons → Export

---

## Accessibility (a11y)

### Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader support (ARIA labels)
- Color contrast > 4.5:1
- Mobile accessible (touch targets > 44px)

### Implementation
- shadcn/ui components are accessible by default
- Always add aria-labels to interactive elements
- Test with keyboard-only navigation
- Use semantic HTML (button, nav, section, etc.)

---

## Security Considerations

### Phase 1: Local Only
- No external API calls
- No authentication needed
- Data is public (localStorage, not encrypted)

### Phase 2: Cloud Integration
- HTTPS only
- User authentication (email + password or OAuth)
- Lesson plans only visible to teacher who created them
- Admin can view with permission

### General
- No sensitive data in comments/notes
- Sanitize any user input (though mostly structured data)
- No direct database access from frontend

---

## Deployment & DevOps

### Development
```bash
npm run dev          # Start Vite dev server on localhost:5173
npm run lint         # Check for lint errors
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Staging
- Vercel preview deployments for every PR
- Test on production-like environment

### Production
- Vercel main branch auto-deploys
- Automatic HTTPS
- CDN distribution
- Automatic backups (if using database)

---

## Monitoring & Debugging

### Development Tools
- React DevTools (Chrome extension)
- Network tab (Chrome DevTools) for API calls
- localStorage inspector

### Production (Phase 2)
- Sentry for error tracking
- Google Analytics for usage
- Performance monitoring (Web Vitals)

---

## Future Extensibility

### Designed for Later Addition

1. **Real-time Collaboration** (Phase 3)
   - WebSockets for live editing
   - Conflict resolution for concurrent edits

2. **Mobile App** (Phase 4)
   - React Native sharing components
   - Offline sync capabilities

3. **Multi-tenant** (Phase 5)
   - Different schools/departments
   - Role-based access control

4. **API** (Phase 6)
   - REST API for external apps
   - Third-party integrations (Google Classroom, etc.)

---

## Key Architectural Decisions

| Decision | Reasoning | Alternative |
|----------|-----------|-------------|
| JSON files, not DB | Simple, version-control friendly, MVP speed | Firebase, PostgreSQL |
| localStorage first | Works offline, no backend | Cookies, IndexedDB |
| React Context | Simple, no Redux complexity for MVP | Redux, Zustand |
| Tailwind CSS | Fast styling, minimal CSS | Material-UI, styled-components |
| Vite | Modern, fast, ESM native | Webpack, Parcel |
| Single-device Phase 1 | MVP speed, add sync in Phase 2 | Cloud from start |

---

## Refactoring & Technical Debt

### Debt to Address Later
1. Move from localStorage to cloud (Phase 2)
2. Add proper error tracking (Sentry)
3. Optimize large lesson lists (virtualization)
4. Add real-time collaboration

### When to Refactor
- After Phase 1 complete: Review architecture with feedback
- If adding major feature: Check if existing patterns fit
- When performance issues arise: Profile and optimize

---

**Last Updated**: February 8, 2026
**Next Review**: After Phase 1 completion
**Maintainer**: AI Development Team
