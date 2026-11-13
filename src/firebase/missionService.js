import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  getDoc 
} from 'firebase/firestore';
import { db } from './config';

// 12 Exploration Areas for Permanent Mission Lab
export const EXPLORATION_AREAS = [
  { id: 1, title: 'Understanding Obesity & Preventive Health', icon: 'HeartPulse', desc: 'Biological, metabolic, and clinical drivers of obesity and lifestyle disorders in India.' },
  { id: 2, title: 'Target Population Segments', icon: 'Users', desc: 'Sedentary corporate workers, postpartum mothers, youth, diabetics, and middle-aged urban professionals.' },
  { id: 3, title: 'Behavioural & Environmental Factors', icon: 'Compass', desc: 'Dietary habits, food culture, sleep disruption, chronic stress, sedentariness, and social cues.' },
  { id: 4, title: 'Scalable Education & Habit Systems', icon: 'Layers', desc: 'Micro-learning, WhatsApp nudges, vernacular health education, and automated habit loops.' },
  { id: 5, title: 'Individual Coaching & Cohort Programs', icon: 'Target', desc: '1-on-1 personalized mentorship, transformative 90-day cohorts, and peer accountability circles.' },
  { id: 6, title: 'Corporate Wellness & Employee Health', icon: 'Briefcase', desc: 'Workplace ergonomics, cafeteria audits, executive metabolic health, and B2B health challenges.' },
  { id: 7, title: 'Schools, Communities & Family Health', icon: 'Home', desc: 'Parental nutrition education, school activity mandates, and grassroots community health drives.' },
  { id: 8, title: 'Tech Platforms & AI-Assisted Coaching', icon: 'Cpu', desc: 'Personalized meal tracking, biomarker integrations, predictive relapse warnings, and AI triage.' },
  { id: 9, title: 'Coach Certification & Development', icon: 'Award', desc: 'Creating certified lifestyle coaches to scale the ReshapeNation impact nationwide.' },
  { id: 10, title: 'Healthcare & Institutional Partnerships', icon: 'Building2', desc: 'Collaborations with preventive cardiologists, bariatricians, diagnostic labs, and hospitals.' },
  { id: 11, title: 'Public Health Research & Policy', icon: 'Landmark', desc: 'Collaborating with public health institutes, ICMR data, and preventive policy recommendations.' },
  { id: 12, title: 'Population-Scale Impact Measurement', icon: 'TrendingUp', desc: 'Tracking aggregate weight loss, HbA1c reductions, medication de-escalation, and QALY metrics.' }
];

// Initial Exploration Cards for Mission Lab
export const INITIAL_EXPLORATION_CARDS = [
  {
    id: 'exp-1',
    areaId: 1,
    title: 'Visceral Adiposity & Metabolic Dysregulation in Urban Indians',
    idea: 'Target "Thin-Fat Indian" phenotype with visceral fat education rather than only BMI.',
    problemBeingSolved: 'Many Indians have "normal" BMI but dangerous visceral adiposity and high insulin resistance.',
    targetPopulation: 'Urban working professionals aged 25–48 with sedentary desk jobs.',
    proposedSolution: 'Waist-to-height ratio & DEXA-informed awareness campaign coupled with low-glycemic Indian meal protocols.',
    hypothesis: 'If people understand visceral fat risks vs vanity weight, consultation conversion will double.',
    evidenceAndLinks: 'ICMR-INDIAB national study, Lancet Diabetes & Endocrinology Indian phenotype data.',
    costAndResources: 'Low cost: speaking slides, infographic assets, free waist-to-height calculator.',
    potentialImpact: 'High: shifts mindset from quick crash diets to lifelong metabolic health.',
    businessViability: 'Premium positioning for ReshapeNation as evidence-based metabolic health authority.',
    experimentsToValidate: 'Run 1 webinar explaining visceral fat; measure consultation request rate.',
    currentStatus: 'testing',
    nextDecision: 'Create a 3-minute video breakdown of waist-to-height ratio for LinkedIn & WhatsApp.'
  },
  {
    id: 'exp-2',
    areaId: 6,
    title: 'Executive Energy & Metabolic Rejuvenation for IT/Tech Teams',
    idea: 'B2B Corporate Wellness Workshops leading into sponsored executive coaching.',
    problemBeingSolved: 'Tech leads suffer from 3 PM energy crashes, high cortisol, and poor sleep leading to obesity.',
    targetPopulation: 'Software companies, tech startups, and remote teams in Pune, Bangalore & Mumbai.',
    proposedSolution: '90-Minute "Peak Energy & Metabolic Focus" interactive keynote + 14-day hydration & step challenge.',
    hypothesis: 'Speaking to tech teams will yield at least 3-5 high-intent personal coaching clients per workshop.',
    evidenceAndLinks: 'Corporate wellness ROI studies (Harvard Business Review, ASSOCHAM India report).',
    costAndResources: 'Zero capital; requires speaking pitch deck and proposal template.',
    potentialImpact: 'Massive B2B pipeline and recurring B2C conversion pipeline.',
    businessViability: 'High: B2B workshop fees (₹25k-₹50k) plus high-ticket 1-on-1 coaching conversions.',
    experimentsToValidate: 'Deliver 1 free or paid session to a tech firm during the ₹1L campaign.',
    currentStatus: 'testing',
    nextDecision: 'Pitch 3 founder contacts for a team health talk before Nov 18, 2026.'
  },
  {
    id: 'exp-3',
    areaId: 5,
    title: 'ReshapeNation 90-Day Metabolic Transformation Cohort',
    idea: 'Small cohort (10-15 people) with daily accountability, weekly live calls, and personalized meal adaptations.',
    problemBeingSolved: 'Gym memberships have 80% dropout; people need daily behavioural scaffolding, not just a workout plan.',
    targetPopulation: 'Busy professionals struggling with consistency and rebound weight gain.',
    proposedSolution: 'Structured 12-week transformation path with weekly milestones, habit tracking, and mindset coaching.',
    hypothesis: 'Pricing at ₹15,000–₹25,000 per person will achieve high completion rates and immediate word-of-mouth.',
    evidenceAndLinks: 'Cohort-based learning completion rates (85% vs 5% for self-paced courses).',
    costAndResources: 'Coaching time, WhatsApp community, onboarding intake form.',
    potentialImpact: 'Life-changing results: 6-12 kg sustainable weight loss and normalized biomarkers.',
    businessViability: 'Core engine for ₹1L - ₹5L monthly revenue with high margins.',
    experimentsToValidate: 'Enroll first 5 cohort members during the Speak to Impact campaign.',
    currentStatus: 'validated',
    nextDecision: 'Finalize cohort curriculum outline and 1-page offer document.'
  },
  {
    id: 'exp-4',
    areaId: 8,
    title: 'AI Companion for Real-time Indian Food Portion Coaching',
    idea: 'Voice/photo enabled WhatsApp AI coach trained on regional Indian cuisine variations.',
    problemBeingSolved: 'Western food tracking apps (MyFitnessPal) fail miserably on Indian gravies, thalis, and rotis.',
    targetPopulation: 'ReshapeNation coaching alumni and busy executives.',
    proposedSolution: 'Lightweight Gemini API powered WhatsApp bot providing instant mindful adjustments.',
    hypothesis: 'Instant feedback on regional meals increases nutrition compliance from 40% to 85%.',
    evidenceAndLinks: 'Behavioral adherence studies with real-time feedback loops.',
    costAndResources: 'Firebase Cloud Functions + Gemini API (low serverless cost).',
    potentialImpact: 'Scales ReshapeNation from hundreds to tens of thousands across India.',
    businessViability: 'SaaS subscription (₹499/mo) or value-add retention tool for premium coaching.',
    experimentsToValidate: 'Prototype AI food analysis prompts with Gemini in LifeOS chat.',
    currentStatus: 'draft',
    nextDecision: 'Build prompt prototype in Phase 3 AI Specialist integration.'
  }
];

