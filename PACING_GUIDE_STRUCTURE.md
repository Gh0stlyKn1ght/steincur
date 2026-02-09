# Pacing Guide Structure

**Date Created**: February 8, 2026
**Status**: Ready for React Implementation

---

## Overview

This document describes the pacing guide and lesson plan data structure for the Teacher Lesson Planning Portal. The structure enables teachers to:

1. **View weekly lesson plans** - See what should be taught each week
2. **Access lesson details** - Full lesson plan with objectives, agenda, materials, assessment
3. **Download/Print lessons** - Export to PDF for classroom use
4. **Manage multiple courses** - All 6 courses organized consistently

---

## File Structure

```
public/data/
├── courses.json                          # Master course list
├── nj-standards.json                     # NJ standards (TBD)
├── lesson-templates.json                 # Lesson plan template definitions
├── lessons-index.json                    # Master index of all lessons (NEW)
│
└── courses/
    ├── tech-engineering/
    │   ├── curriculum.json               # Units & topics (TBD)
    │   ├── pacing-guide.json             # Marking periods & units (DONE)
    │   └── lessons-mp3-week1.json        # Week 1 lessons (DONE - example)
    │
    ├── intro-electronics/
    │   ├── curriculum.json
    │   ├── pacing-guide.json             # (DONE)
    │   └── lessons-mp3-week1.json        # (DONE - example)
    │
    ├── electronics-robotics-2/
    │   ├── curriculum.json
    │   ├── pacing-guide.json             # (DONE)
    │   └── lessons-mp3-week1.json        # (DONE - example)
    │
    ├── honors-innovation/
    │   ├── curriculum.json
    │   ├── pacing-guide.json             # (DONE)
    │   └── lessons-mp3-week1.json        # (DONE - example)
    │
    ├── sustainable-engineering/
    │   ├── curriculum.json
    │   ├── pacing-guide.json             # (DONE)
    │   └── lessons-mp3-week1.json        # (DONE - example)
    │
    └── social-responsibility/
        ├── curriculum.json
        ├── pacing-guide.json             # (DONE)
        └── lessons-mp3-week1.json        # (DONE - example)
```

---

## Data Structure Explanation

### 1. Pacing Guide Files (`pacing-guide.json`)

**Purpose**: Defines the unit structure and timeline for a course

**Location**: `/public/data/courses/{courseId}/pacing-guide.json`

**Structure**:
```json
{
  "courseId": "tech-engineering",
  "courseName": "Technology, Engineering, and Social Responsibility",
  "markingPeriod3": {
    "startDate": "2026-02-01",
    "endDate": "2026-04-09",
    "weeks": 9,
    "units": [
      {
        "unitId": "tech-eng-u1",
        "unitName": "Engineering Design Process & Sustainable Development",
        "weeks": 3,
        "lessonsPerWeek": 3,
        "topics": [...]
      }
    ]
  }
}
```

**Key Fields**:
- `courseId`: Unique identifier (matches folder name)
- `courseName`: Full course name
- `markingPeriod3/4`: Separate objects for each marking period
- `units`: Array of units with weeks and lessons per week
- `weeks`: Total weeks per unit (used to calculate total course timeline)
- `lessonsPerWeek`: Always 3 for your structure
- `topics`: List of major topics covered in unit

**Files Created**: 6 files (one per course)

---

### 2. Lesson Plan Files (`lessons-mp3-week1.json`)

**Purpose**: Contains detailed lesson plans for a specific week of a course

**Location**: `/public/data/courses/{courseId}/lessons-mp{period}-week{number}.json`

**Structure** (simplified - see example files for full detail):
```json
{
  "courseId": "tech-engineering",
  "courseName": "...",
  "markingPeriod": 3,
  "week": 1,
  "weekStart": "2026-02-01",
  "weekEnd": "2026-02-05",
  "unitId": "tech-eng-u1",
  "unitName": "...",
  "lessons": [
    {
      "lessonId": "tech-eng-mp3-w1-l1",
      "lessonNumber": 1,
      "date": "2026-02-02",
      "dayOfWeek": "Monday",
      "title": "Introduction to Engineering Design Process",
      "duration": 60,
      "objectives": [...],
      "njStandards": [...],
      "agenda": [...],
      "materials": [...],
      "assessment": {...},
      "differentiation": {...},
      "homework": "..."
    }
  ]
}
```

