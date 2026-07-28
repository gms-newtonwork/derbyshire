import { useEffect, useRef, useState } from 'react';
import { GLOSSARY, type GlossaryKey } from '../../lib/glossary';

interface InfoTooltipProps {
  term: GlossaryKey;
}

export function InfoTooltip({ term }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const entry = GLOSSARY[term];

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <span className="info-tooltip" ref={containerRef}>
      <button
        type="button"
        className="info-tooltip-trigger"
        aria-label={`What does "${entry.term}" mean?`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ?
      </button>
      {open && (
        <span className="info-tooltip-popover" role="tooltip">
          <strong>{entry.term}</strong>
          <span>{entry.definition}</span>
        </span>
      )}
    </span>
  );
}

/** Wraps a label with an inline "what does this mean?" info icon. */
export function HelpLabel({ term, children }: { term: GlossaryKey; children: React.ReactNode }) {
  return (
    <span className="help-label">
      {children}
      <InfoTooltip term={term} />
    </span>
  );
}
