# Project Structure: Teacher Lesson Planning Portal

## ⚠️ SPECIFICATION DOCUMENT

This is the specified file organization for the app being built, not the current state. Project has not been initialized yet.

---

## Complete Directory Tree

```
course-portal/
│
├── public/                                      # Static assets & data
│   └── data/                                    # All course data (JSON)
│       ├── courses.json                         # Master course list
│       ├── nj-standards.json                    # All NJ standards
│       ├── lesson-plan-templates.json           # Template definitions
│       └── courses/                             # Per-course data
│           ├── tech-engineering/
│           │   ├── curriculum.json              # Units & topics
│           │   ├── pacing-guide.json            # Suggested timeline
│           │
│           ├── intro-electronics/
│           │   ├── curriculum.json
│           │   └── pacing-guide.json
│           │
│           ├── electronics-robotics-2/
│           │   ├── curriculum.json
│           │   └── pacing-guide.json
│           │
│           ├── honors-innovation/
│           │   ├── curriculum.json
│           │   └── pacing-guide.json
│           │
│           ├── sustainable-engineering/
│           │   ├── curriculum.json
│           │   └── pacing-guide.json
│           │
│           └── social-responsibility/
│               ├── curriculum.json
│               └── pacing-guide.json
│
├── src/
│   ├── components/                              # Reusable React components
│   │   ├── Dashboard/
│   │   │   ├── WeekView.jsx                     # Week-at-a-glance display
│   │   │   ├── DayCard.jsx                      # Single day's lessons
│   │   │   └── Dashboard.jsx                    # Main dashboard container
│   │   │
│   │   ├── LessonPlanner/
│   │   │   ├── LessonEditor.jsx                 # Create/edit lesson form
│   │   │   ├── TemplateSelector.jsx             # Choose lesson template
│   │   │   ├── ObjectivesList.jsx               # Manage objectives
│   │   │   ├── AgendaBuilder.jsx                # Timeline builder
│   │   │   ├── StandardsAligner.jsx             # Tag NJ standards
│   │   │   ├── MaterialsLinker.jsx              # Attach resources
│   │   │   └── AssessmentForm.jsx               # Define assessment
│   │   │
│   │   ├── Calendar/
│   │   │   ├── YearlyCalendar.jsx               # Full year view
│   │   │   ├── MonthView.jsx                    # Month grid
│   │   │   └── CalendarDay.jsx                  # Single day cell
│   │   │
│   │   ├── Course/
│   │   │   ├── CourseCard.jsx                   # Course preview card
│   │   │   ├── CoursePage.jsx                   # Full course view
│   │   │   ├── UnitList.jsx                     # Units in course
│   │   │   ├── UnitDetail.jsx                   # Single unit detail
│   │   │   └── LessonPreview.jsx                # Lesson preview
│   │   │
│   │   ├── Progress/
│   │   │   ├── ProgressTracker.jsx              # Mark lesson status
│   │   │   ├── ProgressChart.jsx                # % completion chart
│   │   │   └── LessonHistory.jsx                # Past lessons list
│   │   │
│   │   ├── Export/
│   │   │   ├── ExportToPDF.jsx                  # Generate PDF
│   │   │   └── PreviewModal.jsx                 # PDF preview
│   │   │
│   │   ├── Common/
│   │   │   ├── Header.jsx                       # Top navigation
│   │   │   ├── Sidebar.jsx                      # Side navigation
│   │   │   ├── Layout.jsx                       # Main layout wrapper
│   │   │   ├── LoadingSpinner.jsx               # Loading indicator
│   │   │   ├── ErrorMessage.jsx                 # Error display
│   │   │   ├── Toast.jsx                        # Notification toast
│   │   │   └── ConfirmDialog.jsx                # Confirmation modal
│   │   │
│   │   └── Search/
│   │       ├── SearchBar.jsx                    # Search input
│   │       └── SearchResults.jsx                # Results page
│   │
│   ├── pages/                                   # Page-level components
│   │   ├── DashboardPage.jsx                    # Home/Dashboard page
│   │   ├── LessonPlanPage.jsx                   # Create/edit lesson page
│   │   ├── CoursePlanPage.jsx                   # Manage one course
│   │   ├── YearPlannerPage.jsx                  # Full year calendar
│   │   ├── ProgressPage.jsx                     # View progress
│   │   ├── SearchPage.jsx                       # Search results
│   │   └── NotFoundPage.jsx                     # 404 page
│   │
│   ├── hooks/                                   # Custom React hooks
│   │   ├── useLessonPlans.js                    # CRUD operations on lessons
│   │   ├── useCourses.js                        # Load/manage courses
│   │   ├── useStandards.js                      # Load/manage standards
│   │   ├── useTemplates.js                      # Load lesson templates
│   │   ├── useLocalStorage.js                   # Browser storage wrapper
│   │   ├── useCalendar.js                       # Calendar logic
│   │   ├── useSearch.js                         # Search functionality
│   │   └── useNotification.js                   # Toast/notification logic
│   │
│   ├── utils/                                   # Utility functions
│   │   ├── dateUtils.js                         # Date formatting, calculations
│   │   ├── validation.js                        # Data validation
│   │   ├── pdfExport.js                         # PDF generation logic
│   │   ├── idGenerator.js                       # Unique ID creation
│   │   ├── lessonSearch.js                      # Search algorithm
│   │   ├── standards.js                         # Standard tagging helpers
│   │   └── constants.js                         # App-wide constants
│   │
│   ├── context/                                 # React Context definitions & providers
│   │   ├── CoursesContext.js                    # Context definition
│   │   ├── CoursesProvider.jsx                  # Provider component (paired with Context)
│   │   ├── LessonPlansContext.js                # Context definition
│   │   ├── LessonPlansProvider.jsx              # Provider component (paired with Context)
│   │   ├── StandardsContext.js                  # Context definition
│   │   ├── StandardsProvider.jsx                # Provider component (paired with Context)
│   │   ├── UIContext.js                         # Context definition
│   │   ├── UIProvider.jsx                       # Provider component (paired with Context)
│   │   ├── NotificationContext.js               # Context definition
│   │   └── NotificationProvider.jsx             # Provider component (paired with Context)
│   │
│   ├── styles/                                  # Global styles
│   │   ├── globals.css                          # Global CSS
│   │   └── themes.css                           # Theme definitions
│   │
│   ├── App.jsx                                  # Root component
│   ├── App.css                                  # App styles
│   └── main.jsx                                 # Entry point
│
├── tests/                                       # Test files (optional for MVP)
│   ├── unit/
│   │   ├── dateUtils.test.js
│   │   ├── validation.test.js
│   │   └── lessonSearch.test.js
│   └── components/
│       ├── LessonEditor.test.jsx
│       └── Dashboard.test.jsx
│
├── .gitignore                                   # Git ignore rules
├── vite.config.js                               # Vite configuration
├── tailwind.config.js                           # Tailwind CSS configuration
├── postcss.config.js                            # PostCSS configuration (generated by Tailwind)
├── package.json                                 # Dependencies and scripts
├── package-lock.json                            # Lock file
│
└── Documentation Files
    ├── README.md                                # Project overview (START HERE)
    ├── ROADMAP.md                               # Project timeline & phases
    ├── ARCHITECTURE.md                          # Technical design
    ├── DATA_SCHEMA.md                           # Data structures
    ├── PROJECT_STRUCTURE.md                     # This file
    ├── SETUP.md                                 # Development setup
    └── CONTRIBUTING.md                          # Contribution guidelines (optional)
```