**Key Fields per Lesson**:
- `lessonId`: Unique identifier (format: `{courseId}-mp{period}-w{week}-l{lesson}`)
- `lessonNumber`: 1, 2, or 3 (three lessons per week)
- `date`: Specific date for this lesson
- `dayOfWeek`: Monday, Tuesday, Thursday, etc.
- `title`: Lesson title
- `duration`: 60 minutes
- `objectives`: Learning objectives
- `njStandards`: Aligned NJ standards
- `agenda`: Time-broken activity list
- `materials`: Resources needed with types and locations
- `assessment`: Formative assessment method
- `differentiation`: Adaptations for advanced/struggling students
- `homework`: Optional homework assignment

**Files Created**: 6 files (one per course, week 1 as example)

---

### 3. Lessons Index (`lessons-index.json`)

**Purpose**: Master index of all lesson files for quick lookup

**Location**: `/public/data/lessons-index.json`

**Structure**:
```json
{
  "lessonsIndex": [
    {
      "courseId": "tech-engineering",
      "courseName": "...",
      "markingPeriod": 3,
      "week": 1,
      "weekStart": "2026-02-01",
      "weekEnd": "2026-02-05",
      "lessonsFile": "/data/courses/tech-engineering/lessons-mp3-week1.json",
      "lessonCount": 3,
      "unitId": "tech-eng-u1",
      "unitName": "..."
    }
    // ... more entries
  ],
  "instructionalCalendar": {
    "markingPeriod3": {...},
    "markingPeriod4": {...}
  }
}
```

**Purpose**: Allows React to quickly find lesson files without scanning directories

---

## Calendars and Timelines

### Marking Period 3 (MP3)
- **Dates**: February 1 - April 9, 2026
- **Instructional Weeks**: 9 weeks
- **Days per week**: 5 calendar days (Mon-Fri), but rotates based on block schedule
- **Days per course per week**: 3 lessons (may be split across 2-3 calendar days depending on schedule)

### Marking Period 4 (MP4)
- **Dates**: April 10 - June 18, 2026
- **Instructional Weeks**: 10 weeks
- **Same schedule as MP3**

### Weekly Structure
Each course has **3 lessons per week** across different days (following your rotating block schedule):
- Lesson 1: Monday (or Day 1 of rotation)
- Lesson 2: Tuesday/Wednesday (or Day 2 of rotation)
- Lesson 3: Thursday/Friday (or Day 3+ of rotation)

The specific days in the lesson files (Monday, Tuesday, Thursday) are placeholders that should align with your actual rotating block schedule.

---

## What's Included

### ✅ Completed

1. **Pacing Guides** (6 files)
   - All 6 courses have unit structures defined
   - MP3 and MP4 with units and weeks calculated
   - 3 lessons per week structure embedded

2. **Sample Lesson Plans** (6 files - Week 1 as example)
   - Full lesson details for all 6 courses
   - Week of February 1-5, 2026
   - Complete with objectives, agenda, materials, assessment, differentiation
   - Ready to customize with your actual curriculum content

3. **Lesson Templates** (1 file)
   - Template schema showing lesson structure
   - 5 lesson format templates (Lecture, Lab, Project, Discussion, Hybrid)
   - Guidance for consistent lesson planning

4. **Lessons Index** (1 file)
   - Master index for quick lesson lookup
   - Calendar information

### ⏳ To Be Created Later

1. **Remaining Lesson Files** (need to create for weeks 2-9 of MP3, weeks 1-10 of MP4)
   - Pattern: `lessons-mp3-week2.json`, `lessons-mp3-week3.json`, etc.
   - Can use Week 1 as template and customize

2. **Curriculum Files** (`curriculum.json` per course)
   - Unit details with learning standards
   - Topics per unit
   - Key concepts and content

3. **NJ Standards File** (`nj-standards.json`)
   - Complete NJ standards taxonomy
   - Used for standards alignment in lessons

---

## How This Works in React

### Weekly Dashboard Flow

1. **User opens app** → React loads `/data/lessons-index.json`

2. **User selects "Week of Feb 1-5"** → React queries index for that week

3. **Index returns** → 6 entries (one per course) with file paths

4. **React fetches lesson files** →
   ```javascript
   fetch('/data/courses/tech-engineering/lessons-mp3-week1.json')
   fetch('/data/courses/intro-electronics/lessons-mp3-week1.json')
   // ... etc for all 6 courses
   ```

5. **Render weekly view** → Shows:
   - Week of Feb 1-5
   - For each course:
     - 3 lessons shown
     - Click to expand lesson details
     - Print/Download PDF option

6. **Print/Export** →
   - Uses lesson data to generate PDF
   - Includes all objectives, agenda, materials, homework
   - Ready to print or save

### File Lookup Logic