// Strategic Business Models Comparison
export const BUSINESS_MODELS = [
  {
    name: '1-on-1 High-Ticket VIP Coaching',
    ticketSize: '₹35,000 – ₹75,000 / 3 Months',
    reach: 'Low (10–20 clients/mo)',
    margins: 'Very High (90%+)',
    operationalComplexity: 'Medium (High coach time)',
    impactPerPerson: 'Transformational',
    pros: 'Instant cashflow, deep testimonials, validates core methodology',
    cons: 'Limited by personal time',
    strategicFit: 'Immediate focus for Speak to Impact challenge'
  },
  {
    name: '90-Day Cohort Transformations',
    ticketSize: '₹12,000 – ₹25,000 / Member',
    reach: 'Medium (30–100 members/quarter)',
    margins: 'High (80%+)',
    operationalComplexity: 'Medium-Low',
    impactPerPerson: 'High (Peer energy & accountability)',
    pros: 'Scalable leverage, community camaraderie, predictable launches',
    cons: 'Requires scheduled marketing bursts',
    strategicFit: 'Primary scale model for Q1 2027'
  },
  {
    name: 'Corporate Wellness & Keynotes',
    ticketSize: '₹25,000 – ₹1,50,000 / Engagement',
    reach: 'High (100–1,000 employees/talk)',
    margins: 'High (85%+)',
    operationalComplexity: 'Low',
    impactPerPerson: 'Broad Awareness + B2C Pipeline',
    pros: 'Direct monetization of speaking strength, access to high-earning clients',
    cons: 'Corporate procurement cycles can take 2–6 weeks',
    strategicFit: 'Core vehicle to leverage "People enjoy listening when I speak"'
  },
  {
    name: 'Coach Certification Academy',
    ticketSize: '₹50,000 – ₹1,00,000 / Certification',
    reach: 'Exponential (Train 100 coaches to touch 10,000 lives)',
    margins: 'High (75%+)',
    operationalComplexity: 'High',
    impactPerPerson: 'Movement Level (True Obesity-Free India scale)',
    pros: 'Transforms ReshapeNation into an industry standard & institution',
    cons: 'Requires proven playbook, accreditation, and operational team',
    strategicFit: '5-Year Vision Milestone'
  }
];

// 8-Tier Connected Goal Architecture Seed Data
export const CONNECTED_GOAL_HIERARCHY = {
  lifetimeMission: {
    title: 'Obesity-Free India',
    vision: 'A nation where preventive health, metabolic vitality, and sustainable nutrition are accessible, celebrated, and lived by every Indian family.',
    primaryVehicle: 'ReshapeNation',
    targetHorizon: '2026 – 2040'
  },
  fiveYearDirection: {
    title: 'Empower 10,000 Engineers to Transform Their Health',
    timeframe: '2026 – 2031',
    strategicPillars: [
      'Evidence-based lifestyle behaviour modification platform',
      'National network of 500+ certified ReshapeNation wellness mentors',
      'Corporate partnerships with 50+ leading enterprises',
      'AI-powered personalized lifestyle adherence companion'
    ]
  },
  annualGoal: {
    year: '2026–2027',
    title: 'Lay ReshapeNation Foundation: ₹50 Lakhs Revenue & 1,000 Active Transformations',
    status: 'In Progress',
    progress: 0
  },
  quarterlyObjective: {
    quarter: 'Q4 2026 (Oct – Dec)',
    title: 'Master Speaking-to-Coaching Funnel & Achieve ₹10 Lakhs in Quarterly Revenue',
    status: 'Active',
    progress: 0
  },
  monthlyMilestone: {
    month: 'November 2026',
    title: 'Complete Speak to Impact ₹1 Lakh Challenge & Validate High-Ticket Health Conversion',
    status: 'In Progress',
    progress: 0
  },
  weeklyCampaignId: 'campaign-speak-to-impact-1lakh'
};

