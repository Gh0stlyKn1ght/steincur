import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SOURCE_PUBLIC_ROOT = path.join(ROOT, 'app', 'public')
const OUTPUT_PUBLIC_ROOTS = [
  path.join(ROOT, 'app', 'public'),
  path.join(ROOT, 'public'),
]

const COURSE_STANDARDS = {
  'tech-engineering': [
    '8.2.2.A.1',
    '8.2.2.B.1',
    '8.2.2.C.1',
    '8.1.12.A.1',
    '9.1.8.A.1',
    '9.1.8.C.1',
    '9.2.4.A.1',
  ],
  'intro-electronics': [
    '9.1.8.A.1',
    '9.2.8.A.1',
    '9.2.8.A.2',
    '9.2.8.B.1',
    '8.1.2.A.1',
    '9.1.8.D.1',
    '9.2.4.A.1',
  ],
  'electronics-robotics-2': [
    '9.1.8.A.1',
    '9.1.8.A.2',
    '9.1.8.A.3',
    '9.2.8.A.1',
    '9.2.8.A.2',
    '9.2.8.A.3',
    '9.1.8.C.1',
  ],
  'honors-innovation': [
    '8.2.2.A.1',
    '8.2.2.B.1',
    '8.2.2.C.1',
    '9.2.4.A.1',
    '9.1.8.C.1',
    '9.1.8.D.1',
  ],
  'sustainable-engineering': [
    '5.1.8.A',
    '5.2.8.A',
    '8.2.2.A.1',
    '8.2.2.B.1',
    '9.2.4.A.1',
    '9.1.8.C.1',
  ],
  'social-responsibility': [
    '6.1.4.A.12',
    '6.2.6.A.1',
    '5.1.8.A',
    '9.1.8.A.1',
    '9.1.8.C.1',
    '9.1.8.D.1',
  ],
}

const MP_LABEL = {
  3: 'mp3',
  4: 'mp4',
}

const LESSON_DAY_OFFSETS = [1, 2, 4] // Mon, Tue, Thu from Sunday week start
const LESSON_DAY_LABELS = ['Monday', 'Tuesday', 'Thursday']
const AGENDA_TEMPLATE = [
  { activity: 'Hook & Retrieval', minutes: 8 },
  { activity: 'Mini-Lesson', minutes: 15 },
  { activity: 'Studio Practice', minutes: 25 },
  { activity: 'Closure & Exit Ticket', minutes: 12 },
]

const IGNORED_SOURCE_PATTERNS = [
  /\/RECEIPTS\//i,
  /AMAZON/i,
  /DONATION/i,
  /EXIT TICKETS\/.*File responses/i,
  /Untitled document/i,
  /~\$/i,
]

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf8')
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function formatIsoDate(date) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00`)
  date.setDate(date.getDate() + days)
  return date
}

function addDaysToDate(date, days) {
  const copy = new Date(date.getTime())
  copy.setDate(copy.getDate() + days)
  return copy
}

function alignToInstructionalWeekStart(startDate) {
  const start = new Date(`${startDate}T00:00:00`)
  const day = start.getDay() // 0=Sun ... 6=Sat
  if (day === 0) return start
  if (day >= 4) return addDaysToDate(start, 7 - day) // Thu/Fri/Sat -> next Sunday
  return addDaysToDate(start, -day) // Mon/Tue/Wed -> prior Sunday
}

function resolveUnitForWeek(units, week) {
  let cursor = 0
  for (const unit of units) {
    const start = cursor + 1
    const end = cursor + unit.weeks
    if (week >= start && week <= end) {
      return {
        unit,
        weekInUnit: week - start + 1,
        unitStartWeek: start,
      }
    }
    cursor = end
  }

  const fallbackUnit = units[units.length - 1]
  return {
    unit: fallbackUnit,
    weekInUnit: fallbackUnit?.weeks || 1,
    unitStartWeek: Math.max(1, week - ((fallbackUnit?.weeks || 1) - 1)),
  }
}

function normalizeSnippet(text) {
  if (!text) return ''
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E]/g, ' ')
    .trim()
}

function trimSnippet(text, max = 180) {
  const normalized = normalizeSnippet(text)
  if (!normalized) return ''
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1)}...`
}

