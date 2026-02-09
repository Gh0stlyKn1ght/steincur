# Data Schema: Teacher Lesson Planning Portal

## ⚠️ SPECIFICATION DOCUMENT

This defines the data structures for the app being built. Not all structures exist yet.

---

## Overview

This document defines all data structures used in the Teacher Lesson Planning Portal. It includes three tiers of data storage:

1. **Static Seed Data** (JSON in `/public/data/`) - Bundled with app, read-only
2. **Teacher-Created Lesson Plans** (localStorage in Phase 1) - Ephemeral browser storage
3. **Cloud Database** (Phase 2) - Persistent, synced across devices

---

## Three-Tier Data Storage Strategy

### Tier 1: Static Seed Data (`/public/data/`)

**What**: Curriculum framework, standards, templates, pacing guides
**Where**: JSON files in `/public/data/` directory (in Git repo)
**Who**: Developer creates these, teacher doesn't modify
**Scope**: Courses, units, topics, NJ standards, lesson templates, pacing guides
**Persistence**: Shipped with app, changes require redeploy

**Files**:
- `courses.json` - 6 course definitions
- `nj-standards.json` - All NJ standards by subject
- `lesson-plan-templates.json` - 5 reusable templates
- `courses/{courseId}/curriculum.json` - Units per course
- `courses/{courseId}/pacing-guide.json` - Suggested timeline per course

### Tier 2: Teacher-Created Lesson Plans (localStorage - Phase 1)

**What**: Lesson plans created/edited by teacher
**Where**: Browser `localStorage` key: `'lessonPlans'` (array of plans)
**Who**: Teacher creates these in the app UI
**Scope**: All lesson plans for all courses
**Persistence**: Single device only, cleared if browser data is deleted
**Sync**: No sync across devices (Phase 2 adds cloud sync)

**Single localStorage Key**:
```javascript
localStorage.getItem('lessonPlans') // Returns JSON array of LessonPlan objects
```

### Tier 3: Cloud Database (Phase 2)

**What**: Teacher-created lesson plans with backups and sync
**Where**: Cloud database (Firebase/Supabase)
**Who**: Teacher creates in app, synced to cloud
**Scope**: All lesson plans for all courses
**Persistence**: Permanent, backed up, synced across devices
**Sync**: Real-time or on-save, configurable

**Not yet implemented** - Phase 2 scope

---

## Tier 1: Static Seed Data Directory Structure

These files are bundled with the app and provide curriculum framework:

```
/public/data/
├── courses.json                      # Master list of 6 courses
├── nj-standards.json                 # All NJ standards by subject
├── lesson-plan-templates.json        # Reusable lesson templates (5 templates)
└── courses/
    ├── tech-engineering/
    │   ├── curriculum.json           # Units and topics
    │   └── pacing-guide.json          # Suggested timeline
    ├── intro-electronics/
    │   ├── curriculum.json
    │   └── pacing-guide.json
    ├── electronics-robotics-2/
    │   ├── curriculum.json
    │   └── pacing-guide.json
    ├── honors-innovation/
    │   ├── curriculum.json
    │   └── pacing-guide.json
    ├── sustainable-engineering/
    │   ├── curriculum.json
    │   └── pacing-guide.json
    └── social-responsibility/
        ├── curriculum.json
        └── pacing-guide.json
```

**Note**: Lesson plans created by teachers are NOT stored in `/public/data/`. They are stored in browser localStorage (Phase 1) or cloud database (Phase 2).

---

## Global Data Files

### 1. courses.json

**Location**: `/public/data/courses.json`

**Purpose**: Master list of all 6 courses taught by this teacher

