import { useModelStore } from '../store/useModelStore';
import { AreaSplitTable } from '../components/inputs/AreaSplitTable';
import { NeedProfileTable } from '../components/inputs/NeedProfileTable';
import { VacancyTable } from '../components/inputs/VacancyTable';
import { SliderNumberField } from '../components/shared/SliderNumberField';
import { WarningBanner } from '../components/shared/WarningBanner';
import { GuideBanner } from '../components/guidance/GuideBanner';
import { ScenarioChangeLog } from '../components/guidance/ScenarioChangeLog';
import type { AreaName, CohortKey, CohortProfile, VacancyAreaInput } from '../lib/model/types';
import type { GuideId } from '../lib/guidedScenarios';
import { getScenarioWarnings, utilisationWarningMessage } from '../lib/warnings';

interface ScenarioInputsPageProps {
  activeGuide: GuideId | null;
  onDismissGuide: () => void;
}

export function ScenarioInputsPage({ activeGuide, onDismissGuide }: ScenarioInputsPageProps) {
  const scenario = useModelStore((s) => s.scenario);
  const setScenario = useModelStore((s) => s.setScenario);
  const resetScenarioToHistorical = useModelStore((s) => s.resetScenarioToHistorical);
  const scenarioAreaHours = useModelStore((s) => s.outputs.scenarioAreaHours);
  const warnings = getScenarioWarnings(scenario);

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>Scenario Inputs</h1>
          <p className="page-intro">
            This is your playground. Change any value here to model a what-if — the Outputs tab shows the
            impact next to your historical baseline. Nothing you do here touches Historical Inputs.
          </p>
        </div>
        <button type="button" className="secondary-button" onClick={resetScenarioToHistorical}>
          Reset to historical
        </button>
      </div>

      {activeGuide && <GuideBanner guideId={activeGuide} onDismiss={onDismissGuide} />}

      <WarningBanner messages={warnings.map((w) => w.message)} />

      <ScenarioChangeLog />

      <section>
        <h2>1. Demand</h2>
        <div className="slider-field-row">
          <SliderNumberField
            label="Total demand — referrals per week"
            helpTerm="demand"
            value={scenario.demandPerWeek}
            min={0}
            max={250}
            step={1}
            onChange={(v) => setScenario({ ...scenario, demandPerWeek: v })}
          />
          <SliderNumberField
            label="Target absence rate"
            helpTerm="absenceTarget"
            value={scenario.absenceTarget}
            min={0}
            max={0.6}
            step={0.01}
            displayScale={100}
            digits={0}
            suffix="%"
            onChange={(v) => setScenario({ ...scenario, absenceTarget: v })}
          />
          <SliderNumberField
            label="Target utilisation rate"
            helpTerm="utilisationTarget"
            value={scenario.utilisationTarget}
            min={0}
            max={1}
            step={0.01}
            displayScale={100}
            digits={0}
            suffix="%"
            onChange={(v) => setScenario({ ...scenario, utilisationTarget: v })}
            warning={utilisationWarningMessage(scenario.utilisationTarget)}
          />
          <SliderNumberField
            label="Target vacancy rate (ESW hours only)"
            helpTerm="vacancyTarget"
            value={scenario.vacancyTarget}
            min={0}
            max={0.5}
            step={0.01}
            displayScale={100}
            digits={0}
            suffix="%"
            onChange={(v) => setScenario({ ...scenario, vacancyTarget: v })}
          />
        </div>
      </section>

      <section>
        <h2>2. Referral split by area</h2>
        <AreaSplitTable
          areaSplit={scenario.areaSplit}
          editable
          onChange={(area: AreaName, value) =>
            setScenario({ ...scenario, areaSplit: { ...scenario.areaSplit, [area]: value } })
          }
        />
      </section>

      <section>
        <h2>3. Starting need profile (countywide)</h2>
        <NeedProfileTable
          needProfile={scenario.needProfile}
          editable
          onChange={(cohort: CohortKey, field: keyof CohortProfile, value) =>
            setScenario({
              ...scenario,
              needProfile: {
                ...scenario.needProfile,
                [cohort]: { ...scenario.needProfile[cohort], [field]: value },
              },
            })
          }
        />
      </section>

      <section>
        <h2>4. Weekly visit hours by area — modelled from budgeted hours</h2>
        <p className="section-note">
          Fix <strong>total budgeted hrs</strong> per area below to what the area would have if every
          post were filled. Everything else is calculated: current vacancy % compares this to Historical
          Inputs' actual delivered hours, and modelled capacity recruits down toward your target vacancy
          rate above — capped at whatever you already deliver today, so the model never credits you for
          vacancies you haven't actually filled.
        </p>
        <VacancyTable
          vacancyData={scenario.vacancyData}
          derivedHours={scenarioAreaHours}
          vacancyTarget={scenario.vacancyTarget}
          editable
          onChange={(area: AreaName, field: keyof VacancyAreaInput, value) =>
            setScenario({
              ...scenario,
              vacancyData: { ...scenario.vacancyData, [area]: { ...scenario.vacancyData[area], [field]: value } },
            })
          }
        />
      </section>
    </div>
  );
}
