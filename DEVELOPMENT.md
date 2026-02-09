# Development Guide: Teacher Lesson Planning Portal

## ⚠️ SPECIFICATION DOCUMENT

This guide describes how to build the app being planned, not how to maintain an already implemented system.

---

## For AI Models & Developers Working on This Project

This guide explains **how** to approach development tasks on this project, including best practices, workflow, and decision-making frameworks.

---

## Before Starting Any Work

### 1. Read These Documents (In Order)

1. **[README.md](./README.md)** - 5 min read, understand the project
2. **[ROADMAP.md](./ROADMAP.md)** - 10 min read, understand what phase you're in
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 15 min read, understand design patterns
4. **This file** - 10 min read, understand development process

### 2. Understand the Current Phase

Check [ROADMAP.md](./ROADMAP.md):
- Are you working on Phase 1 MVP?
- Phase 2 enhancements?
- Something else?

Each phase has different priorities and constraints.

### 3. Know What You're Building

Ask yourself:
- What feature am I implementing?
- Which phase does this belong to?
- Are there dependencies I need to understand first?
- Are there similar features I can learn from?

---

## General Development Process

### For Any New Feature

```
1. Understand the feature
   ↓
2. Check if it aligns with current phase
   ↓
3. Review architecture patterns
   ↓
4. Check data schema requirements
   ↓
5. Plan component structure
   ↓
6. Implement
   ↓
7. Test locally
   ↓
8. Update documentation if needed
```

---

## Code Organization Principles

### 1. Small, Focused Components

**Good**:
```jsx
// LessonEditor.jsx - 250 LOC, one responsibility
export function LessonEditor({ lesson, onSave }) {
  // Edit lesson properties
}

// StandardsAligner.jsx - 100 LOC, pure standards tagging
export function StandardsAligner({ selectedStandards, onChange }) {
  // Tag standards
}
```

**Avoid**:
```jsx
// MonsterComponent.jsx - 800 LOC, does everything
export function MonsterComponent() {
  // Renders editor, standards, materials, export, etc.
  // Too many responsibilities!
}
```

### 2. Separate Concerns

- **UI** → Components in `/src/components/`
- **Business Logic** → Hooks in `/src/hooks/` or utilities in `/src/utils/`
- **Global State** → Context in `/src/context/`
- **Data** → JSON files in `/public/data/`

**Example**:
```javascript
// ✅ Good: Component is just UI
export function LessonEditor({ lesson, onSave }) {
  const { updateLessonPlan } = useLessonPlans() // Logic from hook
  const handleSave = (formData) => {
    validate(formData)  // Using utility function
    updateLessonPlan(lesson.id, formData)
  }
  return <form onSubmit={handleSave}>{/* UI */}</form>
}

// ❌ Avoid: Component does everything
export function LessonEditor({ lesson, onSave }) {
  const [data, setData] = useState({})
  // localStorage manipulation directly in component
  // validation logic inline
  // API calls inline
  // Too many concerns!
}
```

### 3. Data Flow: Down and Up

```
Props flow DOWN (parent → child)
Events flow UP (child → parent)
Global state flows EVERYWHERE
```

**Example**:
```jsx
// ✅ Good: Data props down, callbacks up
<LessonEditor
  lesson={lesson}           // Data down
  standards={standards}     // Data down
  onSave={handleSave}       // Callback up
  onCancel={handleCancel}   // Callback up
/>

// ❌ Avoid: Many derived props or passing raw state
<LessonEditor courseId={courseId} unitId={unitId} />
// Component has to fetch and compute everything
```

---

## When to Create New Files

### Create a New Component When:

- [ ] The UI section is > 150 LOC
- [ ] It's reused in 2+ places
- [ ] It has distinct responsibility
- [ ] It's testable independently

**Naming**: PascalCase, descriptive, ends with `.jsx`
```
LessonEditor.jsx ✅
LessonEditorComponent.jsx ❌
lesson-editor.jsx ❌
```

### Create a New Hook When:

- [ ] Logic is used in 2+ components
- [ ] It encapsulates a feature (CRUD, filtering, etc.)
- [ ] It's testable without React

**Naming**: camelCase, starts with `use`, ends with `.js`
```
useLessonPlans.js ✅
useFilterLessons.js ✅
useLessonPlans.jsx ❌
GetLessonPlans.js ❌
```