**Schema**:
```json
{
  "courses": [
    {
      "id": "tech-engineering",
      "name": "Technology, Engineering, and Social Responsibility",
      "code": "TECH-101",
      "grade": "9-12",
      "description": "Integrated study of technology and engineering with focus on societal impact",
      "color": "#3B82F6",
      "credits": 1.0,
      "units": 4,
      "estimatedLessons": 18,
      "path": "/courses/tech-engineering"
    },
    {
      "id": "intro-electronics",
      "name": "Introduction to Electronics and Robotics",
      "code": "ELEC-101",
      "grade": "9-10",
      "description": "Hands-on introduction to basic electronics, circuits, and robotics",
      "color": "#8B5CF6",
      "credits": 1.0,
      "units": 6,
      "estimatedLessons": 24,
      "path": "/courses/intro-electronics"
    },
    {
      "id": "electronics-robotics-2",
      "name": "Electronics and Robotics 2",
      "code": "ELEC-102",
      "grade": "10-12",
      "description": "Advanced electronics, programming, and robotics systems",
      "color": "#EC4899",
      "credits": 1.0,
      "units": 5,
      "estimatedLessons": 22,
      "path": "/courses/electronics-robotics-2"
    },
    {
      "id": "honors-innovation",
      "name": "Honors Innovation and Design",
      "code": "IND-201",
      "grade": "10-12",
      "description": "Advanced design thinking and innovation methodologies",
      "color": "#F59E0B",
      "credits": 1.0,
      "units": 4,
      "estimatedLessons": 16,
      "path": "/courses/honors-innovation"
    },
    {
      "id": "sustainable-engineering",
      "name": "Sustainable Engineering and Design",
      "code": "SUST-101",
      "grade": "11-12",
      "description": "Engineering solutions for sustainable development",
      "color": "#10B981",
      "credits": 1.0,
      "units": 5,
      "estimatedLessons": 20,
      "path": "/courses/sustainable-engineering"
    },
    {
      "id": "social-responsibility",
      "name": "Exploring Careers and Issues in Social Responsibility",
      "code": "SOCD-101",
      "grade": "9-12",
      "description": "Explore career paths in engineering and social responsibility fields",
      "color": "#06B6D4",
      "credits": 0.5,
      "units": 3,
      "estimatedLessons": 12,
      "path": "/courses/social-responsibility"
    }
  ]
}
```

**Field Definitions**:
- `id` (string): Unique identifier, used in URLs and data references
- `name` (string): Full course name as it appears on transcripts
- `code` (string): Course code for identification
- `grade` (string): Grade level(s), e.g., "9-12", "10-11"
- `description` (string): Brief course description
- `color` (string): Hex color code for UI display
- `credits` (number): Credit hours for the course
- `units` (number): Expected number of units in this course
- `estimatedLessons` (number): Rough estimate of total lessons
- `path` (string): Relative path to course folder in /data/courses/

---

### 2. nj-standards.json

**Location**: `/public/data/nj-standards.json`

**Purpose**: Complete list of NJ educational standards organized by subject and course

**Schema**:
```json
{
  "standards": [
    {
      "code": "NJ.9.4.A.1",
      "description": "Understand and apply the engineering design process to solve real-world problems",
      "subject": "Technology & Engineering",
      "grade": "9-12",
      "courses": ["tech-engineering", "intro-electronics", "electronics-robotics-2", "honors-innovation", "sustainable-engineering"],
      "category": "Design & Engineering",
      "depth": "Apply"
    },
    {
      "code": "NJ.9.4.A.2",
      "description": "Analyze and evaluate design solutions using specified criteria",
      "subject": "Technology & Engineering",
      "grade": "9-12",
      "courses": ["tech-engineering", "honors-innovation"],
      "category": "Design & Engineering",
      "depth": "Analyze"
    },
    {
      "code": "NJ.8.2.A",
      "description": "Understand and apply the technological design process",
      "subject": "Technology & Engineering",
      "grade": "8-9",
      "courses": ["tech-engineering", "social-responsibility"],
      "category": "Engineering Practices",
      "depth": "Understand"
    }
    // ... more standards
  ]
}
```

**Field Definitions**:
- `code` (string): Standard code (e.g., "NJ.9.4.A.1")
- `description` (string): What students should know/do
- `subject` (string): Subject area
- `grade` (string): Applicable grade levels
- `courses` (string[]): Which courses cover this standard
- `category` (string): Grouping of standards
- `depth` (string): Bloom's level (Remember, Understand, Apply, Analyze, Evaluate, Create)