---

## Key Directories Explained

### `/public/data/`

**Purpose**: Static JSON data files loaded at app startup
- Not bundled with code
- Can be updated without rebuilding
- Fetched via `fetch('/data/courses.json')`

**Contents**:
- `courses.json` - Master course definitions
- `nj-standards.json` - All educational standards
- `lesson-plan-templates.json` - Pre-built templates
- `courses/{courseId}/` - Course-specific data

**When to add files**: When adding new courses or creating curriculum structure

---

### `/src/components/`

**Purpose**: Reusable React UI components

**Organization**:
- **By feature**: Each folder = one feature (Dashboard, LessonPlanner, etc.)
- **Shallow hierarchy**: No nesting more than 2 levels
- **Self-contained**: Component + related sub-components together

**Example**:
```
LessonPlanner/
├── LessonEditor.jsx          # Main component
├── TemplateSelector.jsx      # Sub-component
├── StandardsAligner.jsx      # Sub-component
└── (optionally) index.js     # Exports for convenience
```

**When to add components**: Creating new UI sections or breaking up large components

---

### `/src/pages/`

**Purpose**: Page-level components (one per route)

**Naming**: Always end with `Page.jsx`
- `DashboardPage.jsx` → `/dashboard`
- `LessonPlanPage.jsx` → `/lesson/:id`
- `YearPlannerPage.jsx` → `/planner`

**Contents**: Minimal logic, mostly compose components

```jsx
// Example
export default function DashboardPage() {
  const { activeCourse } = useCourses()
  return (
    <Layout>
      <WeekView course={activeCourse} />
      <UpcomingLessons />
    </Layout>
  )
}
```

---

### `/src/hooks/`

**Purpose**: Custom React hooks for business logic

**Naming**: Always start with `use`
- `useLessonPlans.js` - CRUD for lessons
- `useCourses.js` - Load course data
- `useLocalStorage.js` - Wrapper around localStorage

**Pattern**:
```javascript
// Hook returns data and functions
export function useLessonPlans() {
  const [lessonPlans, setLessonPlans] = useState([])

  const addLesson = (lesson) => { /* ... */ }
  const updateLesson = (id, updates) => { /* ... */ }
  const deleteLesson = (id) => { /* ... */ }

  return { lessonPlans, addLesson, updateLesson, deleteLesson }
}
```

**When to create**: When logic is reused in 2+ components

