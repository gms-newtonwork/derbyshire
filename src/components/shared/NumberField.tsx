import type { GlossaryKey } from '../../lib/glossary';
import { HelpLabel } from './InfoTooltip';

interface NumberFieldProps {
  label: string;
  helpTerm?: GlossaryKey;
  value: number;
  onChange?: (value: number) => void;
  suffix?: string;
  /** Multiply the stored value by this before display, and divide input back before storing (e.g. 100 for % fields stored as fractions). */
  displayScale?: number;
  step?: number;
  readOnly?: boolean;
  digits?: number;
}

export function NumberField({
  label,
  helpTerm,
  value,
  onChange,
  suffix = '',
  displayScale = 1,
  step = 1,
  readOnly = false,
  digits,
}: NumberFieldProps) {
  const displayValue = value * displayScale;
  const rounded = digits !== undefined ? Number(displayValue.toFixed(digits)) : displayValue;

  return (
    <label className="number-field">
      {label && (
        <span className="number-field-label">
          {helpTerm ? <HelpLabel term={helpTerm}>{label}</HelpLabel> : label}
        </span>
      )}
      <span className="number-field-input-wrap">
        <input
          type="number"
          value={rounded}
          step={step}
          readOnly={readOnly}
          disabled={readOnly}
          onChange={(e) => {
            if (!onChange) return;
            const next = Number(e.target.value);
            if (Number.isNaN(next)) return;
            onChange(next / displayScale);
          }}
        />
        {suffix && <span className="number-field-suffix">{suffix}</span>}
      </span>
    </label>
  );
}
