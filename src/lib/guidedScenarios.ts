export type GuideId = 'rebalancing' | 'performance' | 'targetSetting' | 'resourceCase';

export interface GuidedScenario {
  id: GuideId;
  question: string;
  description: string;
  whatToLookAt: string;
  firstSteps: string[];
}

export const GUIDED_SCENARIOS: GuidedScenario[] = [
  {
    id: 'rebalancing',
    question: 'Are we resourced in the right places?',
    description:
      'Some areas may be short of capacity while others carry surplus, even if the countywide total looks fine. This walks you through comparing each area against its own demand share.',
    whatToLookAt: 'Outputs section 3 (by area) — look for a mix of "short" and "surplus"/"headroom" areas rather than an even spread.',
    firstSteps: [
      'Open Outputs and check the by-area table for areas flagged "short" alongside areas flagged "surplus" or "headroom".',
      'On Scenario Inputs, try adjusting the referral split (% of county) — move a point or two from a surplus area to a short one and watch the by-area status change.',
    ],
  },
  {
    id: 'performance',
    question: 'What would a performance improvement unlock?',
    description:
      'Test what happens if the service hit its absence, utilisation or vacancy targets, or reduced length of stay — and see how much of the current gap that would close.',
    whatToLookAt: 'Outputs section 2 (countywide summary) — watch the net gap hrs/wk narrow as you tighten a target.',
    firstSteps: [
      'On Scenario Inputs, try tightening the absence or utilisation target slider and see the effect on Outputs.',
      'Try reducing length of stay for one cohort in the need profile table — this lowers the hours every start consumes.',
    ],
  },
  {
    id: 'targetSetting',
    question: 'What starts target should each area aim for?',
    description:
      'Use Little\'s Law to work out a realistic, sustainable number of starts per week for each area — not just an aspirational demand figure.',
    whatToLookAt: "Outputs' starts view — the \"realistic starts target\" column gives a defensible number per area.",
    firstSteps: [
      'Open Outputs and scroll to the starts view table — "realistic starts target" is the number to set as each area\'s working target.',
      'Model your intended performance improvements on Scenario Inputs first, so the target reflects where you expect to be, not just where you are today.',
    ],
  },
  {
    id: 'resourceCase',
    question: 'What would it take to close the gap?',
    description:
      'Build the case for more resource by quantifying exactly how many hours or FTE would be needed to fully meet demand, area by area.',
    whatToLookAt: 'Outputs section 2 and 3 — the net gap in hours is the number to translate into a staffing ask.',
    firstSteps: [
      'Open Outputs and note the countywide net gap in hours/wk, and which areas contribute most to it.',
      'On Scenario Inputs, model your realistic best case (targets hit, vacancies filled) first — the remaining gap after that is the genuine resourcing ask.',
    ],
  },
];

export function getGuidedScenario(id: GuideId): GuidedScenario {
  const found = GUIDED_SCENARIOS.find((g) => g.id === id);
  if (!found) throw new Error(`Unknown guide id: ${id}`);
  return found;
}