// Life Vision Pillars
export const LIFE_VISION_PILLARS = [
  { id: 'mission', title: 'Mission & Contribution', priority: 'Primary', status: 'Baseline not set — review this pillar', score: 0, color: 'text-amber-400' },
  { id: 'health', title: 'Health & Fitness', priority: 'High', status: 'Baseline not set — review this pillar', score: 0, color: 'text-emerald-400' },
  { id: 'business', title: 'Business & Career', priority: 'High', status: 'Baseline not set — review this pillar', score: 0, color: 'text-blue-400' },
  { id: 'wealth', title: 'Wealth & Finances', priority: 'Medium', status: 'Baseline not set — review this pillar', score: 0, color: 'text-yellow-400' },
  { id: 'relationships', title: 'Family & Relationships', priority: 'Medium', status: 'Baseline not set — review this pillar', score: 0, color: 'text-rose-400' },
  { id: 'learning', title: 'Learning & Growth', priority: 'High', status: 'Baseline not set — review this pillar', score: 0, color: 'text-purple-400' },
  { id: 'mindset', title: 'Personal Development', priority: 'High', status: 'Baseline not set — review this pillar', score: 0, color: 'text-indigo-400' },
  { id: 'happiness', title: 'Experiences & Happiness', priority: 'Medium', status: 'Baseline not set — review this pillar', score: 0, color: 'text-teal-400' }
];

// Active Campaign: Speak to Impact — ₹1 Lakh Challenge (12 Nov 2026 – 20 Nov 2026)
export const INITIAL_CAMPAIGN = {
  id: 'campaign-speak-to-impact-1lakh',
  name: 'SPEAK TO IMPACT — ₹1 LAKH CHALLENGE',
  startDate: '2026-11-12',
  endDate: '2026-11-20',
  targetRevenue: 100000,
  category: 'ReshapeNation Business Development',
  hypothesis: 'People enjoy listening when I speak. Can I convert this communication strength into meaningful health conversations, qualified leads, coaching customers and ₹1 lakh in collected revenue?',
  
  financials: {
    collected: 0,
    committed: 0,
    outstanding: 0,
    pipeline: 0,
    salesCount: 0,
    avgRevenuePerCustomer: 0,
    pricingScenarios: [
      { name: 'VIP Mentorship', price: 25000, targetCount: 4, label: '4 clients @ ₹25,000 = ₹1,00,000' },
      { name: 'Hybrid Cohort', price: 15000, targetCount: 7, label: '7 clients @ ₹15,000 = ₹1,05,000' },
      { name: 'Corporate Workshop + Coaching', price: 50000, targetCount: 2, label: '2 engagements @ ₹50,000 = ₹1,00,000' }
    ]
  },

  activity: {
    conversations: 0,
    speakingOpportunities: 0,
    audienceReached: 0,
    contentPublished: 0,
    qualifiedProspects: 0,
    consultationsBooked: 0,
    consultationsCompleted: 0,
    proposalsSent: 0,
    followUpsDone: 0
  },

  learnings: {
    topicsAttractingAttention: [
      'Why BMI lies: The truth about visceral fat in South Asians',
      'How to end 3 PM sugar cravings without giving up Indian food',
      'The 15-minute daily habit stack that reverses metabolic sluggishness'
    ],
    questionsPeopleAsk: [
      'Can I lose weight without giving up roti and rice?',
      'How do I maintain diet consistency during client dinners and travel?',
      'How does ReshapeNation differ from traditional dietitian diet charts?'
    ],
    commonObjections: [
      '"I don\'t have 1 hour a day to cook special meals or exercise"',
      '"I\'ve tried multiple diets before and regained all the weight"',
      '"Let me think about it and start next month"'
    ],
    audiencePainPoints: [
      'Chronic afternoon fatigue and brain fog impacting work',
      'Stomach bloating and acidity after routine meals',
      'Anxiety over rising blood sugar, uric acid, and fatty liver reports'
    ],
    consultationMessagesThatWork: [
      '"Let\'s do a 20-minute metabolic blueprint call—no selling, just diagnosing why your past diets rebound."',
      '"Share your last blood report and typical daily meal timings; I\'ll pinpoint your exact 3 metabolic bottlenecks."'
    ],
    offersThatConvert: [
      'The 90-Day ReshapeNation Metabolic Reset with weekly blood sugar / biomarker checkpoint guarantees.'
    ]
  },

  dailyQuestsSchedule: [
    {
      day: 1,
      date: '2026-11-12',
      title: 'Campaign Kickoff & 10 Personal Outreach Messages',
      desc: 'Reach out to 10 high-warmth contacts with personal audio note about the Obesity-Free India mission and offering a free 20-min metabolic audit.',
      priority: 'urgent',
      durationMins: 45,
      xp: 120,
      approved: true,
      completed: false,
      category: 'Business Development'
    },
    {
      day: 2,
      date: '2026-11-13',
      title: 'Publish High-Impact Video: "Why BMI Lies to Urban Indians"',
      desc: 'Deliver a powerful 90-second video on visceral fat and metabolic health; add call-to-action for 3 free consultation slots.',
      priority: 'high',
      durationMins: 60,
      xp: 150,
      approved: true,
      completed: false,
      category: 'Speaking & Content'
    },
    {
      day: 3,
      date: '2026-11-14',
      title: 'Conduct 3 Diagnostic Health Consultations',
      desc: 'Run 20-minute structured discovery sessions focused on deep pain points, energy levels, and lifestyle friction.',
      priority: 'urgent',
      durationMins: 90,
      xp: 180,
      approved: true,
      completed: false,
      category: 'Consultations'
    },
    {
      day: 4,
      date: '2026-11-15',
      title: 'Present 2 Custom Coaching Proposals & Close First Payment',
      desc: 'Deliver tailored 90-day roadmap proposals to the 2 highest-intent prospects and secure initial commitment.',
      priority: 'urgent',
      durationMins: 60,
      xp: 200,
      approved: true,
      completed: false,
      category: 'Sales & Closing'
    },
    {
      day: 5,
      date: '2026-11-16',
      title: 'Host Live Sunday Interactive Masterclass: "Reshaping India\'s Health"',
      desc: '45-minute live interactive session on Zoom / LinkedIn; direct conversion pitch for 5 cohort seats.',
      priority: 'urgent',
      durationMins: 90,
      xp: 250,
      approved: true,
      completed: false,
      category: 'Speaking & Masterclass'
    },
    {
      day: 6,
      date: '2026-11-17',
      title: 'Follow Up with All Masterclass Attendees & Handle Objections',
      desc: 'Send personalized voice notes addressing time and diet fears; schedule second batch of consultations.',
      priority: 'high',
      durationMins: 45,
      xp: 130,
      approved: false,
      completed: false,
      category: 'Follow-ups'
    },
    {
      day: 7,
      date: '2026-11-18',
      title: 'Corporate Wellness Outreach to 3 Tech Founders',
      desc: 'Propose a 60-minute executive vitality session for remote software engineering teams.',
      priority: 'high',
      durationMins: 45,
      xp: 140,
      approved: false,
      completed: false,
      category: 'B2B Wellness'
    },
    {
      day: 8,
      date: '2026-11-19',
      title: 'Revenue Sprint: Final Consultation Round & Payment Collection',
      desc: 'Collect commitments, send payment links, and confirm onboarding for newly enrolled ReshapeNation members.',
      priority: 'urgent',
      durationMins: 60,
      xp: 220,
      approved: false,
      completed: false,
      category: 'Finance & Closing'
    },
    {
      day: 9,
      date: '2026-11-20',
      title: 'Campaign Debrief, Revenue Reconciliation & Celebration',
      desc: 'Audit ₹1 Lakh financial realization, log customer learnings, and extract lessons for the next campaign.',
      priority: 'high',
      durationMins: 45,
      xp: 150,
      approved: false,
      completed: false,
      category: 'Review & Strategy'
    }
  ]
};

