# Teacher Lesson Planning Portal

## ⚠️ SPECIFICATION DOCUMENT

This is a SPECIFICATION (design plan) for a React app to be built, NOT documentation of an existing system.

**Current Status**: 🔲 Not yet started (Project not initialized)

---

## 💡 **SMARTER NOT HARDER** ⚡

Work efficiently, not longer. Use proven strategies, not reinvention. Automate what can be automated. Delegate where possible. Focus on what matters most: **student learning**.

---

## Project Overview

A **React-based lesson planning and curriculum management platform** built for educators teaching multiple courses. The application helps teachers organize curriculum materials, create and manage lesson plans, track progress through the school year, and ensure alignment with NJ educational standards.

**Target**: MVP Development (Phase 1) - Planned for Week of Feb 10-15, 2026

## Core Purpose

This tool serves as a **single hub** for teachers to:
- 📅 Plan and view lessons for the entire school year
- 📝 Create, edit, and reuse lesson plans
- 📚 Link curriculum materials (PDFs, docs, resources) to lessons
- ✓ Track progress (planned → taught → assessed)
- 🏷️ Tag lessons with NJ educational standards
- 📄 Export lesson plans as PDFs

## For This Teacher

**Courses Managed**:
1. Technology, Engineering, and Social Responsibility
2. Introduction to Electronics and Robotics
3. Electronics and Robotics 2
4. Honors Innovation and Design
5. Sustainable Engineering and Design
6. Exploring Careers and Issues in Social Responsibility

**Requirements**:
- All lessons must align with NJ state standards
- Lesson plans needed for entire year (starting Marking Period 3)
- Integration with existing curriculum documents
- Teacher-first workflow (quick to use, practical)

## Key Features (MVP)

### Phase 1: MVP (Week of Feb 10, 2026) - 🔲 PLANNED
- 🔲 Yearly lesson calendar view
- 🔲 Week-at-a-glance dashboard
- 🔲 Lesson plan editor with templates
- 🔲 NJ standards alignment tagger
- 🔲 Curriculum materials linker
- 🔲 Progress tracker (planned/taught/assessed)
- 🔲 Export to PDF
- 🔲 Local storage (browser-based persistence)

### Phase 2: Enhancements (Weeks 3-4)
- AI-assisted lesson plan generation
- Pacing guide analyzer
- Standards alignment dashboard
- Week-by-week recommendations

### Phase 3: Student Portal (Future)
- Student-facing course view
- Assignment tracker
- Resource library

## Tech Stack

```
Frontend:     React 18 + Vite
Styling:      Tailwind CSS + shadcn/ui
Routing:      React Router v6
State:        React Context API + custom hooks
Data:         JSON files in /public/data
Storage:      localStorage (browser-based)
Build:        Vite
Deployment:   Vercel or Netlify
```

## Quick Start

For developers new to this project:

1. **Read First**: [ROADMAP.md](./ROADMAP.md) - Understand the timeline and priorities
2. **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical design and decisions
3. **Data**: [DATA_SCHEMA.md](./DATA_SCHEMA.md) - All data structures and formats
4. **Setup**: [SETUP.md](./SETUP.md) - How to develop locally
5. **Structure**: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - File organization

## File Structure Overview

```
course-portal/
├── public/
│   └── data/                          # All course data (JSON)
│       ├── courses.json
│       ├── nj-standards.json
│       ├── lesson-plan-templates.json
│       └── courses/                   # One folder per course
│
├── src/
│   ├── components/                    # React components
│   ├── pages/                         # Page-level components
│   ├── hooks/                         # Custom React hooks
│   ├── App.jsx
│   └── main.jsx
│
├── ROADMAP.md                         # This document
├── ARCHITECTURE.md
├── DATA_SCHEMA.md
├── PROJECT_STRUCTURE.md
├── SETUP.md
└── package.json
```

**See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for the complete detailed structure.**

## Development Workflow

### For New Features or Updates:

1. **Understand the scope**: Read [ROADMAP.md](./ROADMAP.md) to see which phase this belongs to
2. **Check architecture**: Review [ARCHITECTURE.md](./ARCHITECTURE.md) for design patterns
3. **Verify data**: Reference [DATA_SCHEMA.md](./DATA_SCHEMA.md) for the correct data format
4. **Implement**: Follow the patterns established in existing components
5. **Test**: Run the dev server and test locally
6. **Document**: Update the relevant .md file if architecture changes

### Important Conventions

- **Component naming**: PascalCase, descriptive (e.g., `LessonEditor.jsx`)
- **Hook naming**: camelCase with `use` prefix (e.g., `useLessonPlans.js`)
- **Data files**: kebab-case, stored in `/public/data/`
- **States**: Use React Context for global state, `useState` for local
- **Styling**: Tailwind CSS classes, use shadcn/ui components where possible

## Current Status & Timeline

**Week of Feb 10, 2026**: MVP Development
- Day 1-2: Setup & Data Layer 🔲
- Day 3-4: Core Components (LessonEditor, WeekView, TemplateSelector)
- Day 5-6: Export, Polish, Deploy

**Target**: Live lesson planner available by Friday, Feb 15, 2026

## Important Notes for AI Models

When updating or adding features:

1. **Always check [ROADMAP.md](./ROADMAP.md) first** - Understand what phase/feature you're working on
2. **Refer to [DATA_SCHEMA.md](./DATA_SCHEMA.md)** - All data structures are documented here
3. **Follow [ARCHITECTURE.md](./ARCHITECTURE.md)** - Design patterns and tech decisions
4. **Use [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Know exactly where files should go
5. **Update documentation** - If you change architecture or add new features, update the .md files
6. **Test locally** - Use `npm run dev` before considering a task complete
7. **Consider the teacher** - All features should be teacher-first and practical

## Questions & Context

**For Curriculum Analysis**:
- ChatGPT/Gemini can analyze curriculum documents and generate lesson plan JSON
- Import the generated JSON into `/public/data/courses/` structure
- Teacher then fine-tunes in the UI

**For Standards Mapping**:
- Use official NJ standards documents
- Standards are stored in `/public/data/nj-standards.json`
- Update whenever new standards are added

**For UI/UX**:
- Teacher needs quick, intuitive workflows
- Minimize clicks to get to lesson planning
- Mobile-responsive (teachers use phones/tablets)

## Getting Help

- **Setup issues?** → See [SETUP.md](./SETUP.md)
- **Don't know where a file goes?** → Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **Need to add data?** → Refer to [DATA_SCHEMA.md](./DATA_SCHEMA.md)
- **Planning new features?** → Review [ROADMAP.md](./ROADMAP.md)
- **Understanding the design?** → Read [ARCHITECTURE.md](./ARCHITECTURE.md)

## License

Internal use for educational purposes.

---

**Last Updated**: February 8, 2026
**Maintained By**: Initial architect + AI development team
**Next Review**: After Phase 1 completion (Feb 15, 2026)
