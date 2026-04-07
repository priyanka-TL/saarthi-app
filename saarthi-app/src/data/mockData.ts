import type { ChallengeDataset, ChallengeKey } from '@/types/saarthi'

export const challengeOrder: ChallengeKey[] = ['engagement', 'attendance', 'burnout', 'community']

export const recommendationSectionLabels = {
  whatOthersDid: 'What others did',
  tryThisNext: 'Try this next',
  resources: 'Resources',
} as const

export const challengeData: Record<ChallengeKey, ChallengeDataset> = {
  engagement: {
    label: 'Low student engagement',
    accentClass: 'bg-amber-100 text-amber-800 border-amber-200',
    captureOptions: {
      where: ['Grade 6-8 language classrooms', 'Multi-grade classroom in a rural school', 'After-lunch sessions across sections'],
      who: ['Students with irregular participation', 'Teachers managing 40+ learners', 'School leader tracking low classroom energy'],
      tried: ['Extra worksheets and tests', 'Occasional group activities', 'Motivational talks in assembly'],
    },
    summaryTemplate: ({ where, who, tried }) =>
      `In ${where}, ${who} report low participation. Current attempts include ${tried}. The challenge appears persistent and needs a classroom-practice shift with quick feedback loops.`,
    keyPatterns: [
      'Engagement dips most during lecture-heavy periods after lunch.',
      'Students participate more when examples are linked to local context.',
      'Teachers rely on completion metrics, not participation signals.',
    ],
    rootCauses: [
      {
        title: 'Passive instructional design',
        description: 'Most lessons are teacher-led with limited peer interaction or student choice.',
      },
      {
        title: 'Weak formative feedback loops',
        description: 'Teachers do not receive rapid indicators on who is disengaging and why.',
      },
      {
        title: 'Low contextual relevance',
        description: 'Content examples are not grounded in learners’ day-to-day realities.',
      },
    ],
    insights: [
      {
        id: 'eng-1',
        title: 'Passive instruction correlates with silent classrooms',
        description: 'Observation logs show engagement drops when students are only note-taking for over 20 minutes.',
        tags: ['Pedagogy', 'Classroom practice'],
        cluster: 'Instruction',
      },
      {
        id: 'eng-2',
        title: 'Peer-learning moments spark participation',
        description: 'Short pair-share routines increase student responses in mixed-ability classrooms.',
        tags: ['Peer learning', 'Inclusion'],
        cluster: 'Instruction',
      },
      {
        id: 'eng-3',
        title: 'After-lunch slump impacts attention',
        description: 'Engagement heatmaps show the steepest drop in last two periods.',
        tags: ['Schedule', 'Energy'],
        cluster: 'School environment',
      },
      {
        id: 'eng-4',
        title: 'Participation is not tracked systematically',
        description: 'Schools track attendance, but not meaningful participation indicators.',
        tags: ['Data use', 'Monitoring'],
        cluster: 'Leadership routines',
      },
    ],
    recommendations: [
      {
        id: 'eng-r1',
        section: 'whatOthersDid',
        title: '2-minute check-ins at lesson start',
        description: 'Teachers used emotion/energy cards to tune pacing before teaching.',
        details:
          'A cluster in Bihar introduced 2-minute student check-ins with color cards. Teachers adjusted task format based on energy levels and saw participation increase within three weeks.',
        tags: ['Classroom routine', 'Low effort'],
        linkedInsightIds: ['eng-3', 'eng-1'],
      },
      {
        id: 'eng-r2',
        section: 'whatOthersDid',
        title: 'Peer teaching circles',
        description: 'Student pairs explained one concept every Friday.',
        details:
          'A leader network in Karnataka introduced peer-teaching circles where each student explained one concept to a partner. This reduced silent learners and improved confidence.',
        tags: ['Peer learning', 'Student voice'],
        linkedInsightIds: ['eng-2'],
      },
      {
        id: 'eng-r3',
        section: 'tryThisNext',
        title: 'Convert one lecture into a think-pair-share lesson',
        description: 'Pick one topic this week and redesign it with peer interaction.',
        details:
          'Use a 10-10-10 format: 10 min input, 10 min pair explain, 10 min class reflection. Capture participation count before and after.',
        tags: ['Micro-improvement', 'Action in 1 week'],
        linkedInsightIds: ['eng-1', 'eng-2'],
      },
      {
        id: 'eng-r4',
        section: 'tryThisNext',
        title: 'Track participation, not just attendance',
        description: 'Introduce a simple participation tracker for 5 focus students.',
        details:
          'Create a weekly tracker with three indicators: asked a question, answered a peer, completed collaborative task. Review every Friday with school leader.',
        tags: ['Data use', 'Leadership routine'],
        linkedInsightIds: ['eng-4'],
      },
      {
        id: 'eng-r5',
        section: 'resources',
        title: 'Active Learning Routine Pack',
        description: 'Practical routines for high-participation classrooms.',
        details: 'Includes think-pair-share templates, local-context hooks, and reflection prompts for Grades 6-8.',
        tags: ['Toolkit', 'Lesson design'],
        linkedInsightIds: ['eng-1', 'eng-2'],
      },
      {
        id: 'eng-r6',
        section: 'resources',
        title: 'Classroom Observation Checklist',
        description: 'Lightweight rubric for tracking learner participation.',
        details:
          'A one-page checklist for leaders to capture instructional balance, learner talk-time, and peer interaction evidence.',
        tags: ['Checklist', 'Monitoring'],
        linkedInsightIds: ['eng-4'],
      },
    ],
    defaultPlan: {
      smallAction: 'Run think-pair-share in one Grade 7 lesson every Tuesday and Thursday.',
      expectedOutcome: 'At least 60% of students speak at least once during the lesson.',
      timeline: '2 weeks',
      successSignal: 'Participation tracker shows increase for 5 focus students.',
      supportNeeded: 'School leader observation support once per week.',
    },
    companionReplies: [
      {
        id: 'eng-c1',
        prompt: 'How do I improve engagement?',
        triggerKeywords: ['improve engagement', 'low engagement', 'increase participation'],
        summary: 'Start with one lesson redesign and track participation for a small focus group.',
        steps: [
          'Choose one topic this week for think-pair-share.',
          'Use a 3-indicator participation tracker for 5 students.',
          'Review signals with a peer teacher after 1 week.',
        ],
        linkedInsightIds: ['eng-1', 'eng-4'],
        linkedRecommendationIds: ['eng-r3', 'eng-r4'],
      },
      {
        id: 'eng-c2',
        prompt: 'What worked in similar schools?',
        triggerKeywords: ['similar schools', 'what worked', 'examples'],
        summary: 'Schools saw quick gains with short check-ins and peer teaching circles.',
        steps: [
          'Use a 2-minute energy check at lesson start.',
          'Run one peer-teaching circle every week.',
          'Document one visible change in student participation.',
        ],
        linkedInsightIds: ['eng-2', 'eng-3'],
        linkedRecommendationIds: ['eng-r1', 'eng-r2'],
      },
    ],
    suggestedQuestions: ['How do I improve engagement?', 'What worked in similar schools?', 'Which action can I start this week?'],
    programDraft: {
      challengeStatement: 'Students are present but not actively participating in classroom learning.',
      objective: 'Increase active student participation in core subjects by using structured active-learning routines.',
      targetGroup: 'Teachers and Grade 6-8 students in focus schools',
      keyActivities: 'Teacher demo sessions, peer observation cycles, weekly reflection huddles',
      indicators: 'Participation ratio, learner talk-time, completion of active routine logs',
    },
  },
  attendance: {
    label: 'Poor attendance',
    accentClass: 'bg-sky-100 text-sky-800 border-sky-200',
    captureOptions: {
      where: ['Upper primary government school', 'Hamlets with long walking distance', 'Periods after seasonal migration'],
      who: ['Students from daily-wage households', 'Parents with limited school communication', 'Head teacher managing mixed attendance patterns'],
      tried: ['Home visits by class teacher', 'Morning announcements', 'Attendance warnings to parents'],
    },
    summaryTemplate: ({ where, who, tried }) =>
      `In ${where}, attendance remains low for ${who}. Current measures include ${tried}, but consistency is still weak. A coordinated school-home rhythm is needed.`,
    keyPatterns: [
      'Absenteeism spikes after local market days and seasonal labor cycles.',
      'Attendance dips are highest in classes where follow-up calls are inconsistent.',
      'Students return more regularly when peers or volunteers nudge families.',
    ],
    rootCauses: [
      {
        title: 'Weak school-home communication loops',
        description: 'Messages to caregivers are irregular and mostly reactive.',
      },
      {
        title: 'Contextual barriers not tracked',
        description: 'Distance, sibling care, and livelihood cycles are not captured systematically.',
      },
      {
        title: 'No micro-targeting of at-risk students',
        description: 'Attendance interventions are broad, not focused on high-risk cohorts.',
      },
    ],
    insights: [
      {
        id: 'att-1',
        title: 'Attendance drops after mid-day meal disruptions',
        description: 'Field logs show sharp reductions on days with delayed meal supply.',
        tags: ['Operations', 'School climate'],
        cluster: 'School systems',
      },
      {
        id: 'att-2',
        title: 'Distance and safety concerns affect girls more',
        description: 'Families report irregular attendance where commute is long and unsupervised.',
        tags: ['Equity', 'Access'],
        cluster: 'Community factors',
      },
      {
        id: 'att-3',
        title: 'Early warning list predicts prolonged absence',
        description: 'Students absent 2 consecutive days are likely to miss the full week.',
        tags: ['Early warning', 'Data use'],
        cluster: 'Leadership routines',
      },
      {
        id: 'att-4',
        title: 'Peer nudges outperform one-way reminders',
        description: 'Buddy calls increase return rates more than generic parent notices.',
        tags: ['Peer support', 'Behavioural nudge'],
        cluster: 'Community factors',
      },
    ],
    recommendations: [
      {
        id: 'att-r1',
        section: 'whatOthersDid',
        title: '48-hour response protocol',
        description: 'Schools triggered support calls after two days of absence.',
        details:
          'Cluster leaders piloted a 48-hour response list with teacher-parent-peer follow-up. Repeat absenteeism reduced over one month in focus cohorts.',
        tags: ['Protocol', 'Leadership'],
        linkedInsightIds: ['att-3'],
      },
      {
        id: 'att-r2',
        section: 'whatOthersDid',
        title: 'Attendance buddy circles',
        description: 'Students formed buddy groups to encourage daily return.',
        details:
          'Each student was paired with an attendance buddy. Peer calls before school improved consistency, especially after holidays.',
        tags: ['Peer nudge', 'Low cost'],
        linkedInsightIds: ['att-4'],
      },
      {
        id: 'att-r3',
        section: 'tryThisNext',
        title: 'Create a weekly risk cohort of 10 learners',
        description: 'Focus interventions on high-risk students instead of all absentees.',
        details:
          'Use attendance records to identify top-risk students every Monday. Assign teacher + volunteer follow-up owners for each learner.',
        tags: ['Targeted action', 'Data routine'],
        linkedInsightIds: ['att-3'],
      },
      {
        id: 'att-r4',
        section: 'tryThisNext',
        title: 'Family communication calendar',
        description: 'Shift from reactive calls to predictable school-home touchpoints.',
        details:
          'Set three fixed touchpoints weekly: reminder, wellbeing check, and achievement highlight. Keep calls under 2 minutes.',
        tags: ['Family engagement', 'Consistency'],
        linkedInsightIds: ['att-2'],
      },
      {
        id: 'att-r5',
        section: 'resources',
        title: 'Attendance Early Warning Template',
        description: 'Simple sheet to track risk levels and actions.',
        details: 'Includes thresholds, ownership columns, and weekly review prompts for school leaders.',
        tags: ['Template', 'Monitoring'],
        linkedInsightIds: ['att-3'],
      },
      {
        id: 'att-r6',
        section: 'resources',
        title: 'Caregiver Outreach Scripts',
        description: 'Short multilingual scripts for constructive attendance calls.',
        details: 'Empathy-first scripts with context probes and co-created next steps for families.',
        tags: ['Communication', 'Multilingual'],
        linkedInsightIds: ['att-2', 'att-4'],
      },
    ],
    defaultPlan: {
      smallAction: 'Run a 48-hour follow-up for any student absent for 2 consecutive days.',
      expectedOutcome: 'At least 70% of flagged students return within the week.',
      timeline: '3 weeks',
      successSignal: 'Weekly risk-cohort list shrinks by at least 20%.',
      supportNeeded: 'Volunteer support for caregiver calls and home check-ins.',
    },
    companionReplies: [
      {
        id: 'att-c1',
        prompt: 'How do I improve attendance?',
        triggerKeywords: ['improve attendance', 'poor attendance', 'attendance challenge'],
        summary: 'Use an early-warning cohort with clear 48-hour response ownership.',
        steps: [
          'Build a weekly list of top 10 at-risk students.',
          'Assign one adult owner and one peer buddy per student.',
          'Track return rate every Friday in a 20-minute review.',
        ],
        linkedInsightIds: ['att-3', 'att-4'],
        linkedRecommendationIds: ['att-r1', 'att-r3'],
      },
      {
        id: 'att-c2',
        prompt: 'What worked in similar schools?',
        triggerKeywords: ['what worked', 'similar schools', 'examples'],
        summary: 'Buddy circles and predictable caregiver touchpoints improved consistency.',
        steps: [
          'Pilot buddy circles in one grade first.',
          'Use fixed weekly caregiver touchpoints.',
          'Capture reasons for absence to refine intervention.',
        ],
        linkedInsightIds: ['att-2', 'att-4'],
        linkedRecommendationIds: ['att-r2', 'att-r4'],
      },
    ],
    suggestedQuestions: ['How do I improve attendance?', 'What worked in similar schools?', 'Which students should we prioritize first?'],
    programDraft: {
      challengeStatement: 'Student attendance is inconsistent, with repeated absences in vulnerable cohorts.',
      objective: 'Improve weekly attendance consistency through early warning and school-home follow-up loops.',
      targetGroup: 'At-risk students and caregivers in focus schools',
      keyActivities: 'Risk cohort identification, buddy circles, caregiver communication calendar',
      indicators: 'Weekly attendance rate, return-within-48-hours rate, repeat absentee count',
    },
  },
  burnout: {
    label: 'Teacher burnout',
    accentClass: 'bg-rose-100 text-rose-800 border-rose-200',
    captureOptions: {
      where: ['Schools with teacher shortages', 'Exam preparation months', 'Schools with high admin reporting load'],
      who: ['Teachers handling multiple subjects', 'School heads balancing instruction and compliance', 'Teachers new to digital reporting'],
      tried: ['One-time wellness sessions', 'Internal timetable changes', 'Peer encouragement circles'],
    },
    summaryTemplate: ({ where, who, tried }) =>
      `In ${where}, ${who} are showing signs of burnout. Teams have tried ${tried}, but stress remains high. The system needs workload balancing and practical wellbeing routines.`,
    keyPatterns: [
      'Planning and reporting tasks are concentrated on the same small set of teachers.',
      'Instructional quality dips when admin tasks peak before reviews.',
      'Peer support is informal and inconsistent across schools.',
    ],
    rootCauses: [
      {
        title: 'Workload concentration',
        description: 'Core tasks are not distributed; a few teachers absorb repeated duties.',
      },
      {
        title: 'No protected planning time',
        description: 'Teachers prepare lessons during personal hours, increasing fatigue.',
      },
      {
        title: 'Limited psychosocial support structures',
        description: 'Wellbeing efforts are ad-hoc and not embedded in weekly routines.',
      },
    ],
    insights: [
      {
        id: 'bur-1',
        title: 'Administrative reporting is the top stress driver',
        description: 'Teachers report paperwork burden as higher than classroom pressure.',
        tags: ['Workload', 'System demand'],
        cluster: 'Operational load',
      },
      {
        id: 'bur-2',
        title: 'Lack of co-planning raises prep fatigue',
        description: 'Teachers planning alone spend significantly more after-school hours.',
        tags: ['Collaboration', 'Instructional planning'],
        cluster: 'Professional practice',
      },
      {
        id: 'bur-3',
        title: 'Recognition routines are missing',
        description: 'Teachers feel efforts are invisible, lowering motivation and retention intent.',
        tags: ['Motivation', 'Culture'],
        cluster: 'School culture',
      },
      {
        id: 'bur-4',
        title: 'No early signal tracking for burnout',
        description: 'Leaders respond late because wellbeing indicators are not monitored monthly.',
        tags: ['Wellbeing data', 'Leadership'],
        cluster: 'Leadership routines',
      },
    ],
    recommendations: [
      {
        id: 'bur-r1',
        section: 'whatOthersDid',
        title: 'Protected planning blocks',
        description: 'Schools reserved one shared planning slot each week.',
        details:
          'Leaders protected a weekly 45-minute co-planning block and redistributed reporting tasks. Teachers reported reduced after-hours prep within 4 weeks.',
        tags: ['Scheduling', 'Teacher support'],
        linkedInsightIds: ['bur-2', 'bur-1'],
      },
      {
        id: 'bur-r2',
        section: 'whatOthersDid',
        title: 'Weekly recognition pulse',
        description: 'Short appreciation routine improved team morale.',
        details:
          'A 10-minute Friday recognition pulse where peers highlighted one helpful practice improved motivation and peer trust.',
        tags: ['School culture', 'Low cost'],
        linkedInsightIds: ['bur-3'],
      },
      {
        id: 'bur-r3',
        section: 'tryThisNext',
        title: 'Redistribute one non-teaching task this week',
        description: 'Reduce concentrated workload in one practical move.',
        details:
          'Identify one repeated reporting task currently handled by a single teacher and rotate it across the team for 3 weeks.',
        tags: ['Micro-action', 'Workload balance'],
        linkedInsightIds: ['bur-1'],
      },
      {
        id: 'bur-r4',
        section: 'tryThisNext',
        title: 'Track burnout signals monthly',
        description: 'Introduce a 3-question teacher wellbeing pulse.',
        details:
          'Collect anonymous monthly signals on energy, workload, and support. Use trend review in staff meeting for early action.',
        tags: ['Data routine', 'Prevention'],
        linkedInsightIds: ['bur-4'],
      },
      {
        id: 'bur-r5',
        section: 'resources',
        title: 'Teacher Wellbeing Pulse Template',
        description: '3-question pulse survey with interpretation guide.',
        details: 'Includes color-band thresholds and suggested responses for school leaders.',
        tags: ['Survey', 'Leadership toolkit'],
        linkedInsightIds: ['bur-4'],
      },
      {
        id: 'bur-r6',
        section: 'resources',
        title: 'Collaborative Lesson Planning Kit',
        description: 'Shared planner formats and co-design protocols.',
        details: 'Pack includes weekly planner boards, timeboxing methods, and shared resource indexing.',
        tags: ['Planning toolkit', 'Collaboration'],
        linkedInsightIds: ['bur-2'],
      },
    ],
    defaultPlan: {
      smallAction: 'Protect one 45-minute co-planning block every Wednesday for the next 3 weeks.',
      expectedOutcome: 'Teachers reduce after-school planning hours and report higher support.',
      timeline: '3 weeks',
      successSignal: 'Monthly wellbeing pulse improves on energy and support indicators.',
      supportNeeded: 'School head to enforce protected slot and rotate admin tasks.',
    },
    companionReplies: [
      {
        id: 'bur-c1',
        prompt: 'How do I reduce teacher burnout?',
        triggerKeywords: ['teacher burnout', 'reduce burnout', 'teacher stress'],
        summary: 'Start with workload redistribution and protected co-planning routines.',
        steps: [
          'Redistribute one high-load reporting task this week.',
          'Protect one co-planning slot for all teachers.',
          'Run a monthly 3-question wellbeing pulse.',
        ],
        linkedInsightIds: ['bur-1', 'bur-4'],
        linkedRecommendationIds: ['bur-r3', 'bur-r4'],
      },
      {
        id: 'bur-c2',
        prompt: 'What worked in similar schools?',
        triggerKeywords: ['what worked', 'similar schools', 'examples'],
        summary: 'Schools improved morale through protected planning and recognition pulses.',
        steps: [
          'Pilot weekly 45-minute co-planning.',
          'Add a 10-minute recognition pulse each Friday.',
          'Review fatigue signals every month.',
        ],
        linkedInsightIds: ['bur-2', 'bur-3'],
        linkedRecommendationIds: ['bur-r1', 'bur-r2'],
      },
    ],
    suggestedQuestions: ['How do I reduce teacher burnout?', 'What worked in similar schools?', 'How can a school leader support stressed teachers quickly?'],
    programDraft: {
      challengeStatement: 'Teacher fatigue and workload imbalance are affecting instructional quality.',
      objective: 'Improve teacher wellbeing through workload redesign and collaborative support structures.',
      targetGroup: 'Teachers and school leaders in high-load schools',
      keyActivities: 'Task redistribution, protected planning slots, monthly wellbeing pulse',
      indicators: 'Teacher energy score, after-hours planning time, staff retention intent',
    },
  },
  community: {
    label: 'Community disengagement',
    accentClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    captureOptions: {
      where: ['Schools with low parent meeting turnout', 'Communities with limited trust in school process', 'Villages with irregular school-management committee participation'],
      who: ['Parents of first-generation learners', 'Community volunteers with low role clarity', 'School leaders receiving limited community feedback'],
      tried: ['General invitation notices', 'One-time awareness events', 'SMS reminders for meetings'],
    },
    summaryTemplate: ({ where, who, tried }) =>
      `In ${where}, community participation from ${who} is low. Existing actions (${tried}) are not creating sustained engagement. The school needs ongoing, role-based collaboration with families and local actors.`,
    keyPatterns: [
      'Participation increases when meetings focus on child learning evidence, not announcements.',
      'Parents engage more when communication is local-language and personal.',
      'Community volunteers are willing but unclear about contribution pathways.',
    ],
    rootCauses: [
      {
        title: 'Low clarity on community roles',
        description: 'Parents and volunteers do not see specific, actionable ways to contribute.',
      },
      {
        title: 'One-way communication style',
        description: 'Most outreach informs families but does not invite co-creation.',
      },
      {
        title: 'Limited trust-building routines',
        description: 'School-community touchpoints are infrequent and event-driven.',
      },
    ],
    insights: [
      {
        id: 'com-1',
        title: 'Parents respond better to child-specific updates',
        description: 'Generic notices have low turnout; targeted updates increase participation.',
        tags: ['Communication', 'Parent agency'],
        cluster: 'School-home relationship',
      },
      {
        id: 'com-2',
        title: 'Meeting timing excludes daily-wage families',
        description: 'Standard meeting hours conflict with work schedules.',
        tags: ['Access', 'Inclusion'],
        cluster: 'Participation barriers',
      },
      {
        id: 'com-3',
        title: 'Local champions can mobilize peer families',
        description: 'Women/youth leaders improve turnout through trusted outreach.',
        tags: ['Community leadership', 'Mobilization'],
        cluster: 'Participation enablers',
      },
      {
        id: 'com-4',
        title: 'Feedback is collected but not closed-looped',
        description: 'Parents share concerns but rarely hear what changed afterward.',
        tags: ['Accountability', 'Trust'],
        cluster: 'School-home relationship',
      },
    ],
    recommendations: [
      {
        id: 'com-r1',
        section: 'whatOthersDid',
        title: 'Learning showcase circles',
        description: 'Monthly circles where students demonstrate progress to families.',
        details:
          'Schools converted parent meetings into student-led showcases with evidence boards. Attendance improved because parents could directly see learning outcomes.',
        tags: ['Parent engagement', 'Student voice'],
        linkedInsightIds: ['com-1'],
      },
      {
        id: 'com-r2',
        section: 'whatOthersDid',
        title: 'Community champion outreach',
        description: 'Trusted local leaders co-hosted small neighborhood meetings.',
        details:
          'Women and youth leaders co-facilitated 20-minute neighborhood huddles in local language, boosting trust and committee participation.',
        tags: ['Mobilization', 'Local leadership'],
        linkedInsightIds: ['com-3'],
      },
      {
        id: 'com-r3',
        section: 'tryThisNext',
        title: 'Shift one parent meeting to flexible timing',
        description: 'Pilot two alternate slots to include daily-wage families.',
        details:
          'Offer one early-morning and one evening slot this month. Compare turnout with regular timing and adapt the schedule.',
        tags: ['Inclusion', 'Micro-experiment'],
        linkedInsightIds: ['com-2'],
      },
      {
        id: 'com-r4',
        section: 'tryThisNext',
        title: 'Publish feedback-to-action board',
        description: 'Show what concerns were raised and what was done.',
        details:
          'Create a visible feedback tracker with three columns: raised, action taken, and next review date. Update every two weeks.',
        tags: ['Trust', 'Accountability'],
        linkedInsightIds: ['com-4'],
      },
      {
        id: 'com-r5',
        section: 'resources',
        title: 'Parent Partnership Playbook',
        description: 'Practical guide for ongoing school-home collaboration.',
        details: 'Includes outreach scripts, meeting formats, and role cards for parents and volunteers.',
        tags: ['Playbook', 'Community'],
        linkedInsightIds: ['com-1', 'com-3'],
      },
      {
        id: 'com-r6',
        section: 'resources',
        title: 'Feedback Closure Template',
        description: 'Simple board to close loop on community suggestions.',
        details: 'Template for issue tracking, action ownership, and visible progress communication.',
        tags: ['Template', 'Governance'],
        linkedInsightIds: ['com-4'],
      },
    ],
    defaultPlan: {
      smallAction: 'Host one flexible-timing parent huddle with student learning showcase this month.',
      expectedOutcome: 'Parent turnout and participation increase, especially from previously absent groups.',
      timeline: '1 month',
      successSignal: 'Meeting attendance and feedback submissions increase by at least 25%.',
      supportNeeded: 'Community volunteer co-facilitation and local-language outreach support.',
    },
    companionReplies: [
      {
        id: 'com-c1',
        prompt: 'How do I improve community participation?',
        triggerKeywords: ['community participation', 'community engagement', 'parents not coming'],
        summary: 'Use targeted outreach and child-learning focused meetings with flexible timing.',
        steps: [
          'Send child-specific invite messages, not generic notices.',
          'Pilot two flexible meeting slots this month.',
          'Close the loop publicly on parent feedback.',
        ],
        linkedInsightIds: ['com-1', 'com-2', 'com-4'],
        linkedRecommendationIds: ['com-r1', 'com-r3', 'com-r4'],
      },
      {
        id: 'com-c2',
        prompt: 'What worked in similar schools?',
        triggerKeywords: ['what worked', 'similar schools', 'examples'],
        summary: 'Neighborhood huddles led by local champions consistently improved trust and turnout.',
        steps: [
          'Identify two trusted local champions.',
          'Run short local-language huddles in neighborhoods.',
          'Feed concerns into a public feedback-action board.',
        ],
        linkedInsightIds: ['com-3', 'com-4'],
        linkedRecommendationIds: ['com-r2', 'com-r4'],
      },
    ],
    suggestedQuestions: ['How do I improve community participation?', 'What worked in similar schools?', 'How do we rebuild trust with families?'],
    programDraft: {
      challengeStatement: 'Families and community actors are not consistently engaged in school improvement.',
      objective: 'Strengthen school-community partnership through inclusive outreach and visible accountability loops.',
      targetGroup: 'Parents, community volunteers, and school leadership teams',
      keyActivities: 'Flexible huddles, local champion outreach, feedback-to-action tracking',
      indicators: 'Parent turnout, volunteer participation, feedback closure rate',
    },
  },
}