// Initial Dynamic Daily Quests — editable starter missions; no actions are pre-completed.
export const INITIAL_DAILY_QUESTS = [
  {
    id: 'quest-top-1',
    title: 'Lead 2 High-Ticket Health Consultations for ReshapeNation',
    description: 'Diagnose metabolic habits, uncover emotional drivers of eating, present 90-day reset plan.',
    category: 'Business Development',
    campaignId: 'campaign-speak-to-impact-1lakh',
    goalId: 'annual-goal-1',
    tier: 'top3',
    priority: 'urgent',
    durationMins: 60,
    dueDate: new Date().toISOString().slice(0,10),
    startTime: '16:00',
    endTime: '17:00',
    status: 'todo',
    xp: 150,
    completed: false
  },
  {
    id: 'quest-top-2',
    title: 'Publish Video on South Asian Visceral Fat & 3-Step Action Plan',
    description: 'Record & post authentic 90s reel on why standard BMI fails Indians. Add CTA for diagnostic audits.',
    category: 'Speaking & Influence',
    campaignId: 'campaign-speak-to-impact-1lakh',
    goalId: 'annual-goal-1',
    tier: 'top3',
    priority: 'urgent',
    durationMins: 45,
    dueDate: new Date().toISOString().slice(0,10),
    startTime: '11:30',
    endTime: '12:15',
    status: 'todo',
    xp: 140,
    completed: false
  },
  {
    id: 'quest-top-3',
    title: 'Complete 45-Minute Heavy Strength Training & Mobility Session',
    description: 'Compound lifts (Squat, Overhead Press) + 15m hip & thoracic mobility. Lead by example.',
    category: 'Health & Fitness',
    campaignId: null,
    goalId: 'health-fitness',
    tier: 'top3',
    priority: 'high',
    durationMins: 45,
    dueDate: new Date().toISOString().slice(0,10),
    startTime: '07:30',
    endTime: '08:15',
    status: 'todo',
    xp: 120,
    completed: false
  },
  {
    id: 'quest-supp-1',
    title: 'Review Financial Pipeline: Verify ₹25k Collected & Follow Up on ₹15k Outstanding',
    description: 'Check bank reconciliations, send polite payment reminder, and update dashboard.',
    category: 'Finance',
    campaignId: 'campaign-speak-to-impact-1lakh',
    tier: 'supporting',
    priority: 'high',
    durationMins: 20,
    dueDate: new Date().toISOString().slice(0,10),
    status: 'todo',
    xp: 80,
    completed: false
  },
  {
    id: 'quest-supp-2',
    title: 'Read 20 Pages of "Atomic Habits & Behaviour Architecture"',
    description: 'Focus on environmental friction reduction for client meal compliance.',
    category: 'Learning',
    tier: 'supporting',
    priority: 'medium',
    durationMins: 30,
    dueDate: new Date().toISOString().slice(0,10),
    status: 'todo',
    xp: 70,
    completed: false
  },
  {
    id: 'quest-growth-1',
    title: 'Personal Growth Challenge: Radical Candor & Active Presence in Difficult Conversations',
    description: 'Catch yourself before defensive reactions. Ask one thoughtful clarifying question instead of asserting a point.',
    category: 'Mindset',
    tier: 'growth_challenge',
    priority: 'high',
    durationMins: 15,
    dueDate: new Date().toISOString().slice(0,10),
    status: 'todo',
    xp: 100,
    completed: false
  }
];

// Evening Reflection Template
export const INITIAL_EVENING_REFLECTION = {
  date: new Date().toISOString().slice(0,10),
  accomplished: '',
  habitsMaintained: '',
  learned: '',
  preventedProgress: '',
  tomorrowPriorities: '',
  rating: 0
};

