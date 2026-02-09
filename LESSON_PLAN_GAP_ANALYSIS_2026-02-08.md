# Lesson Plan Gap Analysis (2026-02-08)

## Scope
- Audited `app/public/data/courses/*/lessons-mp3-week*.json`
- Coverage in scope: 6 courses, MP3 weeks 1-9
- Total lesson files: 54
- Total lessons: 162

## Structural Health (What Is Working)
- Required lesson fields present in all lessons.
- Date and `dayOfWeek` alignment is valid.
- `duration` matches agenda minute totals.
- No duplicate `lessonId` values detected.
- Week coverage is complete for MP3 in all courses (weeks 1-9).

## Critical Gaps
1. MP4 lesson files are missing.
- Current lessons index/calendar expects MP4, but lesson content is only MP3.
- Risk: dashboard can eventually surface empty data for MP4 weeks.

2. Source realism gap in weeks 2-9.
- Placeholder pattern markers are widespread:
  - `Concepts and Context`: 48 hits
  - `Applied Practice`: 48 hits
  - `Design Challenge and Reflection`: 48 hits
  - generic agenda phrases (`Hook focused on`, `Mini-Lesson focused on`, `Guided Practice focused on`): 144 each
- Risk: lessons look complete structurally but are not fully source-grounded instructionally.

3. Resource link integrity is weak.
- `classroom.local` links: 144 references (non-resolvable placeholder host).
- `/resources/...` local links: 338 references, all missing from `app/public/resources` (folder not present).
- Risk: materials section appears rich, but links fail at runtime.

## Quality Gaps
1. Standards diversity is narrow.
- Unique standards by course are low:
  - honors-innovation: 2
  - social-responsibility: 3
  - others: 4
- Risk: may underrepresent true standards coverage over full MP3/MP4 sequence.

2. Assessment variety is minimal.
- Assessment type is always `formative` across all 162 lessons.
- Risk: missing explicit summative checkpoints and performance assessment milestones.

3. Differentiation key typo is embedded in all lessons.
- Key used: `forStrugglingStusdents` (typo)
- Risk: schema inconsistency and downstream tooling fragility.

4. Lesson repetition pattern is high.
- Each course has only 12 unique titles across 27 lessons.
- Weeks 2-9 repeat templated title patterns and language.
- Risk: insufficient week-to-week instructional progression detail.

## Contract/Compliance Adjacent Gaps (Operational)
- Lessons do not explicitly track:
  - accommodation implementation evidence per lesson
  - assessment evidence artifacts for observation-ready documentation
  - source-document citation per lesson section

## Priority Fix Plan
1. Replace MP3 weeks 2-9 placeholder text with source-anchored content from mapped docs/PDFs.
2. Build MP4 weeks 1-10 lessons for all 6 courses.
3. Resolve materials strategy:
- either add actual `/resources/...` files
- or remap materials to existing source file paths/doc references already in repo
- remove `classroom.local` placeholders
4. Expand per-course standards map and distribute standards intentionally across units.
5. Add assessment mix:
- formative checks weekly
- summative/performance tasks by unit boundary
6. Normalize differentiation schema (`forStrugglingStudents`) while keeping backward compatibility in UI.
7. Add lesson metadata:
- `sourceRefs` array per lesson
- optional `evidenceArtifacts` fields
- optional `accommodationNotes` fields

## Audit Artifacts
- `lesson_plan_audit.json`
- `lesson_plan_audit_deep.json`
