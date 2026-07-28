import { useModelStore } from '../store/useModelStore';
import { AreaSplitTable } from '../components/inputs/AreaSplitTable';
import { NeedProfileTable } from '../components/inputs/NeedProfileTable';
import { WeeklyHoursTable } from '../components/inputs/WeeklyHoursTable';
import { NumberField } from '../components/shared/NumberField';
import type { AreaHoursInput, AreaName, CohortKey, CohortProfile } from '../lib/model/types';

export function HistoricalInputsPage() {
  const historical = useModelStore((s) => s.historical);
  const setHistorical = useModelStore((s) => s.setHistorical);

  return (
    <div className="page">
      <h1>Historical Inputs</h1>
      <p className="page-intro">
        This is your factual baseline, from the client's dashboard. Only update it when refreshing with new
        dashboard data — every scenario you model is compared back against these numbers.
      </p>

      <section>
        <h2>1. Demand</h2>
        <div className="field-row">
          <NumberField
            label="Total demand — referrals per week"
            helpTerm="demand"
            value={historical.demandPerWeek}
            step={1}
            onChange={(v) => setHistorical({ ...historical, demandPerWeek: v })}
          />
          <NumberField
            label="Target absence rate (% of available hours, not incl. vacancies)"
            helpTerm="absenceTarget"
            value={historical.absenceTarget}
            displayScale={100}
            digits={1}
            suffix="%"
            onChange={(v) => setHistorical({ ...historical, absenceTarget: v })}
          />
          <NumberField
            label="Target utilisation rate (% of available hours spent on visits)"
            helpTerm="utilisationTarget"
            value={historical.utilisationTarget}
            displayScale={100}
            digits={1}
            suffix="%"
            onChange={(v) => setHistorical({ ...historical, utilisationTarget: v })}
          />
        </div>
      </section>

      <section>
        <h2>2. Referral split by area</h2>
        <AreaSplitTable
          areaSplit={historical.areaSplit}
          editable
          onChange={(area: AreaName, value) =>
            setHistorical({ ...historical, areaSplit: { ...historical.areaSplit, [area]: value } })
          }
        />
      </section>

      <section>
        <h2>3. Starting need profile (countywide)</h2>
        <NeedProfileTable
          needProfile={historical.needProfile}
          editable
          onChange={(cohort: CohortKey, field: keyof CohortProfile, value) =>
            setHistorical({
              ...historical,
              needProfile: {
                ...historical.needProfile,
                [cohort]: { ...historical.needProfile[cohort], [field]: value },
              },
            })
          }
        />
      </section>

      <section>
        <h2>4. Weekly visit hours by area (from dashboard)</h2>
        <WeeklyHoursTable
          areaHours={historical.areaHours}
          editable
          onChange={(area: AreaName, field: keyof AreaHoursInput, value) =>
            setHistorical({
              ...historical,
              areaHours: { ...historical.areaHours, [area]: { ...historical.areaHours[area], [field]: value } },
            })
          }
        />
      </section>
    </div>
  );
}
