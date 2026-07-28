import { useModelStore } from '../store/useModelStore';
import { StatusBadge } from '../components/shared/StatusBadge';
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
              <td>Average total visit hours per start</td>
              <td>{formatNumber(baselineBlended.avgTotalVisitHoursPerStart, 2)}</td>
              <td>{formatNumber(scenarioBlended.avgTotalVisitHoursPerStart, 2)}</td>
              <td>{formatSigned(scenarioBlended.avgTotalVisitHoursPerStart - baselineBlended.avgTotalVisitHoursPerStart, 2)}</td>
            </tr>
            <tr>
              <td>Weighted average length of stay (days)</td>
              <td>{formatNumber(baselineBlended.weightedAvgLengthOfStayDays, 2)}</td>
              <td>{formatNumber(scenarioBlended.weightedAvgLengthOfStayDays, 2)}</td>
              <td>{formatSigned(scenarioBlended.weightedAvgLengthOfStayDays - baselineBlended.weightedAvgLengthOfStayDays, 2)}</td>
            </tr>
            <tr>
              <td>Average reduction in weekly need (effectiveness, hrs)</td>
              <td>{formatNumber(baselineBlended.avgEffectivenessHrs, 2)}</td>
              <td>{formatNumber(scenarioBlended.avgEffectivenessHrs, 2)}</td>
              <td>{formatSigned(scenarioBlended.avgEffectivenessHrs - baselineBlended.avgEffectivenessHrs, 2)}</td>
            </tr>
            <tr>
              <td>Blended successful finisher rate</td>
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
              <td>Total demand (successful referrals/wk)</td>
              <td>{formatHours(baselineCountywide.demandPerWeek)}</td>
              <td>{formatHours(scenarioCountywide.demandPerWeek)}</td>
              <td>{formatSigned(scenarioCountywide.demandPerWeek - baselineCountywide.demandPerWeek)}</td>
            </tr>
            <tr>
              <td>Required visit hours/wk to meet demand</td>
              <td>{formatHours(baselineCountywide.requiredHrsPerWeek)}</td>
              <td>{formatHours(scenarioCountywide.requiredHrsPerWeek)}</td>
              <td>{formatSigned(scenarioCountywide.requiredHrsPerWeek - baselineCountywide.requiredHrsPerWeek)}</td>
            </tr>
            <tr>
              <td>Visit hours/wk available (at target absence &amp; utilisation)</td>
              <td>{formatHours(baselineCountywide.availableHrsPerWeek)}</td>
              <td>{formatHours(scenarioCountywide.availableHrsPerWeek)}</td>
              <td>{formatSigned(scenarioCountywide.availableHrsPerWeek - baselineCountywide.availableHrsPerWeek)}</td>
            </tr>
            <tr>
              <td>Net gap hrs/wk (available − required)</td>
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
              <tr key={row.area}>
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
        <h2>Starts view (Little's Law: sustainable starts/wk = capacity ÷ hours per start)</h2>
        <table className="data-table wide-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Starts supported (historical performance)</th>
              <th>Starts needed for full demand</th>
              <th>Gap to meeting demand?</th>
              <th>Starts supported (target performance)</th>
              <th>Realistic starts target</th>
              <th>Scenario starts status</th>
            </tr>
          </thead>
          <tbody>
            {byArea.map((row) => (
              <tr key={row.area}>
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
          <li><StatusBadge status="short" /> capacity below demand</li>
          <li><StatusBadge status="balanced" /> capacity roughly matches demand (±5%)</li>
          <li><StatusBadge status="surplus" /> capacity exceeds demand (5–10%)</li>
          <li><StatusBadge status="headroom" /> scenario capacity exceeds demand by &gt;10% — improvements have created spare</li>
        </ul>
      </section>
    </div>
  );
}