---

### 3. lesson-plan-templates.json

**Location**: `/public/data/lesson-plan-templates.json`

**Purpose**: Pre-built lesson plan templates to speed up lesson creation

**Schema**:
```json
{
  "templates": [
    {
      "id": "template-lecture",
      "name": "Mini-Lecture",
      "description": "Traditional lecture-based lesson with intro, content, and closing",
      "defaultDuration": 45,
      "category": "Instructional",
      "agenda": [
        {
          "time": "0-5",
          "activity": "Hook/Engagement - Capture attention and state objectives",
          "duration": 5
        },
        {
          "time": "5-30",
          "activity": "Instruction - Present content using visuals and examples",
          "duration": 25
        },
        {
          "time": "30-40",
          "activity": "Practice - Guided practice or questions",
          "duration": 10
        },
        {
          "time": "40-45",
          "activity": "Closure - Summarize and preview next lesson",
          "duration": 5
        }
      ],
      "placeholderObjectives": [
        "Students will understand [key concept]",
        "Students will be able to [specific skill]"
      ],
      "assessmentType": "Exit ticket or quiz"
    },
    {
      "id": "template-lab",
      "name": "Lab Activity",
      "description": "Hands-on lab or experiment with structured exploration",
      "defaultDuration": 60,
      "category": "Hands-On",
      "agenda": [
        {
          "time": "0-5",
          "activity": "Objectives & Safety - Review goals and safety procedures",
          "duration": 5
        },
        {
          "time": "5-15",
          "activity": "Demonstration - Teacher models the activity",
          "duration": 10
        },
        {
          "time": "15-45",
          "activity": "Student Lab Work - Teams conduct experiment/exploration",
          "duration": 30
        },
        {
          "time": "45-60",
          "activity": "Analysis & Discussion - Debrief results and conclusions",
          "duration": 15
        }
      ],
      "placeholderObjectives": [
        "Students will design and conduct [experiment]",
        "Students will analyze results and draw conclusions"
      ],
      "assessmentType": "Lab report or observation checklist"
    },
    {
      "id": "template-project",
      "name": "Project-Based Learning",
      "description": "Multi-day/week project with incremental milestones",
      "defaultDuration": 45,
      "category": "Project-Based",
      "agenda": [
        {
          "time": "0-5",
          "activity": "Project Overview - Introduce challenge and success criteria",
          "duration": 5
        },
        {
          "time": "5-10",
          "activity": "Planning - Teams plan approach and assign roles",
          "duration": 5
        },
        {
          "time": "10-35",
          "activity": "Work Time - Teams work on deliverables with teacher support",
          "duration": 25
        },
        {
          "time": "35-45",
          "activity": "Progress Check - Teams share progress and get feedback",
          "duration": 10
        }
      ],
      "placeholderObjectives": [
        "Students will design a solution to [problem]",
        "Students will present and justify their design"
      ],
      "assessmentType": "Project rubric and presentation"
    },
    {
      "id": "template-discussion",
      "name": "Discussion-Based",
      "description": "Socratic seminar or structured discussion",
      "defaultDuration": 45,
      "category": "Discussion",
      "agenda": [
        {
          "time": "0-3",
          "activity": "Hook - Pose thought-provoking question",
          "duration": 3
        },
        {
          "time": "3-35",
          "activity": "Facilitated Discussion - Guide student discussion with follow-up questions",
          "duration": 32
        },
        {
          "time": "35-45",
          "activity": "Reflection - Have students write or share key takeaways",
          "duration": 10
        }
      ],
      "placeholderObjectives": [
        "Students will discuss [topic] from multiple perspectives",
        "Students will support arguments with evidence"
      ],
      "assessmentType": "Participation rubric or reflection paper"
    }
  ]
}
```

---

## Course-Specific Data Files

### 4. curriculum.json (per course)

**Location**: `/public/data/courses/{courseId}/curriculum.json`

