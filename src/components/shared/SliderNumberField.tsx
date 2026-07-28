import type { GlossaryKey } from '../../lib/glossary';
import { HelpLabel } from './InfoTooltip';

interface SliderNumberFieldProps {
  label: string;
  helpTerm?: GlossaryKey;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  /** Multiply the stored value by this before display (e.g. 100 for % fields stored as fractions). */
  displayScale?: number;
  digits?: number;
  /** Optional warning shown under the field when the current value looks unrealistic. */
  warning?: string;
}

export function SliderNumberField({
  label,
  helpTerm,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '',
  displayScale = 1,
  digits = 0,
  warning,
}: SliderNumberFieldProps) {
  const displayValue = Number((value * displayScale).toFixed(digits));

  return (
    <div className="slider-field">
      <div className="slider-field-label">
        {helpTerm ? <HelpLabel term={helpTerm}>{label}</HelpLabel> : label}
      </div>
      <div className="slider-field-controls">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={(e) => onChange(Number(e.target.value) / displayScale)}
        />
        <span className="slider-field-value-wrap">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={displayValue}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isNaN(next)) return;
              onChange(next / displayScale);
            }}
          />
          {suffix && <span className="number-field-suffix">{suffix}</span>}
        </span>
      </div>
      {warning && <p className="field-warning">{warning}</p>}
    </div>
  );
}