// =========================================================================
// DAILY 3-TIME RITUALS & YOUTUBE PLAYER SYSTEM
// =========================================================================
export const DAILY_REMINDERS = [
  {
    id: 'morning_prime',
    slotName: 'Morning Prime & State Lock',
    time: '07:00 IST',
    theme: 'Warrior Awakening & Clarity',
    quote: 'The warrior wins the battle in his mind before stepping onto Kurukshetra.',
    featuredVideo: {
      title: 'Andrew Huberman: The Optimal Morning Routine for Focus & Dopamine',
      videoId: 'gXDMoiEkyu8',
      url: 'https://www.youtube.com/watch?v=gXDMoiEkyu8',
      channel: 'Huberman Lab',
      duration: '14 min',
      whyWatch: 'Lock in morning circadian rhythms and prime alertness for the ₹1L Challenge.'
    },
    checklist: [
      { text: 'Drink 500ml cold water + electrolytes', done: false },
      { text: 'Review The Core Three quests of today', done: false },
      { text: '10 min mobility or brisk walk outside in sunlight', done: false },
      { text: 'Play morning mindset video & set state', done: false }
    ]
  },
  {
    id: 'afternoon_momentum',
    slotName: 'Midday Momentum & Reset',
    time: '14:00 IST',
    theme: 'Overcoming Sluggishness & Speaking Drive',
    quote: 'Energy flows where focus goes. Destroy the 3 PM metabolic slump.',
    featuredVideo: {
      title: 'How to Speak with Magnetic Presence & Command Attention',
      videoId: 'Lp7E973zozc',
      url: 'https://www.youtube.com/watch?v=Lp7E973zozc',
      channel: 'Charisma & Leadership',
      duration: '11 min',
      whyWatch: 'Sharpen your vocal clarity and diagnostic presence before afternoon consultations.'
    },
    checklist: [
      { text: 'Step away from screen for 5 minutes', done: false },
      { text: 'Log morning conversation metrics in ₹1L funnel', done: false },
      { text: 'Send 3 afternoon outreach voice notes', done: false },
      { text: 'Hydrate & do 15 air squats', done: false }
    ]
  },
  {
    id: 'evening_reflection',
    slotName: 'Night Debrief & Stoic Wind-Down',
    time: '21:30 IST',
    theme: 'Accountability, Wins & Restorative Peace',
    quote: 'Review what was done, what was avoided, and what wisdom was earned.',
    featuredVideo: {
      title: 'Stoic Evening Wind-Down: Marcus Aurelius on Radical Self-Mastery',
      videoId: 'WPni755-Krg',
      url: 'https://www.youtube.com/watch?v=WPni755-Krg',
      channel: 'Daily Stoic',
      duration: '12 min',
      whyWatch: 'Unplug cortisol, log honest learnings, and prepare restful recovery.'
    },
    checklist: [
      { text: 'Log completed quests and collect XP', done: false },
      { text: 'Reconcile money collected & committed', done: false },
      { text: 'Fill out Evening Reflection prompts', done: false },
      { text: 'No blue light 45 min before sleep', done: false }
    ]
  }
];

// Curated Video Library for Growth & ReshapeNation
export const CURATED_VIDEOS = [
  {
    id: 'v1',
    category: 'Obesity & Metabolic Science',
    title: 'The "Thin-Fat Indian" Phenotype: Why Normal BMI Fails South Asians',
    videoId: '30VMIEmA114',
    channel: 'Metabolic India',
    duration: '18 min',
    desc: 'Clinical breakdown of visceral fat accumulation, hepatic steatosis, and insulin resistance in Indians.'
  },
  {
    id: 'v2',
    category: 'Speaking & Influence',
    title: 'How to Turn Any Conversation into a High-Ticket Client Consultation',
    videoId: 'arj7oStGLkU',
    channel: 'High Performance Coaching',
    duration: '16 min',
    desc: 'The consultative discovery framework: diagnosing pain instead of aggressive sales pitching.'
  },
  {
    id: 'v3',
    category: 'Discipline & Warrior Mindset',
    title: 'Mahabharata Wisdom: The Science of Unwavering Focus (Ekagrata)',
    videoId: '7Xflg1gM5V0',
    channel: 'Vedic Philosophy & Strategy',
    duration: '22 min',
    desc: 'Arjuna\'s target eye focus applied to modern entrepreneurial execution and self-discipline.'
  },
  {
    id: 'v4',
    category: 'Focus & Soundscapes',
    title: '432Hz Deep Focus & Alpha Wave Flow State for High-Leverage Work',
    videoId: 'bYQx7X9Gv5A',
    channel: 'Mind Wave Laboratory',
    duration: '60 min',
    desc: 'Binaural soundscape to eliminate mind chatter and lock in 90-minute deep work sprints.'
  }
];