**Purpose**: Define the units and topics for a specific course

**Schema**:
```json
{
  "courseId": "tech-engineering",
  "courseName": "Technology, Engineering, and Social Responsibility",
  "year": 2026,
  "units": [
    {
      "id": "unit-1",
      "sequence": 1,
      "name": "Unit 1: Design Thinking",
      "description": "Introduction to design thinking and the engineering design process",
      "duration": 5,
      "estimatedLessons": 5,
      "topics": [
        "Design thinking principles",
        "Identifying problems",
        "Brainstorming techniques",
        "Prototyping basics",
        "Testing and iteration"
      ],
      "standards": ["NJ.9.4.A.1", "NJ.8.2.A"],
      "resources": [
        {
          "title": "Design Thinking Guide",
          "type": "pdf",
          "path": "/courses/tech-engineering/resources/design-guide.pdf"
        },
        {
          "title": "IDEO Design Process Video",
          "type": "link",
          "url": "https://www.ideo.com/process"
        }
      ]
    },
    {
      "id": "unit-2",
      "sequence": 2,
      "name": "Unit 2: Prototyping and Building",
      "description": "Create and test physical prototypes",
      "duration": 6,
      "estimatedLessons": 6,
      "topics": [
        "Materials selection",
        "Building techniques",
        "Testing methods",
        "Iteration based on feedback",
        "Documentation"
      ],
      "standards": ["NJ.9.4.A.2"],
      "resources": []
    }
    // ... more units
  ]
}
```

**Field Definitions**:
- `courseId` (string): Reference to course
- `courseName` (string): Full course name
- `year` (number): School year
- `units` (array): Array of unit objects
  - `id` (string): Unique within course
  - `sequence` (number): Order in course
  - `name` (string): Unit title
  - `description` (string): What the unit covers
  - `duration` (number): Estimated weeks
  - `estimatedLessons` (number): Total lessons in unit
  - `topics` (string[]): Key topics covered
  - `standards` (string[]): Standards codes covered
  - `resources` (array): Curriculum materials for this unit

---

### 5. pacing-guide.json (per course)

**Location**: `/public/data/courses/{courseId}/pacing-guide.json`

**Purpose**: Suggested timeline for teaching the course

**Schema**:
```json
{
  "courseId": "tech-engineering",
  "year": 2026,
  "schoolCalendar": {
    "year": 2026,
    "startDate": "2026-01-05",
    "endDate": "2026-06-10",
    "markingPeriods": [
      {
        "period": 3,
        "startDate": "2026-02-02",
        "endDate": "2026-04-10",
        "weekCount": 9,
        "instructionalDays": 42
      },
      {
        "period": 4,
        "startDate": "2026-04-13",
        "endDate": "2026-06-10",
        "weekCount": 9,
        "instructionalDays": 42
      }
    ]
  },
  "pacing": [
    {
      "markingPeriod": 3,
      "unitId": "unit-1",
      "unitName": "Unit 1: Design Thinking",
      "recommendedStartWeek": 1,
      "recommendedDuration": 2,
      "lessonCount": 5,
      "estimatedDaysNeeded": 7,
      "notes": "Build momentum early with engaging design thinking activities"
    },
    {
      "markingPeriod": 3,
      "unitId": "unit-2",
      "unitName": "Unit 2: Prototyping and Building",
      "recommendedStartWeek": 3,
      "recommendedDuration": 2,
      "lessonCount": 6,
      "estimatedDaysNeeded": 8,
      "notes": "May run into spring break - plan accordingly"
    }
    // ... more units
  ]
}
```

---

## Tier 2: Lesson Plans (Created by Teacher)

### 6. LessonPlan Object Schema

**Storage Location**:
- **Phase 1**: Browser `localStorage` with key `'lessonPlans'` (array of lesson plans)
- **Phase 2**: Cloud database (Firebase/Supabase)

**NOT stored in `/public/data/`** - These are created dynamically by the teacher at runtime.

**Purpose**: Schema definition for how lesson plans are structured when stored

