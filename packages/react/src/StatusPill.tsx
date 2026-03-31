// @ds-component: status-pill | @ds-adapter: tailwind | @ds-version: 0.1.0

export type InstructionStatus =
  | 'submitted'
  | 'in_payments'
  | 'first_approval'
  | 'second_approval'
  | 'sent_to_bank'
  | 'bank_confirmed'
  | 'failed'
  | 'rejected';

export interface StatusPillProps {
  status: InstructionStatus;
}

const CONFIG: Record<InstructionStatus, { label: string; bg: string; text: string; border: string }> = {
  submitted:       { label: 'Submitted',    bg: 'var(--color-surface-sunken)',       text: 'var(--color-text-tertiary)',           border: 'var(--color-border-default)' },
  in_payments:     { label: 'In Payments',  bg: 'var(--color-feedback-info-bg)',     text: 'var(--color-feedback-info-text)',      border: 'var(--color-feedback-info-border)' },
  first_approval:  { label: '1st Approval', bg: 'var(--color-feedback-info-bg)',     text: 'var(--color-feedback-info-text)',      border: 'var(--color-feedback-info-border)' },
  second_approval: { label: '2nd Approval', bg: 'var(--color-feedback-info-bg)',     text: 'var(--color-feedback-info-text)',      border: 'var(--color-feedback-info-border)' },
  sent_to_bank:    { label: 'Sent to Bank', bg: 'var(--color-feedback-success-bg)',  text: 'var(--color-feedback-success-text)',  border: 'var(--color-feedback-success-border)' },
  bank_confirmed:  { label: 'Confirmed ✓',  bg: 'var(--color-feedback-success-bg)',  text: 'var(--color-feedback-success-text)',  border: 'var(--color-feedback-success-border)' },
  failed:          { label: 'Failed',        bg: 'var(--color-feedback-error-bg)',    text: 'var(--color-feedback-error-text)',    border: 'var(--color-feedback-error-border)' },
  rejected:        { label: 'Rejected',      bg: 'var(--color-feedback-error-bg)',    text: 'var(--color-feedback-error-text)',    border: 'var(--color-feedback-error-border)' },
};

export function StatusPill({ status }: StatusPillProps) {
  const c = CONFIG[status];
  return (
    <span
      role="status"
      aria-label={`Status: ${c.label}`}
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        fontSize: 'var(--font-size-2xs)',
        fontWeight: 700,
        letterSpacing: '0.08em',
        lineHeight: 1.4,
      }}
    >
      {c.label}
    </span>
  );
}
