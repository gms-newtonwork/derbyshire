import { useState } from 'react';
import type { AreaRow } from '../../lib/model/calculations';
import { getAreaCardSummary } from '../../lib/areaSummary';
import { StatusBadge } from '../shared/StatusBadge';

interface AreaCardProps {
  row: AreaRow;
  fullCommentary: string;
}

export function AreaCard({ row, fullCommentary }: AreaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const summary = getAreaCardSummary(row);

  return (
    <button
      type="button"
      className={`area-card area-card-${row.scenarioStartsStatus === '—' ? 'none' : row.scenarioStartsStatus}`}
      onClick={() => setExpanded((v) => !v)}
      aria-expanded={expanded}
    >
      <div className="area-card-header">
        <span className="area-card-name">{row.area}</span>
        <StatusBadge status={row.scenarioStartsStatus} />
      </div>
      <div className="area-card-headline">
        <span className="area-card-headline-value">{summary.headline}</span>
        <span className="area-card-headline-unit">{summary.unit}</span>
      </div>
      <p className="area-card-takeaway">{summary.takeaway}</p>
      {expanded && <p className="area-card-detail">{fullCommentary}</p>}
      <span className="area-card-toggle">{expanded ? 'Show less' : 'Why? →'}</span>
    </button>
  );
}