**Schema**:
```json
{
  "id": "tech-101-u1-l1",
  "courseId": "tech-engineering",
  "courseName": "Technology, Engineering, and Social Responsibility",
  "unitId": "unit-1",
  "unitName": "Unit 1: Design Thinking",
  "sequence": 1,
  "title": "Introduction to Design Process",
  "date": "2026-02-10",
  "duration": 45,
  "status": "planned",
  "objectives": [
    "Define design thinking and the engineering design process",
    "Identify real-world problems that can be solved through design",
    "Apply the first step of the design process to a sample problem"
  ],
  "standards": [
    {
      "code": "NJ.9.4.A.1",
      "description": "Understand and apply the engineering design process"
    },
    {
      "code": "NJ.8.2.A",
      "description": "Understand and apply the technological design process"
    }
  ],
  "agenda": [
    {
      "timeStart": "0",
      "timeEnd": "5",
      "duration": 5,
      "activity": "Hook/Intro",
      "description": "Show real design failures and successes. Ask: 'How do you think designers fixed these?'"
    },
    {
      "timeStart": "5",
      "timeEnd": "15",
      "duration": 10,
      "activity": "Mini-Lecture",
      "description": "Present the 5 steps: Define, Ideate, Prototype, Test, Iterate. Use slides and examples."
    },
    {
      "timeStart": "15",
      "timeEnd": "35",
      "duration": 20,
      "activity": "Guided Activity",
      "description": "In pairs, students identify a problem in the school and brainstorm solutions using design thinking"
    },
    {
      "timeStart": "35",
      "timeEnd": "45",
      "duration": 10,
      "activity": "Debrief & Exit Ticket",
      "description": "Pairs share problems identified. Students write: 'How does this design process help solve problems?'"
    }
  ],
  "materials": [
    {
      "id": "mat-1",
      "type": "pdf",
      "title": "Design Thinking Guide",
      "path": "/courses/tech-engineering/resources/design-guide.pdf",
      "description": "Reference document for students"
    },
    {
      "id": "mat-2",
      "type": "slide-deck",
      "title": "Design Process Presentation",
      "path": "https://docs.google.com/presentation/d/...",
      "description": "Main presentation slides"
    },
    {
      "id": "mat-3",
      "type": "link",
      "title": "IDEO Design Process Video",
      "path": "https://www.ideo.com/process",
      "description": "3-minute introductory video"
    }
  ],
  "assessment": {
    "type": "Formative",
    "method": "Exit ticket - students write the 5 steps and identify one problem at school",
    "rubric": "Correct sequence of steps (3 pts), problem identification (2 pts)"
  },
  "homework": {
    "assigned": true,
    "description": "Find 3 examples of design in your home (product, building, system). For each, write how it solves a problem."
  },
  "differentiation": {
    "forAdvanced": "Ask students to research how their chosen design might be improved further",
    "forStruggling": "Pair with strong reader/writer. Provide sentence frames for the exit ticket",
    "forELL": "Pre-teach key vocabulary. Pair with English-strong students. Allow drawings in exit ticket"
  },
  "notes": "This class has 3 ELL students - seat them strategically. Two students have 504 plans for extended time.",
  "createdAt": "2026-02-08T14:32:00Z",
  "lastModified": "2026-02-08T14:32:00Z",
  "tags": ["design-thinking", "intro", "ell-friendly"]
}
```

**Field Definitions**:
- `id` (string): Unique identifier
- `courseId` / `courseName` (string): Which course
- `unitId` / `unitName` (string): Which unit
- `sequence` (number): Lesson number in unit
- `title` (string): Lesson title
- `date` (string): ISO date when lesson will be taught
- `duration` (number): Minutes
- `status` (string): "planned" | "in-progress" | "taught" | "assessed"
- `objectives` (string[]): Learning objectives
- `standards` (array): Standards covered (code + description)
- `agenda` (array): Minute-by-minute breakdown
- `materials` (array): Resources for this lesson
- `assessment` (object): How you'll assess learning
- `homework` (object): Homework assignment
- `differentiation` (object): Modifications for different learners
- `notes` (string): Teacher notes/reminders
- `createdAt` / `lastModified` (string): ISO timestamps
- `tags` (string[]): searchable tags

