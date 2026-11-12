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
    title: 'Transform 100,000 Lives & Build India\'s Premier Preventive Health Ecosystem',
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
    progress: 32
  },
  quarterlyObjective: {
    quarter: 'Q4 2026 (Oct – Dec)',
    title: 'Master Speaking-to-Coaching Funnel & Achieve ₹10 Lakhs in Quarterly Revenue',
    status: 'Active',
    progress: 45
  },
  monthlyMilestone: {
    month: 'November 2026',
    title: 'Complete Speak to Impact ₹1 Lakh Challenge & Validate High-Ticket Health Conversion',
    status: 'In Progress',
    progress: 25
  },
  weeklyCampaignId: 'campaign-speak-to-impact-1lakh'
};

// Life Vision Pillars
export const LIFE_VISION_PILLARS = [
  { id: 'mission', title: 'Mission & Contribution', priority: 'Primary', status: 'Focus: ReshapeNation & Obesity-Free India', score: 92, color: 'text-amber-400' },
  { id: 'health', title: 'Health & Fitness', priority: 'High', status: 'Metabolic fitness, strength 4x/wk, 10k steps', score: 85, color: 'text-emerald-400' },
  { id: 'business', title: 'Business & Career', priority: 'High', status: 'ReshapeNation scaling & high-leverage engineering', score: 80, color: 'text-blue-400' },
  { id: 'wealth', title: 'Wealth & Finances', priority: 'Medium', status: '₹1L campaign target, financial independence', score: 74, color: 'text-yellow-400' },
  { id: 'relationships', title: 'Family & Relationships', priority: 'Medium', status: 'Presence, active listening, quality family time', score: 88, color: 'text-rose-400' },
  { id: 'learning', title: 'Learning & Growth', priority: 'High', status: 'Metabolic health research, AI systems, philosophy', score: 90, color: 'text-purple-400' },
  { id: 'mindset', title: 'Personal Development', priority: 'High', status: 'Stoic resilience, evening reflections, clarity', score: 82, color: 'text-indigo-400' },
  { id: 'happiness', title: 'Experiences & Happiness', priority: 'Medium', status: 'Travel, deep work flow, creative freedom', score: 78, color: 'text-teal-400' }
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
  
  // Financial Tracking
  financials: {
    collected: 25000,
    committed: 35000,
    outstanding: 15000,
    pipeline: 80000,
    salesCount: 2,
    avgRevenuePerCustomer: 15000,
    pricingScenarios: [
      { name: 'VIP Mentorship', price: 25000, targetCount: 4, label: '4 clients @ ₹25,000 = ₹1,00,000' },
      { name: 'Hybrid Cohort', price: 15000, targetCount: 7, label: '7 clients @ ₹15,000 = ₹1,05,000' },
      { name: 'Corporate Workshop + Coaching', price: 50000, targetCount: 2, label: '2 engagements @ ₹50,000 = ₹1,00,000' }
    ]
  },

  // Activity Funnel
  activity: {
    conversations: 18,
    speakingOpportunities: 3,
    audienceReached: 140,
    contentPublished: 4,
    qualifiedProspects: 9,
    consultationsBooked: 7,
    consultationsCompleted: 5,
    proposalsSent: 4,
    followUpsDone: 11
  },

  // Learning Insights
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

  // Suggested Daily Quests for 12–20 November 2026 (Day 1 to Day 9)
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
      completed: true,
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

// Initial Dynamic Daily Quests (12 November 2026)
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
    dueDate: '2026-11-12',
    startTime: '16:00',
    endTime: '17:00',
    status: 'in-progress',
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
    dueDate: '2026-11-12',
    startTime: '11:30',
    endTime: '12:15',
    status: 'done',
    xp: 140,
    completed: true
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
    dueDate: '2026-11-12',
    startTime: '07:30',
    endTime: '08:15',
    status: 'done',
    xp: 120,
    completed: true
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
    dueDate: '2026-11-12',
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
    dueDate: '2026-11-12',
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
    dueDate: '2026-11-12',
    status: 'todo',
    xp: 100,
    completed: false
  }
];

// Evening Reflection Template
export const INITIAL_EVENING_REFLECTION = {
  date: '2026-11-12',
  accomplished: 'Kickstarted the ₹1 Lakh challenge! Published visceral fat video, secured ₹25k collected, logged 10k steps.',
  habitsMaintained: 'Morning hydration, strength training, zero refined sugar, 20m reading.',
  learned: 'People respond immediately when speaking is specific to their exact Indian lifestyle pain points.',
  preventedProgress: 'Delayed scheduling afternoon follow-ups due to context switching.',
  tomorrowPriorities: 'Conduct 3 scheduled consultations, finalize offer slides for weekend masterclass.',
  rating: 8.5
};

// Storage keys
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
      userLevel: {
        level: 4,
        title: 'Mission Vanguard',
        currentXp: 3450,
        nextLevelXp: 5000,
        streakDays: 14
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