### Create a New Utility When:

- [ ] It's a pure function (no React, no side effects)
- [ ] It's reused in multiple places
- [ ] It could have unit tests

**Naming**: camelCase, ends with `.js`
```
dateUtils.js ✅
validateLesson.js ✅
DateUtilities.js ❌
```

### Create a New Context When:

- [ ] Data is needed by 5+ components across different branches
- [ ] It represents global app state (user, theme, etc.)
- [ ] It's not temporary/local state

**Naming**: PascalCase ends with `Context`, pair with `Provider`
```
LessonPlansContext.js + LessonPlansProvider.jsx ✅
CourseContext.js + CourseProvider.jsx ✅
lesson-context.js ❌
```

---

## Data Management Decisions

### When to Use localStorage vs JSON Files

**Use `/public/data/*.json` for**:
- Course definitions
- Standards lists
- Pacing guides
- Template definitions
- Anything that doesn't change per teacher

**Use `localStorage` for**:
- Lesson plans created by the teacher
- UI state (dark mode, sidebar expanded, etc.)
- User preferences

**Use Cloud (Phase 2) for**:
- Lesson plans (backed up, synced across devices)
- User accounts
- Shared resources

---

## Component Pattern Examples

### Simple Functional Component

```jsx
// ✅ Pattern: Simple component, minimal logic
import { Button } from '@/components/ui/button'

export function TemplateSelector({ templates, onSelect }) {
  return (
    <div className="space-y-2">
      <h3>Choose a template:</h3>
      {templates.map(template => (
        <Button
          key={template.id}
          onClick={() => onSelect(template)}
          variant="outline"
        >
          {template.name}
        </Button>
      ))}
    </div>
  )
}
```

### Hook with CRUD Operations

```javascript
// ✅ Pattern: Hook that manages data
import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useLessonPlans() {
  const [lessons, setLessons] = useLocalStorage('lessonPlans', [])

  const addLesson = (lesson) => {
    const newLesson = { ...lesson, id: generateId() }
    setLessons([...lessons, newLesson])
    return newLesson
  }

  const updateLesson = (id, updates) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  const deleteLesson = (id) => {
    setLessons(lessons.filter(l => l.id !== id))
  }

  return { lessons, addLesson, updateLesson, deleteLesson }
}
```

### Page Component

```jsx
// ✅ Pattern: Page composes features, minimal logic
import { LessonEditor } from '@components/LessonPlanner/LessonEditor'
import { useLessonPlans } from '@hooks/useLessonPlans'
import { useParams } from 'react-router-dom'

export default function LessonPlanPage() {
  const { lessonId } = useParams()
  const { lessons, updateLesson } = useLessonPlans()
  const lesson = lessons.find(l => l.id === lessonId)

  if (!lesson) return <div>Lesson not found</div>

  return (
    <div>
      <LessonEditor
        lesson={lesson}
        onSave={(updates) => updateLesson(lessonId, updates)}
      />
    </div>
  )
}
```

---

## Error Handling Pattern

### Always Validate Input

```javascript
// In hook or utility
export function saveLesson(lesson) {
  // Validate
  const errors = validateLesson(lesson)
  if (errors.length > 0) {
    throw new Error(errors.join(', '))
  }

  // Then save
  return addLesson(lesson)
}

// Validation utility
export function validateLesson(lesson) {
  const errors = []
  if (!lesson.title) errors.push("Title is required")
  if (!lesson.courseId) errors.push("Course is required")
  if (lesson.duration < 1) errors.push("Duration must be positive")
  return errors
}
```

### Handle in Component

```jsx
export function LessonEditor({ lesson, onSave }) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSave = async (formData) => {
    try {
      setLoading(true)
      setError(null)
      await onSave(formData)
      // Success toast shown by parent
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave}>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      {/* Form fields */}
    </form>
  )
}
```

---

## Testing Approach

### What to Test (Priority Order)

1. **Utilities** (pure functions) - Easy to test, high impact
2. **Hooks** (business logic) - Test behavior, not React internals
3. **Components** (integration) - Test user interactions
4. **Pages** - Full user flows (end-to-end)

### Example Unit Test

