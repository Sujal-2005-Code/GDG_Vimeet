import Icon from './Icon';

/** Neutral tag (category, audience …). */
export const Chip = ({ children, className = '' }) => (
  <span
    className={`inline-flex min-h-7 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-medium text-ink-2 ${className}`}
  >
    {children}
  </span>
);

// Status is never shown by colour alone: every state has a label and a mark.
const STATUS = {
  upcoming: { label: 'Upcoming', className: 'bg-primary-tint text-primary-strong', mark: 'dot' },
  completed: { label: 'Completed', className: 'bg-success-tint text-success', mark: 'check' },
  open: { label: 'Applications open', className: 'bg-success-tint text-success', mark: 'dot' },
  closed: { label: 'Applications closed', className: 'bg-warning-tint text-ink', mark: 'lock' },
  highlight: { label: 'Highlight', className: 'bg-warning-tint text-ink', mark: 'star' },
};

export const StatusChip = ({ status, label, className = '' }) => {
  const s = STATUS[status] ?? STATUS.completed;
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ${s.className} ${className}`}
    >
      {s.mark === 'dot' ? (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      ) : (
        <Icon name={s.mark} className="size-3.5" />
      )}
      {label ?? s.label}
    </span>
  );
};

export default Chip;
