import { useModelStore } from '../store/useModelStore';
import { StatusBadge } from '../components/shared/StatusBadge';
import { HelpLabel } from '../components/shared/InfoTooltip';
import { CapacityChart } from '../components/outputs/CapacityChart';
import { StartsChart } from '../components/outputs/StartsChart';
import { formatHours, formatNumber, formatPercent, formatSigned } from '../lib/format';

export function OutputsPage() {
  const { baselineBlended, scenarioBlended, baselineCountywide, scenarioCountywide, byArea } = useModelStore(
    (s) => s.outputs
  );

  return (
    <div className="page">
      <h1>Outputs</h1>
      <p className="page-intro">
        Every figure here is calculated. Baseline reflects Historical Inputs; Scenario reflects Scenario
        Inputs; Change is the difference between them.
      </p>

      <section>
        <h2>1. Blended assumptions (from need profile)</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th />
              <th>Baseline (historical)</th>
              <th>Scenario (modelled)</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><HelpLabel term="avgTotalVisitHoursPerStart">Average total visit hours per start</HelpLabel></td>
              <td>{formatNumber(baselineBlended.avgTotalVisitHoursPerStart, 2)}</td>
              <td>{formatNumber(scenarioBlended.avgTotalVisitHoursPerStart, 2)}</td>
              <td>{formatSigned(scenarioBlended.avgTotalVisitHoursPerStart - baselineBlended.avgTotalVisitHoursPerStart, 2)}</td>
            </tr>
            <tr>
              <td><HelpLabel term="lengthOfStay">Weighted average length of stay (days)</HelpLabel></td>
              <td>{formatNumber(baselineBlended.weightedAvgLengthOfStayDays, 2)}</td>
              <td>{formatNumber(scenarioBlended.weightedAvgLengthOfStayDays, 2)}</td>
              <td>{formatSigned(scenarioBlended.weightedAvgLengthOfStayDays - baselineBlended.weightedAvgLengthOfStayDays, 2)}</td>
            </tr>
            <tr>
              <td><HelpLabel term="effectiveness">Average reduction in weekly need (effectiveness, hrs)</HelpLabel></td>
              <td>{formatNumber(baselineBlended.avgEffectivenessHrs, 2)}</td>
              <td>{formatNumber(scenarioBlended.avgEffectivenessHrs, 2)}</td>
              <td>{formatSigned(scenarioBlended.avgEffectivenessHrs - baselineBlended.avgEffectivenessHrs, 2)}</td>
            </tr>
            <tr>
              <td><HelpLabel term="blendedFinisherRate">Blended successful finisher rate</HelpLabel></td>
              <td>{formatPercent(baselineBlended.blendedFinisherRate, 1)}</td>
              <td>{formatPercent(scenarioBlended.blendedFinisherRate, 1)}</td>
              <td>{formatSigned((scenarioBlended.blendedFinisherRate - baselineBlended.blendedFinisherRate) * 100, 1)}pp</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>2. Countywide summary</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th />
              <th>Baseline (historical)</th>
              <th>Scenario (modelled)</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><HelpLabel term="demand">Total demand (successful referrals/wk)</HelpLabel></td>
              <td>{formatHours(baselineCountywide.demandPerWeek)}</td>
              <td>{formatHours(scenarioCountywide.demandPerWeek)}</td>
              <td>{formatSigned(scenarioCountywide.demandPerWeek - baselineCountywide.demandPerWeek)}</td>
            </tr>
            <tr>
              <td><HelpLabel term="requiredHours">Required visit hours/wk to meet demand</HelpLabel></td>
              <td>{formatHours(baselineCountywide.requiredHrsPerWeek)}</td>
              <td>{formatHours(scenarioCountywide.requiredHrsPerWeek)}</td>
              <td>{formatSigned(scenarioCountywide.requiredHrsPerWeek - baselineCountywide.requiredHrsPerWeek)}</td>
            </tr>
            <tr>
              <td><HelpLabel term="availableHours">Visit hours/wk available (at target absence &amp; utilisation)</HelpLabel></td>
              <td>{formatHours(baselineCountywide.availableHrsPerWeek)}</td>
              <td>{formatHours(scenarioCountywide.availableHrsPerWeek)}</td>
              <td>{formatSigned(scenarioCountywide.availableHrsPerWeek - baselineCountywide.availableHrsPerWeek)}</td>
            </tr>
            <tr>
              <td><HelpLabel term="netGap">Net gap hrs/wk (available − required)</HelpLabel></td>
              <td>{formatSigned(baselineCountywide.netGapHrsPerWeek)}</td>
              <td>{formatSigned(scenarioCountywide.netGapHrsPerWeek)}</td>
              <td>{formatSigned(scenarioCountywide.netGapHrsPerWeek - baselineCountywide.netGapHrsPerWeek)}</td>
            </tr>
            <tr>
              <td>Successful finishers/wk (at demand)</td>
              <td>{formatNumber(baselineCountywide.finishersPerWeek, 1)}</td>
              <td>{formatNumber(scenarioCountywide.finishersPerWeek, 1)}</td>
              <td>{formatSigned(scenarioCountywide.finishersPerWeek - baselineCountywide.finishersPerWeek, 1)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>3. By area — capacity vs demand</h2>
        <div className="chart-pair">
          <div>
            <h3>Baseline</h3>
            <CapacityChart rows={byArea} mode="baseline" />
          </div>
          <div>
            <h3>Scenario</h3>
            <CapacityChart rows={byArea} mode="scenario" />
          </div>
        </div>
        <table className="data-table wide-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Baseline hrs/wk available</th>
              <th>Baseline required hrs/wk</th>
              <th>Baseline status</th>
              <th>Scenario hrs/wk available</th>
              <th>Scenario required hrs/wk</th>
              <th>Scenario status</th>
            </tr>
          </thead>
          <tbody>
            {byArea.map((row) => (
              <tr key={row.area} className={`status-row-${row.scenarioStatus === '—' ? 'none' : row.scenarioStatus}`}>
                <td>{row.area}</td>
                <td>{formatHours(row.baselineAvailableHrsPerWeek)}</td>
                <td>{formatHours(row.baselineRequiredHrsPerWeek)}</td>
                <td><StatusBadge status={row.baselineStatus} /></td>
                <td>{formatHours(row.scenarioAvailableHrsPerWeek)}</td>
                <td>{formatHours(row.scenarioRequiredHrsPerWeek)}</td>
                <td><StatusBadge status={row.scenarioStatus} /></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td>County total</td>
              <td>{formatHours(byArea.reduce((s, r) => s + r.baselineAvailableHrsPerWeek, 0))}</td>
              <td>{formatHours(byArea.reduce((s, r) => s + r.baselineRequiredHrsPerWeek, 0))}</td>
              <td />
              <td>{formatHours(byArea.reduce((s, r) => s + r.scenarioAvailableHrsPerWeek, 0))}</td>
              <td>{formatHours(byArea.reduce((s, r) => s + r.scenarioRequiredHrsPerWeek, 0))}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </section>

      <section>
        <h2><HelpLabel term="littlesLaw">Starts view (Little's Law: sustainable starts/wk = capacity ÷ hours per start)</HelpLabel></h2>
        <StartsChart rows={byArea} />
        <table className="data-table wide-table">
          <thead>
            <tr>
              <th>Area</th>
              <th><HelpLabel term="startsSupportable">Starts supported (historical performance)</HelpLabel></th>
              <th><HelpLabel term="startsNeeded">Starts needed for full demand</HelpLabel></th>
              <th>Gap to meeting demand?</th>
              <th><HelpLabel term="startsSupportable">Starts supported (target performance)</HelpLabel></th>
              <th><HelpLabel term="realisticStartsTarget">Realistic starts target</HelpLabel></th>
              <th>Scenario starts status</th>
            </tr>
          </thead>
          <tbody>
            {byArea.map((row) => (
              <tr key={row.area} className={`status-row-${row.scenarioStartsStatus === '—' ? 'none' : row.scenarioStartsStatus}`}>
                <td>{row.area}</td>
                <td>{formatNumber(row.baselineStartsSupportable, 1)}</td>
                <td>{formatNumber(row.baselineStartsNeeded, 1)}</td>
                <td><StatusBadge status={row.baselineStartsStatus} /></td>
                <td>{formatNumber(row.scenarioStartsSupportable, 1)}</td>
                <td>{formatNumber(row.realisticStartsTarget, 1)}</td>
                <td><StatusBadge status={row.scenarioStartsStatus} /></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td>County total</td>
              <td>{formatNumber(byArea.reduce((s, r) => s + r.baselineStartsSupportable, 0), 1)}</td>
              <td>{formatNumber(byArea.reduce((s, r) => s + r.baselineStartsNeeded, 0), 1)}</td>
              <td />
              <td>{formatNumber(byArea.reduce((s, r) => s + r.scenarioStartsSupportable, 0), 1)}</td>
              <td>{formatNumber(byArea.reduce((s, r) => s + r.realisticStartsTarget, 0), 1)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </section>

      <section>
        <h2>Legend</h2>
        <ul className="legend-list">
          <li><StatusBadge status="short" /> <HelpLabel term="statusShort">capacity below demand</HelpLabel></li>
          <li><StatusBadge status="balanced" /> <HelpLabel term="statusBalanced">capacity roughly matches demand (±5%)</HelpLabel></li>
          <li><StatusBadge status="surplus" /> <HelpLabel term="statusSurplus">capacity exceeds demand (5–10%)</HelpLabel></li>
          <li><StatusBadge status="headroom" /> <HelpLabel term="statusHeadroom">scenario capacity exceeds demand by &gt;10% — improvements have created spare</HelpLabel></li>
        </ul>
      </section>
    </div>
  );
}