---

### `/src/context/`

**Purpose**: React Context for global state

**Each context has**:
- `XxxContext.js` - Context definition
- `XxxProvider.jsx` - Provider component (wraps app)

**When to create**: When data needs to be accessible across many components

---

### `/src/utils/`

**Purpose**: Pure utility functions (no React)

**Examples**:
- `dateUtils.js` - Format dates, calculate weeks
- `validation.js` - Validate form data
- `pdfExport.js` - Generate PDF documents
- `constants.js` - App-wide constants (colors, status options, etc.)

**Pattern**: Stateless functions, easy to test

```javascript
// Example utility
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US')
}
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase + .jsx | `LessonEditor.jsx` |
| Hook | camelCase + "use" prefix + .js | `useLessonPlans.js` |
| Utility | camelCase + .js | `dateUtils.js` |
| Context | PascalCase + "Context" | `CoursesContext.js` |
| Provider | PascalCase + "Provider" | `CoursesProvider.jsx` |
| Page | PascalCase + "Page" + .jsx | `DashboardPage.jsx` |
| Data file (JSON) | kebab-case | `lesson-plan-templates.json` |
| CSS | kebab-case or match component | `dashboard.css` or `Dashboard.css` |

---

## Component Size Guidelines

| Type | LOC | When to split |
|------|-----|----------------|
| Small component | < 100 | If repeatable, if 3+ children |
| Medium component | 100-300 | Default size |
| Large component | 300-500 | Consider splitting |
| Huge component | > 500 | Definitely split |

---

## Import Path Convention

**Prefer absolute imports** (configure in `vite.config.js`):

```javascript
// ✅ Good (absolute)
import { LessonEditor } from '@components/LessonPlanner/LessonEditor'
import { useLessonPlans } from '@hooks/useLessonPlans'
import { formatDate } from '@utils/dateUtils'

// ❌ Avoid (relative)
import { LessonEditor } from '../../../../components/LessonPlanner/LessonEditor'
```

---

## Data Flow Example

**Creating a new lesson plan:**

```
User clicks "New Lesson"
    ↓
LessonPlanPage.jsx rendered
    ↓
LessonEditor.jsx (main component)
    ├── calls useLessonPlans() hook
    ├── renders TemplateSelector.jsx
    ├── renders ObjectivesList.jsx
    ├── renders StandardsAligner.jsx
    ├── renders AgendaBuilder.jsx
    ├── renders MaterialsLinker.jsx
    └── renders AssessmentForm.jsx
    ↓
User fills form
    ↓
User clicks Save
    ↓
LessonEditor validates (validation.js)
    ↓
LessonEditor calls useLessonPlans().addLesson()
    ↓
Hook saves to localStorage via useLocalStorage()
    ↓
Hook updates context state
    ↓
App re-renders, user sees success toast
    ↓
Redirect to DashboardPage.jsx
```

---

## Phase 1 Priority Files

For MVP, focus on these files first:

**Critical (Must exist)**:
- `App.jsx` - Root app
- `/pages/DashboardPage.jsx` - Home page
- `/pages/LessonPlanPage.jsx` - Editor page
- `/components/Dashboard/Dashboard.jsx` - Week view
- `/components/LessonPlanner/LessonEditor.jsx` - Editor form
- `/hooks/useLessonPlans.js` - Lesson CRUD
- `/context/LessonPlansContext.js` - Global state
- `/utils/validation.js` - Form validation

**Important**:
- `/components/LessonPlanner/TemplateSelector.jsx` - Templates
- `/components/LessonPlanner/StandardsAligner.jsx` - Standards
- `/components/Export/ExportToPDF.jsx` - PDF export
- `/hooks/useCourses.js` - Course loading

**Nice to have (Phase 1.5)**:
- Search functionality
- Full year calendar
- Analytics/progress tracking

---

## Vite Configuration

The `vite.config.js` should configure:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
})
```

This enables `import from '@components/...'` syntax.

---

## Adding New Features

**Step 1**: Create files in correct location
- UI → `/components/`
- Logic → `/hooks/` or `/utils/`
- Page-level → `/pages/`
- Global state → `/context/`

**Step 2**: Follow naming conventions

**Step 3**: Keep component hierarchy shallow (max 2-3 levels)

**Step 4**: Import using absolute paths

**Step 5**: Update this document if structure changes

---

## Notes for AI Models

When implementing features:

1. **Create files in the right folder** - Don't create new folders unless necessary
2. **Use absolute imports** - Configure in vite.config.js
3. **Keep components small** - Max 300 LOC, split if larger
4. **Separate concerns** - UI in components, logic in hooks, utilities as functions
5. **Data flows down** - Props from parent to child, context for global state
6. **Events flow up** - Callbacks from child to parent
7. **Follow naming** - It tells you what the file does
8. **Update this document** - If you add new folders or change structure

---

**Last Updated**: February 8, 2026
**Next Review**: After Phase 1 completion
**Maintainer**: AI Development Team