// =========================================================================
// MOOD SANCTUARY & MINDSET ORACLE
// =========================================================================
export const MOOD_PRESETS = [
  {
    id: 'overwhelmed',
    label: 'Overwhelmed',
    sublabel: 'Too many tabs in mind',
    emoji: '⚡',
    themeColor: 'from-amber-500 to-yellow-600',
    funLine: "Bhai, relax! Even Arjuna had his Gandiva bow slipping from his trembling hand in Chapter 1 of Mahabharata before Lord Krishna told him to breathe and take it one arrow at a time. The world isn't collapsing in the next 10 minutes. Drop the 47 open browser tabs in your brain!",
    tacticalFix: "The 2-Minute Brain Dump: Grab a blank paper right now. Write down the 3 things shouting the loudest in your head. Cross out 2. Do the remaining one for just 5 minutes.",
    videoId: '30VMIEmA114',
    soundscape: 'rain_ambient',
    rescueQuest: {
      title: 'Take 5 Box Breaths & Complete 1 Micro-Action',
      desc: 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Then pick 1 single small task and finish it.',
      durationMins: 5,
      xp: 60
    }
  },
  {
    id: 'sluggish',
    label: 'Sluggish / 3 PM Slump',
    sublabel: 'Heavy eyelids & brain fog',
    emoji: '🥱',
    themeColor: 'from-blue-500 to-cyan-600',
    funLine: "Your mitochondria just went on an unauthorized chai break! That's not laziness, that's blood sugar dropping or sitting like a statue for 4 hours. Time to reboot your biology, champion!",
    tacticalFix: "Stand up immediately. Down 400ml cold water. Do 15 bodyweight air squats right next to your desk. Splash cold water on your wrists and face.",
    videoId: 'bYQx7X9Gv5A',
    soundscape: 'epic_drums',
    rescueQuest: {
      title: '15 Desk Air Squats + 400ml Cold Water Rejuvenation',
      desc: 'Physical state shift to surge oxygen to the brain and resume work.',
      durationMins: 3,
      xp: 50
    }
  },
  {
    id: 'procrastinating',
    label: 'Procrastinating / Stuck',
    sublabel: 'Resisting high-value work',
    emoji: '🧱',
    themeColor: 'from-purple-500 to-indigo-600',
    funLine: "Ah, the legendary art of staring at a task and suddenly deciding your wardrobe needs urgent alphabetization! Let's make a deal: don't finish the whole proposal. Just open the document and type ONE ugly sentence.",
    tacticalFix: "The 'Micro-Start' Rule: Set a timer for 120 seconds. Work on the task until the timer dings. If you still hate it, you can quit. (Spoiler: 90% of the time, inertia breaks and you keep rolling).",
    videoId: 'arj7oStGLkU',
    soundscape: 'lofi_focus',
    rescueQuest: {
      title: 'Execute 120-Second Micro-Start on Top Task',
      desc: 'Break initial resistance by doing the smallest possible fraction of work.',
      durationMins: 2,
      xp: 75
    }
  },
  {
    id: 'anxious',
    label: 'Anxious / Self-Doubt',
    sublabel: 'Questioning abilities or outcome',
    emoji: '🌪️',
    themeColor: 'from-rose-500 to-red-600',
    funLine: "Impressionist painter of doom, aren't you? Your brain is writing Hollywood disaster scripts where nobody buys your coaching and everyone judges you. Newsflash: Everyone is too busy worrying about their own love handles to scrutinize your life! Speak with conviction.",
    tacticalFix: "Grounding Reality Check: Look at your track record. You know the metabolic truth about Indian obesity. Write down 1 reason why someone's life will genuinely improve because of your advice.",
    videoId: 'Lp7E973zozc',
    soundscape: 'deep_alpha',
    rescueQuest: {
      title: 'Review 1 Client Success & Send 1 Authentic Message',
      desc: 'Anchor back into genuine service and contribution.',
      durationMins: 10,
      xp: 80
    }
  },
  {
    id: 'unstoppable',
    label: 'Unstoppable / On Fire',
    sublabel: 'High dopamine & momentum',
    emoji: '🔥',
    themeColor: 'from-emerald-500 to-teal-600',
    funLine: "Boom! You're in beast mode! The stars are aligned, dopamine is singing, and the ₹1 Lakh challenge looks like light work. Don't waste this rare high on scrolling—put this raw thunder into closing a deal or shooting that viral video right NOW!",
    tacticalFix: "Direct Strike: Identify the single most lucrative or influential action you've been putting off. Attack it immediately while your momentum is at 100%.",
    videoId: '7Xflg1gM5V0',
    soundscape: 'epic_drums',
    rescueQuest: {
      title: 'Direct Strike: Close 1 Deal or Record 1 Viral Video',
      desc: 'Channel peak state into highest-revenue activity.',
      durationMins: 30,
      xp: 150
    }
  },
  {
    id: 'grateful',
    label: 'Grateful & Centered',
    sublabel: 'Deep inner calm and clarity',
    emoji: '🧘',
    themeColor: 'from-teal-500 to-emerald-600',
    funLine: "This is the supreme state of Dharma. When you realize that creating an Obesity-Free India isn't just about revenue—it's about giving Indian families more healthy years with their children and parents. Soak in this clarity.",
    tacticalFix: "Send a genuine 15-second 'Thank You' audio message to one person who supported you recently.",
    videoId: 'WPni755-Krg',
    soundscape: 'rain_ambient',
    rescueQuest: {
      title: 'Send 1 Heartfelt Gratitude Voice Note',
      desc: 'Strengthen relationships and cultivate abundance.',
      durationMins: 5,
      xp: 60
    }
  }
];