function pickSources(courseId, courseSourceMap, sourceDocs, week, lessonIndex) {
  const mapped = new Set(courseSourceMap?.coreSourceFiles || [])

  const notIgnored = (sourcePath) =>
    !IGNORED_SOURCE_PATTERNS.some((pattern) => pattern.test(sourcePath))

  const tagged = sourceDocs.filter((source) => {
    if (!Array.isArray(source.candidateCourses)) return false
    if (!source.candidateCourses.includes(courseId)) return false
    if (!notIgnored(source.path)) return false
    return Boolean(trimSnippet(source.scan?.snippet))
  })

  const prioritized = tagged.sort((a, b) => {
    const aMapped = mapped.has(a.path) ? 1 : 0
    const bMapped = mapped.has(b.path) ? 1 : 0
    if (aMapped !== bMapped) return bMapped - aMapped
    const aPdf = String(a.extension).toLowerCase() === '.pdf' ? 1 : 0
    const bPdf = String(b.extension).toLowerCase() === '.pdf' ? 1 : 0
    if (aPdf !== bPdf) return bPdf - aPdf
    return a.path.localeCompare(b.path)
  })

  if (prioritized.length === 0) {
    const fallback = sourceDocs.filter(
      (source) => notIgnored(source.path) && Boolean(trimSnippet(source.scan?.snippet)),
    )
    return fallback.slice(0, 2)
  }

  const baseIndex = (week - 1) * 3 + lessonIndex
  const pdfOnly = prioritized.filter((item) => String(item.extension).toLowerCase() === '.pdf')
  const sourcePool = pdfOnly.length > 0 ? pdfOnly : prioritized
  const first = sourcePool[baseIndex % sourcePool.length]
  const second = sourcePool[(baseIndex + 11) % sourcePool.length]
  return [first, second].filter(Boolean)
}

function selectStandards(courseId, week, lessonIndex) {
  const pool = COURSE_STANDARDS[courseId] || ['8.2.2.A.1', '8.2.2.B.1']
  const picks = [
    pool[(week + lessonIndex) % pool.length],
    pool[(week + lessonIndex + 2) % pool.length],
    pool[(week + lessonIndex + 4) % pool.length],
  ]
  return [...new Set(picks)].slice(0, lessonIndex === 2 ? 3 : 2)
}

function getPhaseLabel(weekInUnit, unitWeeks) {
  if (unitWeeks <= 1) return 'Core Application'
  const ratio = (weekInUnit - 1) / (unitWeeks - 1)
  if (ratio < 0.34) return 'Foundations'
  if (ratio < 0.67) return 'Prototype and Analyze'
  return 'Performance and Reflection'
}

function buildTitle(topic, phase, lessonIndex) {
  const suffixes = {
    Foundations: ['Concept Setup', 'Guided Modeling', 'Evidence Check'],
    'Prototype and Analyze': ['Method Workshop', 'Applied Build', 'Iteration Review'],
    'Performance and Reflection': ['Performance Task', 'Quality Review', 'Reflection and Next Steps'],
    'Core Application': ['Core Method', 'Applied Practice', 'Reflection'],
  }
  const variants = suffixes[phase] || suffixes['Core Application']
  return `${topic}: ${variants[lessonIndex]}`
}

function buildAssessmentType(weekInUnit, unitWeeks, lessonIndex) {
  if (lessonIndex === 2 && weekInUnit === unitWeeks) return 'summative'
  if (lessonIndex === 1) return 'performance'
  return 'formative'
}