```javascript
// dateUtils.test.js
import { formatDate, getWeekDates } from './dateUtils'

describe('dateUtils', () => {
  test('formatDate returns correct format', () => {
    const result = formatDate('2026-02-10')
    expect(result).toBe('2/10/2026')
  })

  test('getWeekDates returns 5 weekdays', () => {
    const dates = getWeekDates('2026-02-10')
    expect(dates).toHaveLength(5)
  })
})
```

---

## Performance Optimization

### When to Optimize

- [ ] Bundle size > 200KB (gzipped)
- [ ] Component renders > 500ms
- [ ] localStorage queries > 100ms
- [ ] User reports slowness

### Common Optimizations

**1. Memoize expensive components**:
```jsx
const CourseCard = React.memo(({ course }) => {
  return <div>{course.name}</div>
})
```

**2. Memoize callbacks**:
```jsx
const handleSave = useCallback((data) => {
  saveLessonPlan(data)
}, [])
```

**3. Lazy load large components**:
```jsx
const PDFExport = React.lazy(() => import('./PDFExport'))

<Suspense fallback={<LoadingSpinner />}>
  <PDFExport lesson={lesson} />
</Suspense>
```

**4. Filter data efficiently**:
```javascript
// ❌ Avoid: Filters every render
const filtered = lessons.filter(l => l.courseId === courseId)

// ✅ Better: Memoize filtered result
const filtered = useMemo(
  () => lessons.filter(l => l.courseId === courseId),
  [lessons, courseId]
)
```

---

## Deciding Where Code Goes

### Is it a React component?
→ `/src/components/`

### Is it a page-level component?
→ `/src/pages/` (with `Page` suffix)

### Is it a custom Hook (with React)?
→ `/src/hooks/`

### Is it a pure utility function (no React)?
→ `/src/utils/`

### Is it global state?
→ `/src/context/`

### Is it course/curriculum data?
→ `/public/data/`

### Is it configuration?
→ Root level: `vite.config.js`, `tailwind.config.js`, etc.

---

## Git Workflow (If Using Version Control)

### Before Making Changes

```bash
# Get latest code
git pull origin main

# Create feature branch
git checkout -b feature/add-lesson-editor
```

### While Developing

```bash
# See what changed
git status

# Stage changes
git add src/components/LessonEditor.jsx

# Commit with clear message
git commit -m "feat: Add lesson editor component"

# Push branch
git push origin feature/add-lesson-editor
```

### Commit Message Format

```
feat: Add new feature
fix: Fix a bug
docs: Update documentation
style: Code formatting
refactor: Restructure code
test: Add tests
chore: Update dependencies
```

---

## Code Quality Checklist

Before considering work done:

- [ ] Code follows naming conventions (see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md))
- [ ] Components are < 300 LOC
- [ ] No console.log statements (except for debugging, which are removed)
- [ ] Props are validated (required props, types)
- [ ] Error cases are handled
- [ ] No hardcoded data (use JSON files or context)
- [ ] Runs locally without errors (`npm run dev`)
- [ ] Builds without warnings (`npm run build`)
- [ ] Mobile responsive (tested in browser DevTools)
- [ ] Documentation updated if needed

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Tight Coupling

```javascript
// ❌ Bad: Component is tightly coupled to data source
export function LessonEditor() {
  const [lesson, setLesson] = useState(null)
  useEffect(() => {
    fetch(`/api/lessons/${id}`)
      .then(r => r.json())
      .then(setLesson)
  }, [id])
  // ...
}

// ✅ Good: Component receives data as prop
export function LessonEditor({ lesson, onSave }) {
  // ...
}
```

### ❌ Mistake 2: Too Much Logic in Components

```javascript
// ❌ Bad: Component has business logic
export function Dashboard() {
  const [lessons, setLessons] = useState([])
  // Validation, filtering, calculations all here
}

// ✅ Good: Move logic to hook
export function Dashboard() {
  const { lessons } = useLessonPlans()
  // Component just renders
}
```

### ❌ Mistake 3: Props Drilling

```javascript
// ❌ Bad: Pass props through many levels
<Level1 lesson={lesson} />
  <Level2 lesson={lesson} />
    <Level3 lesson={lesson} />
      <Level4 lesson={lesson} /> {/* Finally uses it */}

// ✅ Good: Use context for deeply nested needs
const { lesson } = useLessonPlans()
```