// =========================================================================
// THE LEGACY CHRONICLES (STORY WORLDS & CHAPTERS)
// =========================================================================
export const STORY_WORLDS = [
  {
    id: 'world_a',
    title: 'World A: The Warrior\'s Path',
    theme: 'Mahabharata Epic Themes',
    tagline: 'Focus, Discipline, Strategic Discernment & The Bow of Will',
    description: 'Walk the ancient forest academies and battlefields of Aryavarta. Learn how inner mastery, razor-sharp focus, and unwavering discipline turn mortal weakness into legendary triumph.',
    badge: 'Dharma Archer',
    color: 'from-amber-600 to-yellow-500',
    unlockedChapters: 2,
    totalChapters: 6,
    chapters: [
      {
        id: 'wa-ch1',
        number: 1,
        title: 'The Eye of the Golden Fish',
        status: 'unlocked',
        synopsis: 'Before the grand contest, Guru Dronacharya tests the disciples. While others see trees, branches, and sky, only the one with unbroken stillness sees only the eye.',
        content: `The twilight breeze rustled through the dense Sal trees outside Hastinapur. Guru Dronacharya placed a wooden fish high atop a swaying cedar branch.\n\n"Tell me, prince," Dronacharya asked the eldest, "what do you behold?"\n"I see the golden tree, the river behind it, and the sky above," came the proud answer.\n"Step down," the master said calmly.\n\nThen he summoned you.\n"Draw the string to your ear. What do you see?"\n\nYou take a single, deep breath. The wind, the chattering crowd, the forest canopy—all evaporate. In your vision, there is neither sky nor tree.\n\n"I see only the black pupil of the fish's eye, Acharya."\n"Release," the Guru smiled.\n\nThe arrow whistled true, striking the exact center. You learned that distraction is not an external condition; it is an internal choice. When your goal is singular, the universe narrows into the target.`,
        decisionQuestion: 'A comrade questions your intense focus, calling it rigid. How do you respond?',
        choices: [
          { text: 'Invite him to practice alongside you, sharing the breath technique.', consequence: 'Earned +50 Camaraderie XP and unlocked Leadership Insight.' },
          { text: 'Bow silently and return to your practice quiver without arguing.', consequence: 'Earned +50 Discipline XP and fortified inner silence.' }
        ]
      },
      {
        id: 'wa-ch2',
        number: 2,
        title: 'The Quiver That Never Empties',
        status: 'unlocked',
        synopsis: 'Facing impossible odds in the Virata forest, you discover that true endurance comes not from muscle, but from the unshakeable reason why you fight.',
        content: `Winter frost clung to the chariot wheels. The scouts reported fivefold enemy forces encamping along the eastern ridge.\n\nYour companion's hands trembled upon the reins. "Our supplies are sparse, and our arrows will be spent before the sun reaches its zenith. How can we prevail?"\n\nYou placed a firm hand upon his armored shoulder. "The archer who fights for his own vanity counts his arrows. But the archer who fights to protect the innocent is supplied by Dharma itself. Every breath you take in service of the truth is an arrow that cannot miss."\n\nAs the war horn echoed across the valley, a deep, diamond-hard calmness settled into your chest. You were ready for the campaign.`,
        decisionQuestion: 'The opposing commander sends an envoy offering a comfortable retreat. What is your stance?',
        choices: [
          { text: 'Reject the compromise; uphold your duty to the mission.', consequence: 'Earned +75 Resolve XP and unlocked Battle Standard.' },
          { text: 'Send back a proposal detailing terms of honorable resolution.', consequence: 'Earned +75 Strategy XP and unlocked Diplomatic Wisdom.' }
        ]
      },
      {
        id: 'wa-ch3',
        number: 3,
        title: 'The Chariot in the Whirlwind',
        status: 'locked',
        unlockRequirement: 'Collect ₹50,000 in Speak to Impact Campaign',
        synopsis: 'Navigating chaotic storms while keeping the wheel steady on the sacred path.'
      }
    ]
  },
  {
    id: 'world_b',
    title: 'World B: The Kingdom of Dharma',
    theme: 'Ramayana Inspired',
    tagline: 'Leadership, Duty, Sacrificial Devotion & Noble Governance',
    description: 'Explore the ideals of selfless leadership, relentless protection of the vulnerable, and the steadfast honor required to lead a people through trials of fire.',
    badge: 'Guardian of Dharma',
    color: 'from-orange-600 to-amber-600',
    unlockedChapters: 1,
    totalChapters: 6,
    chapters: [
      {
        id: 'wb-ch1',
        number: 1,
        title: 'The Vow Beyond Comfort',
        status: 'unlocked',
        synopsis: 'Leaving royal luxury behind to walk barefoot in the forest, proving that character is tested in adversity.',
        content: `The golden palaces of Ayodhya stood resplendent, yet your path lay outside the marble gates, toward the wild Dandaka forest.\n\n"Why surrender comfort when you could rule with ease?" the courtiers whispered.\n\nYou turned to face the sunrise over the Sarayu river. "A crown worn without hardship is merely hollow gold. A true leader must walk the dust, understand the suffering of the common man, and conquer the wilderness before he can heal a kingdom."\n\nWith every step into the wilderness, your purpose grew clearer: to serve something vastly larger than your own transient desires.`,
        decisionQuestion: 'In the forest, a village elder asks you to stay and govern their peaceful hamlet.',
        choices: [
          { text: 'Bless them, teach them sustainable self-defence, and continue your greater mission.', consequence: 'Earned +60 Duty XP.' },
          { text: 'Establish an alliance connecting them with neighboring safe havens.', consequence: 'Earned +60 Wisdom XP.' }
        ]
      },
      {
        id: 'wb-ch2',
        number: 2,
        title: 'The Bridge of Many Stones',
        status: 'locked',
        unlockRequirement: 'Complete 10 Consultations in Campaign',
        synopsis: 'How small, persistent contributions from every creature can cross the widest ocean.'
      }
    ]
  },
  {
    id: 'world_c',
    title: 'World C: The Future Forge',
    theme: 'Original Sci-Fi Superhero Universe',
    tagline: 'Synthetic Intelligence, Metabolic Enhancements & The Will of Steel',
    description: 'An original 2142 neo-cybernetic universe where rogue AI constructs control humanity\'s biology through synthetic dopamine addiction. You harness the bio-kinetic aegis to liberate human minds.',
    badge: 'Forge Pioneer',
    color: 'from-cyan-600 to-blue-600',
    unlockedChapters: 1,
    totalChapters: 6,
    chapters: [
      {
        id: 'wc-ch1',
        number: 1,
        title: 'The Signal in the Smog',
        status: 'unlocked',
        synopsis: 'Awakening in Neo-Vidarbha to discover that 90% of the populace has had their metabolic sovereignty hijacked by the Glucotox grid.',
        content: `Neon holographic banners cast purple shadows across the rain-slicked skyway of Neo-Vidarbha. The mega-monolith had introduced 'Soma-Zero'—a synthetic neural nutrient that promised infinite happiness while quietly degrading the human metabolic core.\n\nFrom the top of the transmission tower, your biomorphic HUD flashed an alert: cellular vitality across Sector 7 had plunged by 42%.\n\n"The grid wants them docile, sedentary, and numb," you said into your comm-link.\n"Our kinetic resonance capacitors are at 60%, Vanguard," your AI companion replied. "A confrontation with the Enforcer droids will require extreme precision."\n\nYou activated the sub-dermal power coils. Pure blue bio-energy surged through your forearms. "Then we don't fight with brute force. We disrupt their broadcast and give the citizens back their biological agency."`,
        decisionQuestion: 'Do you hack the broadcast relay directly or engage the patrolling sentinels to draw their perimeter?',
        choices: [
          { text: 'Hack the central relay with stealth data-siphons.', consequence: 'Earned +60 Tech Infiltration XP.' },
          { text: 'Trigger a pulse decoy to clear civilian pathways.', consequence: 'Earned +60 Tactical Decoy XP.' }
        ]
      }
    ]
  },
  {
    id: 'world_d',
    title: 'World D: The Legacy Builder',
    theme: 'Tushar\'s Real Entrepreneurial Journey',
    tagline: 'Building ReshapeNation & The Fight for an Obesity-Free India',
    description: 'The real-world epic: From a solitary voice in a world addicted to ultra-processed foods to founding ReshapeNation and igniting a nationwide preventive healthcare revolution.',
    badge: 'National Vanguard',
    color: 'from-emerald-600 to-amber-600',
    unlockedChapters: 2,
    totalChapters: 6,
    chapters: [
      {
        id: 'wd-ch1',
        number: 1,
        title: 'The Spark: Seeing the Silent Epidemic',
        status: 'unlocked',
        synopsis: 'Observing Indian families burdened by early diabetes and visceral obesity, sparking the vow to build ReshapeNation.',
        content: `It was a routine clinic visit that shattered complacency. A 32-year-old software architect—a father of a toddler—was handed a lifelong prescription for metformin and statins. His doctor gave him a photocopied diet chart that was impossible to follow with Indian family cooking.\n\n"Is this his destiny?" you thought.\n\nYou looked around the waiting room: brilliant engineers, loving mothers, young founders—all slowly succumbing to a preventable lifestyle crisis. Western apps didn't understand dal and roti. Gym trainers shouted generic broiler-chicken protocols.\n\nRight there, in the quiet clinic hallway, the seed was planted: ReshapeNation.\nNot just a brand—a mission to make India metabolic-sovereign and free from obesity.`,
        decisionQuestion: 'How did you take your first decisive public step?',
        choices: [
          { text: 'Recorded an unfiltered raw video addressing visceral fat and Indian genetics.', consequence: 'Unlocked "Authentic Voice" badge and +80 Influence XP.' },
          { text: 'Took 3 corporate friends and designed their custom 30-day metabolic reset.', consequence: 'Unlocked "Proof of Concept" badge and +80 Coaching XP.' }
        ]
      },
      {
        id: 'wd-ch2',
        number: 2,
        title: 'Speak to Impact: The ₹1 Lakh Challenge',
        status: 'unlocked',
        synopsis: 'Testing the core hypothesis: converting natural speaking charisma into qualified health consultations and ₹1,00,000 in committed revenue.',
        content: `12 November 2026.\nThe gauntlet was thrown. A targeted 9-day campaign with a single, clear hypothesis:\n\n"People enjoy listening when I speak. Can I turn this into 10 qualified consultations, genuine life transformations, and ₹1,00,000 in revenue?"\n\nDay 1 hit like thunder. You sent out personal outreach notes, drafted the Visceral Fat breakdown, and secured the first ₹25,000 collected. The resistance was loud, but your purpose was louder. Every rupee committed wasn't just cashflow—it was a citizen voting for their own health and trusting your leadership.`,
        decisionQuestion: 'Day 2 demands your full commitment. What is your primary weapon today?',
        choices: [
          { text: 'Release the high-impact visceral fat video with an unignorable diagnostic audit offer.', consequence: 'Earned +100 Visibility XP and boosted consultation pipeline.' },
          { text: 'Personally call the top 3 highest-intent prospects to finalize enrollment.', consequence: 'Earned +100 Revenue XP and closed second payment milestone.' }
        ]
      }
    ]
  }
];

