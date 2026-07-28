export type GlossaryKey =
  | 'demand'
  | 'absenceTarget'
  | 'utilisationTarget'
  | 'vacancyTarget'
  | 'areaSplit'
  | 'needProfileMix'
  | 'startHrs'
  | 'endHrs'
  | 'lengthOfStay'
  | 'finisherRate'
  | 'avgHrsPerPersonPerWeek'
  | 'effectiveness'
  | 'avgTotalVisitHoursPerStart'
  | 'blendedFinisherRate'
  | 'requiredHours'
  | 'availableHours'
  | 'netGap'
  | 'littlesLaw'
  | 'startsSupportable'
  | 'startsNeeded'
  | 'realisticStartsTarget'
  | 'statusShort'
  | 'statusBalanced'
  | 'statusSurplus'
  | 'statusHeadroom'
  | 'vacancyRate'
  | 'totalBudgetedHrs';

interface GlossaryEntry {
  term: string;
  definition: string;
}

export const GLOSSARY: Record<GlossaryKey, GlossaryEntry> = {
  demand: {
    term: 'Demand (referrals/wk)',
    definition: 'How many people are successfully referred into the service each week, county-wide or for one area.',
  },
  absenceTarget: {
    term: 'Absence target',
    definition:
      'The % of available staff hours you expect to lose to sickness, leave and other absence — not including unfilled vacancies. A higher absence target means less of your delivered hours turn into visit time.',
  },
  utilisationTarget: {
    term: 'Utilisation target',
    definition:
      'Of the hours staff are actually at work (i.e. after absence), the % you expect to be spent face-to-face on visits rather than travel, admin, handover etc.',
  },
  vacancyTarget: {
    term: 'Vacancy target',
    definition:
      'The % of budgeted ESW (enablement support worker) posts you’re aiming to keep filled at. The scenario model uses this to test "what if we recruited down to this vacancy rate" — but it will never assume a better position than what you already have.',
  },
  areaSplit: {
    term: 'Referral split by area',
    definition: 'What % of total countywide demand each area receives. All 8 areas must add up to 100%.',
  },
  needProfileMix: {
    term: 'Cohort mix',
    definition:
      'What % of all starts fall into this need cohort (low/medium/high). All three cohorts must add up to 100%.',
  },
  startHrs: {
    term: 'Avg weekly hrs at start',
    definition: 'The typical number of visit hours per week a person in this cohort needs when they first start.',
  },
  endHrs: {
    term: 'Avg weekly hrs at end',
    definition: 'The typical number of visit hours per week a person in this cohort needs just before discharge.',
  },
  lengthOfStay: {
    term: 'Length of stay (days)',
    definition: 'How many days, on average, a person in this cohort stays in the service from first visit to discharge.',
  },
  finisherRate: {
    term: 'Successful finisher rate',
    definition: 'The % of people in this cohort who complete the service successfully (rather than leaving early, e.g. into long-term care).',
  },
  avgHrsPerPersonPerWeek: {
    term: 'Avg hrs/person/wk',
    definition:
      'A weighted midpoint between a cohort’s starting and ending need — calculated as (start hrs + 3 × end hrs) ÷ 4. It’s weighted toward ending need because people spend more of their time in service closer to discharge than to admission.',
  },
  effectiveness: {
    term: 'Effectiveness (hrs)',
    definition: 'How much a person’s weekly need falls during their time in the service: starting hours minus ending hours.',
  },
  avgTotalVisitHoursPerStart: {
    term: 'Average total visit hours per start',
    definition:
      'The total face-to-face hours one typical person uses across their whole journey, from first visit to discharge — blended across all three cohorts. Multiply weekly referrals by this figure and you get the hours the service needs to run each week.',
  },
  blendedFinisherRate: {
    term: 'Blended successful finisher rate',
    definition: 'The countywide successful finisher rate, weighted by each cohort’s share of starts.',
  },
  requiredHours: {
    term: 'Required hours',
    definition: 'The visit hours needed each week to keep up with demand: demand × average total visit hours per start.',
  },
  availableHours: {
    term: 'Available hours',
    definition:
      'The visit hours your team can actually deliver each week, after absence and utilisation targets are applied: (delivered + absent hours) × (1 − absence target) × utilisation target.',
  },
  netGap: {
    term: 'Net gap',
    definition: 'Available hours minus required hours. Negative means you don’t have enough capacity to meet demand; positive means you have spare.',
  },
  littlesLaw: {
    term: "Little's Law",
    definition:
      'A queueing-theory result: the number of things you can sustainably process per unit time equals your capacity divided by how long each thing takes. Here: sustainable starts/wk = capacity (hrs/wk) ÷ hours needed per completed start. It tells you the throughput your current capacity can actually support — not just whether you have "enough hours" in the abstract.',
  },
  startsSupportable: {
    term: 'Starts supportable',
    definition: 'How many people per week your current capacity can sustainably support through to completion, per Little’s Law.',
  },
  startsNeeded: {
    term: 'Starts needed',
    definition: 'How many starts per week would be needed to pick up all of an area’s demand, with no one waiting.',
  },
  realisticStartsTarget: {
    term: 'Realistic starts target',
    definition: 'The lower of what you can support and what’s actually needed — i.e. a sensible number to aim for, rather than an unconstrained maximum.',
  },
  statusShort: {
    term: 'Short',
    definition: 'Capacity is below demand — some referrals in this area can’t be picked up on time.',
  },
  statusBalanced: {
    term: 'Balanced',
    definition: 'Capacity is within 5% of demand either way — roughly matched.',
  },
  statusSurplus: {
    term: 'Surplus',
    definition: 'Capacity exceeds demand by 5–10%.',
  },
  statusHeadroom: {
    term: 'Headroom',
    definition: 'Scenario capacity exceeds demand by more than 10% — your modelled improvements have created spare capacity beyond what’s needed.',
  },
  vacancyRate: {
    term: 'Vacancy rate',
    definition: 'The % of budgeted ESW posts currently unfilled, calculated by comparing your historical delivered hours to total budgeted hours for the area.',
  },
  totalBudgetedHrs: {
    term: 'Total budgeted hrs',
    definition: 'The weekly visit hours you’d have available in this area if every budgeted ESW post were filled.',
  },
};