### ❌ Mistake 4: Not Using Absolute Imports

```javascript
// ❌ Bad: Relative imports
import { Button } from '../../../../components/ui/button'

// ✅ Good: Absolute imports
import { Button } from '@components/ui/button'
```

### ❌ Mistake 5: Skipping Documentation

```javascript
// ❌ Bad: No explanation
export function processLessons(lessons, courseId) {
  return lessons
    .filter(l => l.courseId === courseId)
    .map(l => ({ ...l, status: 'active' }))
}

// ✅ Good: Clear intent
/**
 * Get active lessons for a specific course
 * @param {Array} lessons - All lessons
 * @param {string} courseId - Filter by course
 * @returns {Array} Active lessons for that course
 */
export function getLessonsForCourse(lessons, courseId) {
  return lessons
    .filter(l => l.courseId === courseId)
    .map(l => ({ ...l, status: 'active' }))
}
```

---

## Decision Trees

### Should I Create a New Component?

```
Is this a distinct UI section? → YES
  │
  └─→ Will it be reused elsewhere? → YES: Create component
  │
  └─→ Is it > 150 LOC or complex? → YES: Create component
  │
  └─→ Is it testable independently? → YES: Create component
  │
  └─→ NO: Keep it inline or in parent
```

### Should I Extract to a Hook?

```
Is this logic non-UI? → YES
  │
  └─→ Is it used in 2+ components? → YES: Create hook
  │
  └─→ Does it manage state? → YES: Create hook
  │
  └─→ Is it testable? → YES: Create hook
  │
  └─→ NO: Keep it in component or as utility
```

### Should This Go in Context?

```
Do 5+ components need this data? → YES
  │
  └─→ Is it global/shared state? → YES: Use context
  │
  └─→ Does it change frequently? → NO: Use context
  │
  └─→ NO: Use props drilling or local state
```

---

## Tools & Extensions

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - Auto-completions
- **Tailwind CSS IntelliSense** - Tailwind class hints
- **Prettier - Code formatter** - Auto-format code
- **React DevTools** (browser) - Inspect components
- **JavaScript (ES6) code snippets** - JS shortcuts

### Debugging Tools

- **React DevTools** (browser extension) - Inspect React
- **Chrome DevTools** - Network, console, performance
- **Vite DevTools** - Vite-specific debugging

---

## When to Ask for Help

If you're stuck:

1. **Check existing code** - Is there a similar feature I can learn from?
2. **Review documentation** - Does [ARCHITECTURE.md](./ARCHITECTURE.md) explain this?
3. **Search error message** - Google it, check React docs
4. **Try rubber duck debugging** - Explain the problem out loud
5. **Minimal reproducible example** - Create the smallest case that fails

Then ask with:
- What you're trying to do
- What error you're seeing (full error message)
- What you've already tried
- A link to relevant docs if applicable

---

## Performance Targets

- **Initial bundle size**: < 200KB (gzipped)
- **First paint**: < 2 seconds
- **Interactive time**: < 3 seconds
- **Component render**: < 100ms
- **localStorage operations**: < 10ms

If slower, profile and optimize.

---

## Documentation Updates

When you:
- Add a new component type → Update [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- Change architecture → Update [ARCHITECTURE.md](./ARCHITECTURE.md)
- Add new data structure → Update [DATA_SCHEMA.md](./DATA_SCHEMA.md)
- Change the roadmap → Update [ROADMAP.md](./ROADMAP.md)

---

## Summary

### Key Principles

1. **Small, focused components** - One responsibility each
2. **Separate concerns** - UI, logic, data in different places
3. **Data flows down, events flow up** - Unidirectional
4. **Use patterns** - Follow established conventions
5. **Keep it simple** - Don't over-engineer
6. **Document code** - Comments for non-obvious logic
7. **Test important stuff** - Utilities, hooks, critical paths
8. **Optimize when needed** - Not prematurely

### Development Steps

1. Understand what you're building (read docs)
2. Plan component structure
3. Implement following patterns
4. Test locally
5. Update docs
6. Get code review/approval

---

**Last Updated**: February 8, 2026
**For Questions**: See [README.md](./README.md)
**Next**: Start with [SETUP.md](./SETUP.md) to get started!