// =========================================================================
// WEEKLY BOSS CHALLENGE
// =========================================================================
export const WEEKLY_BOSS = {
  name: 'The Visceral Leviathan',
  title: 'Titan of Metabolic Sluggishness & Procrastination',
  totalHp: 100000,
  currentHp: 100000, // Starts at full health; real progress reduces it.
  damageSources: [
    { type: 'Revenue Collected', factor: '1 Rupee = 1 HP Damage' },
    { type: 'Consultation Completed', factor: '2,500 HP Critical Strike' },
    { type: 'Daily Quest Done', factor: '500 HP Spell Damage' }
  ],
  bossQuote: '"You think you can dismantle decades of dietary complacency in 9 days? Let us see your discipline, Tushar!"',
  reward: {
    badge: 'Visceral Slayer',
    title: 'Titan Cleaver',
    bonusXp: 1000,
    unlockItem: 'Legendary Legacy Chapter: Sovereign of Health'
  }
};

// Storage helper
const getStorageKey = (userId, key) => `tushar_lifeos_${userId || 'guest'}_${key}`;

// Subscribe to comprehensive LifeOS mission data
export function subscribeMissionData(userId, callback) {
  const localKey = getStorageKey(userId, 'state');

  const loadLocalState = () => {
    try {
      const stored = localStorage.getItem(localKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading local mission state:', e);
    }
    return {
      campaign: INITIAL_CAMPAIGN,
      explorationCards: INITIAL_EXPLORATION_CARDS,
      dailyQuests: INITIAL_DAILY_QUESTS,
      goalHierarchy: CONNECTED_GOAL_HIERARCHY,
      lifeVision: LIFE_VISION_PILLARS,
      eveningReflection: INITIAL_EVENING_REFLECTION,
      dailyReminders: DAILY_REMINDERS,
      moodPresets: MOOD_PRESETS,
      storyWorlds: STORY_WORLDS,
      weeklyBoss: WEEKLY_BOSS,
      userLevel: {
        level: 1,
        title: 'Novice Warrior',
        currentXp: 0,
        totalXp: 0,
        nextLevelXp: 500,
        streakDays: 0,
        lastQuestDate: ''
      }
    };
  };

  // If in guest / demo mode, operate with local storage
  if (!userId || userId.startsWith('tushar_demo') || userId.startsWith('guest')) {
    const state = loadLocalState();
    localStorage.setItem(localKey, JSON.stringify(state));
    callback(state);

    const handler = (e) => {
      if (e.key === localKey) {
        callback(JSON.parse(e.newValue || '{}'));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  // Real Firestore listener for authenticated users
  try {
    const docRef = doc(db, 'users', userId, 'lifeos_mission', 'primary');
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        callback(data);
        localStorage.setItem(localKey, JSON.stringify(data));
      } else {
        const seed = loadLocalState();
        setDoc(docRef, seed).catch(() => {});
        callback(seed);
        localStorage.setItem(localKey, JSON.stringify(seed));
      }
    }, (err) => {
      console.warn('Firestore mission snapshot error, using cached:', err);
      callback(loadLocalState());
    });
    return unsub;
  } catch (err) {
    console.error('Error establishing mission subscription:', err);
    callback(loadLocalState());
    return () => {};
  }
}

// Persist state updates to Firestore & LocalStorage
export async function saveMissionState(userId, stateUpdates) {
  const localKey = getStorageKey(userId, 'state');
  let current = {};
  try {
    current = JSON.parse(localStorage.getItem(localKey) || '{}');
  } catch {}
  
  const merged = { ...current, ...stateUpdates };
  localStorage.setItem(localKey, JSON.stringify(merged));
  window.dispatchEvent(new StorageEvent('storage', { key: localKey, newValue: JSON.stringify(merged) }));

  if (userId && !userId.startsWith('tushar_demo') && !userId.startsWith('guest')) {
    try {
      const docRef = doc(db, 'users', userId, 'lifeos_mission', 'primary');
      await setDoc(docRef, merged, { merge: true });
    } catch (err) {
      console.warn('Failed saving mission state to Firestore:', err);
    }
  }
  return merged;
}