function safeSegment(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function shortPath(fullPath) {
  const segments = fullPath.split('/')
  if (segments.length <= 2) return fullPath
  return `${segments[0]}/${segments[segments.length - 1]}`
}

function fileNameFromPath(fullPath) {
  const segments = String(fullPath || '').split('/')
  return segments[segments.length - 1] || fullPath
}

function buildResourceMarkdown({
  courseName,
  unitName,
  topic,
  phase,
  date,
  sourceRefs,
  type,
}) {
  const sourceLines = sourceRefs
    .map(
      (ref) =>
        `- \`${ref.path}\`  \n  ${ref.snippet ? `Snippet: ${ref.snippet}` : 'Snippet: (not available)'}`,
    )
    .join('\n')

  if (type === 'brief') {
    return `# Lesson Brief\n\n- Course: ${courseName}\n- Unit: ${unitName}\n- Topic Focus: ${topic}\n- Phase: ${phase}\n- Date: ${date}\n\n## Instructional Focus\nStudents apply local curriculum expectations for **${topic}** within **${unitName}**.\n\n## Source Anchors\n${sourceLines}\n`
  }

  if (type === 'activity') {
    return `# Student Activity Sheet\n\n## Task\nUse class notes and source materials to complete the ${topic} activity.\n\n1. Identify the design or analysis goal for this lesson.\n2. Document one decision made during practice.\n3. Explain the evidence used from class sources.\n4. Submit an exit response showing what changed after feedback.\n\n## Source Anchors\n${sourceLines}\n`
  }

  return `# Source Evidence Notes\n\nUse this page to record source-linked evidence for ${topic}.\n\n## Source Anchors\n${sourceLines}\n`
}

function generateLessonsForPeriod({
  courseId,
  courseName,
  periodNumber,
  periodConfig,
  courseSourceMap,
  sourceDocs,
}) {
  const unitList = periodConfig.units || []
  const mpLabel = MP_LABEL[periodNumber]
  const totalWeeks = periodConfig.weeks || 0
  const weekFiles = []
  const weekAnchor = alignToInstructionalWeekStart(periodConfig.startDate)

  for (let week = 1; week <= totalWeeks; week += 1) {
    const unitResolution = resolveUnitForWeek(unitList, week)
    const unit = unitResolution.unit
    const weekInUnit = unitResolution.weekInUnit
    const phase = getPhaseLabel(weekInUnit, unit.weeks || 1)
    const topics = unit.topics || ['Core Topic']
    const weekStartDateObj = addDaysToDate(weekAnchor, (week - 1) * 7)
    const weekEndDateObj = addDaysToDate(weekAnchor, (week - 1) * 7 + 4)
    const weekStart = formatIsoDate(weekStartDateObj)
    const weekEnd = formatIsoDate(weekEndDateObj)
    const lessons = []
    const weeklyAssignments = []

    for (let i = 0; i < 3; i += 1) {
      const topic = topics[(weekInUnit + i - 1) % topics.length]
      const title = buildTitle(topic, phase, i)
      const lessonDateObj = addDays(weekStart, LESSON_DAY_OFFSETS[i])
      const lessonDate = formatIsoDate(lessonDateObj)
      const lessonNumber =
        periodNumber === 3 ? (week - 1) * 3 + (i + 1) : 27 + (week - 1) * 3 + (i + 1)
      const sourceCandidates = pickSources(courseId, courseSourceMap, sourceDocs, week, i)
      const sourceRefs = sourceCandidates.map((source) => ({
        sourceId: source.id,
        path: source.path,
        extension: source.extension,
        snippet: trimSnippet(source.scan?.snippet),
      }))
      const standards = selectStandards(courseId, week, i)
      const assessmentType = buildAssessmentType(weekInUnit, unit.weeks || 1, i)
      const unitSlug = safeSegment(unit.unitId || unit.unitName || 'unit')
      const lessonSegment = `lesson-${i + 1}`
      const resourceBase = `/resources/${courseId}/${mpLabel}/week-${week}`
      const briefUrl = `${resourceBase}/${lessonSegment}-brief.md`
      const activityUrl = `${resourceBase}/${lessonSegment}-activity.md`
      const sourceUrl = `${resourceBase}/${lessonSegment}-sources.md`
      const sourcePdfMaterials = sourceRefs
        .filter((ref) => String(ref.extension).toLowerCase() === '.pdf')
        .slice(0, 2)
        .map((ref) => ({
          name: fileNameFromPath(ref.path),
          type: 'pdf',
          quantity: 1,
          fileUrl: sourceUrl,
        }))

      const agenda = AGENDA_TEMPLATE.map((item, itemIndex) => {
        const firstSource = sourceRefs[0]
        const secondSource = sourceRefs[1] || sourceRefs[0]
        if (itemIndex === 0) {
          return {
            timeMinutes: item.minutes,
            activity: item.activity,
            description: `Launch with a retrieval prompt connected to ${topic} using ${shortPath(
              firstSource?.path || 'course materials',
            )}.`,
          }
        }
        if (itemIndex === 1) {
          return {
            timeMinutes: item.minutes,
            activity: item.activity,
            description: `Model core method(s) in ${topic} and reference source evidence from ${shortPath(
              secondSource?.path || 'mapped curriculum sources',
            )}.`,
          }
        }
        if (itemIndex === 2) {
          return {
            timeMinutes: item.minutes,
            activity: item.activity,
            description: `Students complete guided build/analysis steps, document decisions, and cite at least one course source.`,
          }
        }
        return {
          timeMinutes: item.minutes,
          activity: item.activity,
          description: `Close with an exit response explaining what changed after feedback during ${topic}.`,
        }
      })

      lessons.push({
        lessonId: `${courseId}-${mpLabel}-w${week}-l${i + 1}`,
        lessonNumber,
        date: lessonDate,
        dayOfWeek: LESSON_DAY_LABELS[i],
        title,
        duration: 60,
        objectives: [
          `Explain core ideas for ${topic} using vocabulary from ${unit.unitName}.`,
          `Apply ${topic.toLowerCase()} in a structured design or analysis task.`,
          `Use evidence from local source documents to justify decisions and next steps.`,
        ],
        njStandards: standards,
        sourceRefs,
        agenda,
        materials: [
          ...sourcePdfMaterials,
          {
            name: 'Lesson Brief (Source-Aligned)',
            type: 'md',
            quantity: 1,
            fileUrl: briefUrl,
          },
          {
            name: 'Student Activity Sheet',
            type: 'md',
            quantity: 25,
            fileUrl: activityUrl,
          },
          {
            name: 'Source Evidence Notes',
            type: 'md',
            quantity: 1,
            fileUrl: sourceUrl,
          },
        ],
        assessment: {
          type: assessmentType,
          method:
            assessmentType === 'summative'
              ? `Standards checkpoint with rubric-scored artifact for ${topic}.`
              : assessmentType === 'performance'
              ? `Performance task completion with teacher observation notes for ${topic}.`
              : `Exit ticket and notebook evidence aligned to ${topic}.`,
          rubric: {
            conceptAccuracy: '4 = complete/accurate evidence use; 1 = limited/inaccurate',
            processUse: '4 = method used consistently; 1 = method incomplete',
            communication: '4 = clear claim + evidence; 1 = unclear/unsupported response',
          },
        },
        differentiation: {
          forAdvancedLearners: `Add a constraint (time, budget, or material) and defend the revised approach for ${topic}.`,
          forStrugglingStudents: `Provide guided notes, vocabulary bank, and a partially completed example before independent work.`,
          forStrugglingStusdents: `Provide guided notes, vocabulary bank, and a partially completed example before independent work.`,
          forELL: `Pre-teach key terms, allow visual response options, and pair with language support peers.`,
        },
        evidenceArtifacts: [
          'Notebook entry with source citation',
          'Exit ticket response',
          assessmentType === 'summative'
            ? 'Summative checkpoint artifact'
            : 'Practice artifact',
        ],
        accommodationNotes:
          'Apply IEP/504 accommodations: extended time, read-aloud support, chunked directions, and flexible response format as documented.',
        homework: `Complete a 5-10 sentence reflection connecting today's ${topic} work to the unit goal and one cited source.`,
      })

      weeklyAssignments.push(
        {
          assignmentId: `${courseId}-${mpLabel}-w${week}-l${i + 1}-a1`,
          lessonId: `${courseId}-${mpLabel}-w${week}-l${i + 1}`,
          lessonTitle: title,
          title: `In-Class Build: ${topic}`,
          category: 'classwork',
          deliverable: 'Submit a completed class artifact with at least one cited source reference.',
        },
        {
          assignmentId: `${courseId}-${mpLabel}-w${week}-l${i + 1}-a2`,
          lessonId: `${courseId}-${mpLabel}-w${week}-l${i + 1}`,
          lessonTitle: title,
          title: `Exit Ticket: ${topic}`,
          category: 'formative-check',
          deliverable:
            'Provide a short claim-evidence response showing what was learned and what was revised.',
        },
        {
          assignmentId: `${courseId}-${mpLabel}-w${week}-l${i + 1}-a3`,
          lessonId: `${courseId}-${mpLabel}-w${week}-l${i + 1}`,
          lessonTitle: title,
          title: 'Homework Reflection',
          category: 'homework',
          deliverable: 'Write a brief reflection connecting today’s work to unit goals and next steps.',
        },
      )

      weekFiles.push({
        resources: {
          briefPath: `${courseId}/${mpLabel}/week-${week}/${lessonSegment}-brief.md`,
          activityPath: `${courseId}/${mpLabel}/week-${week}/${lessonSegment}-activity.md`,
          sourcePath: `${courseId}/${mpLabel}/week-${week}/${lessonSegment}-sources.md`,
        },
        resourceContent: {
          brief: buildResourceMarkdown({
            courseName,
            unitName: unit.unitName,
            topic,
            phase,
            date: lessonDate,
            sourceRefs,
            type: 'brief',
          }),
          activity: buildResourceMarkdown({
            courseName,
            unitName: unit.unitName,
            topic,
            phase,
            date: lessonDate,
            sourceRefs,
            type: 'activity',
          }),
          sourceNotes: buildResourceMarkdown({
            courseName,
            unitName: unit.unitName,
            topic,
            phase,
            date: lessonDate,
            sourceRefs,
            type: 'sources',
          }),
        },
      })
    }

    weekFiles.push({
      assignmentsPayload: {
        courseId,
        courseName,
        markingPeriod: periodNumber,
        week,
        weekStart,
        weekEnd,
        unitId: unit.unitId,
        unitName: unit.unitName,
        assignments: weeklyAssignments,
      },
      assignmentsFileName: `assignments-${mpLabel}-week${week}.json`,
    })

    weekFiles.push({
      weekPayload: {
        courseId,
        courseName,
        markingPeriod: periodNumber,
        week,
        weekStart,
        weekEnd,
        unitId: unit.unitId,
        unitName: unit.unitName,
        lessons,
      },
      weekMeta: {
        unitId: unit.unitId,
        unitName: unit.unitName,
      },
    })
  }

  return weekFiles
}

function cleanupGeneratedLessonFiles(publicRoot, courseIds) {
  for (const courseId of courseIds) {
    const courseDir = path.join(publicRoot, 'data', 'courses', courseId)
    if (!fs.existsSync(courseDir)) continue
    for (const file of fs.readdirSync(courseDir)) {
      if (/^(lessons|assignments)-mp[34]-week\d+\.json$/.test(file)) {
        fs.rmSync(path.join(courseDir, file), { force: true })
      }
    }
  }
}

function main() {
  const sourceDataDir = path.join(SOURCE_PUBLIC_ROOT, 'data')
  const courseMap = readJson(path.join(sourceDataDir, 'course-source-map.json'))
  const sourceDocumentsIndex = readJson(path.join(sourceDataDir, 'source-documents-index.json'))
  const courseList = courseMap.courses || []
  const courseIds = courseList.map((course) => course.courseId)

  for (const outRoot of OUTPUT_PUBLIC_ROOTS) {
    cleanupGeneratedLessonFiles(outRoot, courseIds)
    fs.rmSync(path.join(outRoot, 'resources'), { recursive: true, force: true })
    ensureDir(path.join(outRoot, 'resources'))
  }

  const lessonsIndex = []

  for (const course of courseList) {
    const courseId = course.courseId
    const courseName = course.courseName
    const curriculumPath = path.join(sourceDataDir, 'courses', courseId, 'curriculum.json')
    if (!fs.existsSync(curriculumPath)) continue

    const curriculum = readJson(curriculumPath)
    const mp3 = curriculum.markingPeriod3
    const mp4 = curriculum.markingPeriod4
    const courseSources = sourceDocumentsIndex.sources || []

    for (const periodNumber of [3, 4]) {
      const periodConfig = periodNumber === 3 ? mp3 : mp4
      if (!periodConfig) continue
      const mpLabel = MP_LABEL[periodNumber]
      const generated = generateLessonsForPeriod({
        courseId,
        courseName,
        periodNumber,
        periodConfig,
        courseSourceMap: course,
        sourceDocs: courseSources,
      })

      let weekPayloadsWritten = 0
      for (const item of generated) {
        if (item.assignmentsPayload) {
          for (const outRoot of OUTPUT_PUBLIC_ROOTS) {
            writeJson(
              path.join(outRoot, 'data', 'courses', courseId, item.assignmentsFileName),
              item.assignmentsPayload,
            )
          }
          continue
        }

        if (item.resources) {
          for (const outRoot of OUTPUT_PUBLIC_ROOTS) {
            writeText(
              path.join(outRoot, 'resources', item.resources.briefPath),
              item.resourceContent.brief,
            )
            writeText(
              path.join(outRoot, 'resources', item.resources.activityPath),
              item.resourceContent.activity,
            )
            writeText(
              path.join(outRoot, 'resources', item.resources.sourcePath),
              item.resourceContent.sourceNotes,
            )
          }
          continue
        }

        const weekFileName = `lessons-${mpLabel}-week${item.weekPayload.week}.json`
        for (const outRoot of OUTPUT_PUBLIC_ROOTS) {
          writeJson(
            path.join(outRoot, 'data', 'courses', courseId, weekFileName),
            item.weekPayload,
          )
        }

        lessonsIndex.push({
          courseId,
          courseName,
          markingPeriod: periodNumber,
          week: item.weekPayload.week,
          weekStart: item.weekPayload.weekStart,
          weekEnd: item.weekPayload.weekEnd,
          lessonsFile: `/data/courses/${courseId}/${weekFileName}`,
          lessonCount: item.weekPayload.lessons.length,
          unitId: item.weekMeta.unitId,
          unitName: item.weekMeta.unitName,
        })
        weekPayloadsWritten += 1
      }

      if (weekPayloadsWritten !== periodConfig.weeks) {
        throw new Error(
          `Week generation mismatch for ${courseId} MP${periodNumber}. Expected ${periodConfig.weeks}, generated ${weekPayloadsWritten}.`,
        )
      }
    }
  }

  lessonsIndex.sort((a, b) => {
    if (a.markingPeriod !== b.markingPeriod) return a.markingPeriod - b.markingPeriod
    if (a.week !== b.week) return a.week - b.week
    return a.courseName.localeCompare(b.courseName)
  })

  const sampleCurriculum = readJson(
    path.join(sourceDataDir, 'courses', courseIds[0], 'curriculum.json'),
  )

  const lessonsIndexPayload = {
    lessonsIndex,
    instructionalCalendar: {
      markingPeriod3: {
        startDate: sampleCurriculum.markingPeriod3.startDate,
        endDate: sampleCurriculum.markingPeriod3.endDate,
        totalWeeks: sampleCurriculum.markingPeriod3.weeks,
        description: 'Marking Period 3',
      },
      markingPeriod4: {
        startDate: sampleCurriculum.markingPeriod4.startDate,
        endDate: sampleCurriculum.markingPeriod4.endDate,
        totalWeeks: sampleCurriculum.markingPeriod4.weeks,
        description: 'Marking Period 4',
      },
    },
  }

  for (const outRoot of OUTPUT_PUBLIC_ROOTS) {
    writeJson(path.join(outRoot, 'data', 'lessons-index.json'), lessonsIndexPayload)
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    courses: courseIds.length,
    entries: lessonsIndex.length,
    mp3Entries: lessonsIndex.filter((x) => x.markingPeriod === 3).length,
    mp4Entries: lessonsIndex.filter((x) => x.markingPeriod === 4).length,
    resourcesRoot: OUTPUT_PUBLIC_ROOTS.map((root) => path.relative(ROOT, path.join(root, 'resources'))),
  }

  writeJson(path.join(ROOT, 'lesson_plan_generation_summary.json'), summary)
  // eslint-disable-next-line no-console
  console.log('Lesson generation complete:', summary)
}

main()
