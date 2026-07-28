import type { KpiTileData } from '../../lib/kpis';

export function KpiTile({ tile }: { tile: KpiTileData }) {
  return (
    <div className={`kpi-tile kpi-tile-${tile.tone}`}>
      <span className="kpi-tile-label">{tile.label}</span>
      <span className="kpi-tile-value">{tile.value}</span>
      {tile.delta && <span className="kpi-tile-delta">{tile.delta}</span>}
    </div>
  );
}