---

## Data Types

### Material Object
```json
{
  "id": "mat-1",
  "type": "pdf" | "doc" | "slide-deck" | "link" | "video" | "other",
  "title": "Human-readable title",
  "path": "Relative path or full URL",
  "description": "What this material is for"
}
```

### Standard Object
```json
{
  "code": "NJ.9.4.A.1",
  "description": "Full standard description"
}
```

### Agenda Item
```json
{
  "timeStart": "0",
  "timeEnd": "5",
  "duration": 5,
  "activity": "Activity name",
  "description": "What happens during this time"
}
```

---

## Tier 1.5: Browser localStorage (Phase 1 Only)

**Phase 1 Data Persistence**: Teacher-created lesson plans are stored in browser localStorage.

### localStorage Keys

```javascript
// Single key for all lesson plans
localStorage.setItem('lessonPlans', JSON.stringify([
  { id: "tech-101-u1-l1", courseId: "tech-engineering", ... },
  { id: "tech-101-u1-l2", courseId: "tech-engineering", ... },
  // ... more lesson plans
]))

// App UI state
localStorage.setItem('appState', JSON.stringify({
  activeCourse: 'tech-engineering',
  darkMode: true,
  lastSaved: '2026-02-08T14:32:00Z'
}))
```

**Key Pattern**:
- `'lessonPlans'` → Array of ALL lesson plans (not individual keys per lesson)
- `'appState'` → UI and app state

**Phase 2**: localStorage becomes a cache; cloud database becomes source of truth.

---

## Data Validation Rules

### Lesson Plan Validation

```javascript
const lessonPlanSchema = {
  title: { required: true, minLength: 3, maxLength: 100 },
  date: { required: true, type: 'ISO date' },
  duration: { required: true, type: 'number', min: 1, max: 480 },
  courseId: { required: true, mustExist: true },
  unitId: { required: true, mustExist: true },
  objectives: { required: true, type: 'array', minLength: 1 },
  agenda: { required: true, type: 'array', minLength: 1 },
  standards: { required: false, type: 'array' },
  status: { required: true, enum: ['planned', 'in-progress', 'taught', 'assessed'] }
}
```

---

## Example: Creating a New Lesson Plan (Phase 1)

```javascript
// 1. User selects template
const template = templates.find(t => t.id === 'template-lecture')

// 2. Create lesson object
const newLesson = {
  id: generateId(), // e.g., "tech-101-u1-l5"
  courseId: 'tech-engineering',
  unitId: 'unit-1',
  sequence: 5,
  date: new Date().toISOString(),
  duration: template.defaultDuration,
  title: 'Lesson Title',
  status: 'planned',
  objectives: template.placeholderObjectives,
  agenda: template.agenda,
  materials: [],
  assessment: {},
  homework: {},
  standards: [],
  notes: '',
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString()
}

// 3. Save to localStorage (Phase 1)
const lessonPlans = JSON.parse(localStorage.getItem('lessonPlans') || '[]')
lessonPlans.push(newLesson)
localStorage.setItem('lessonPlans', JSON.stringify(lessonPlans))

// 4. Phase 2: Sync to cloud database
// await syncToCloud(newLesson)
```

---

## Notes for AI Models

When working with data:

1. **Always validate** before saving
2. **Use consistent IDs** - format: `{courseId}-{unitId}-{lessonNumber}`
3. **Use ISO dates** - format: `YYYY-MM-DDTHH:mm:00Z`
4. **Keep data clean** - no null values, use empty strings or empty arrays instead
5. **Document changes** - update `lastModified` timestamp
6. **Reference existing data** - use IDs, not copies of objects
7. **Phase 2 migration** - These schemas are ready for cloud database migration

---

**Last Updated**: February 8, 2026
**Next Review**: After Phase 1 completion
**Maintainer**: AI Development Team