```javascript
// Pseudo-code for finding lessons
function getLessonsForWeek(courseId, markingPeriod, week) {
  const filename = `/data/courses/${courseId}/lessons-mp${markingPeriod}-week${week}.json`
  return fetch(filename).then(r => r.json())
}

// Or use the index
function getLessonsForWeekViaIndex(markingPeriod, week) {
  return lessonsIndex.filter(
    entry => entry.markingPeriod === markingPeriod && entry.week === week
  )
  // Returns array of 6 lessons (one per course)
}
```

---

## Customization Guide

### To Add Weeks 2-9 for MP3

1. **Create file**: `/public/data/courses/{courseId}/lessons-mp3-week2.json`

2. **Copy structure** from week1 file

3. **Change**:
   - `week: 2`
   - `weekStart: "2026-02-09"`
   - `weekEnd: "2026-02-13"`
   - `lessonId`: Change week number (w2 instead of w1)
   - `date`: Adjust dates
   - `dayOfWeek`: Keep pattern
   - Lesson titles and content for unit topic

4. **Update** `lessons-index.json` to add entries for week 2

### To Add MP4 Lessons

1. Same process as above, but:
   - `markingPeriod: 4`
   - `lessonsFile: "/data/courses/{courseId}/lessons-mp4-week{n}.json"`
   - Dates: April 10 onwards
   - Units from MP4 section of pacing guide

### Material Types

All materials use these types:
- `pdf` - PDF documents
- `doc` - Word documents
- `slide-deck` - PowerPoint presentations
- `video` - Video files
- `link` - External URLs
- `other` - Physical materials or other types

---

## Quality Checklist

Before using lessons in the app:

- [ ] All lesson files follow the same structure
- [ ] All dates are correct for each week
- [ ] All `lessonId` values are unique and consistent
- [ ] All `dayOfWeek` values match your rotating block schedule
- [ ] All material file paths are correct
- [ ] All NJ standard codes are valid (format: `#.#.#.A` or similar)
- [ ] Differentiation strategies are present for advanced and struggling students
- [ ] Assessment methods are formative (not grades-based)
- [ ] Time allocations in agenda add up to 60 minutes

---

## File Statistics

**What's Created**:
- 6 pacing guide files
- 6 lesson plan files (week 1 examples)
- 1 lesson template file
- 1 lessons index file
- **Total**: 14 JSON data files

**What's Needed**:
- ~54 more lesson files (weeks 2-9 for MP3, weeks 1-10 for MP4, all 6 courses)
- 6 curriculum files
- 1 NJ standards file
- **Total**: ~61 more files

**Current Coverage**: Week 1 of MP3 (Feb 1-5) for all 6 courses ✅

---

## Next Steps

1. **Review Week 1 lessons** - Check if content aligns with your actual curriculum

2. **Adjust as needed**:
   - Update lesson titles to match your unit plan
   - Modify materials to reference your actual resources
   - Adjust objectives and standards as needed

3. **Create remaining weeks**:
   - Use Week 1 as template
   - Repeat for weeks 2-9 of MP3
   - Repeat for weeks 1-10 of MP4
   - Total: ~54 more files

4. **Initialize React project**:
   ```bash
   npm create vite@latest course-portal -- --template react
   cd course-portal
   npm install
   ```

5. **Build dashboard component**:
   - Weekly view showing 6 courses
   - Click to expand lesson details
   - Print/PDF export

6. **Deploy locally**:
   - Run `npm run dev`
   - Access on laptop at `http://localhost:5173`

---

## Example Usage

### View Week 1 (Feb 1-5, 2026)

**Data flow**:
1. React loads lessons-index.json
2. Filters for week 1, markingPeriod 3
3. Gets 6 entries with file paths
4. Fetches all 6 lesson JSON files in parallel
5. Renders dashboard showing:
   - Week of February 1-5, 2026
   - Tech Engineering: Lesson 1-3 (Engineering Design, Social/Environmental Problems, SDGs)
   - Intro Electronics: Lesson 1-3 (Electricity Basics, Ohm's Law, Safety)
   - Electronics & Robotics 2: Lesson 1-3 (Circuit Theory, Power Supply, Signal Conditioning)
   - Honors Innovation: Lesson 1-3 (Design Thinking, Empathy Research, Problem Definition)
   - Sustainable Engineering: Lesson 1-3 (Sustainability Fundamentals, Climate Change, SDGs)
   - Social Responsibility: Lesson 1-3 (Poverty, Healthcare/Education, Environmental Justice)

6. Teacher clicks "Print" → PDF generated with all lesson details

---

**This structure is ready for React implementation. Start with the weekly dashboard component and build from there.**

---

*Last Updated*: February 8, 2026
*Created for*: Teacher Lesson Planning Portal
*Status*: Data structure complete, ready for front-end implementation
