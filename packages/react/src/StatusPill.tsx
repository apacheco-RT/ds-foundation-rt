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
  submitted:       { label: 'Submitted',    bg: 'var(--ds-color-surface-sunken)',       text: 'var(--ds-color-text-tertiary)',           border: 'var(--ds-color-border-default)' },
  in_payments:     { label: 'In Payments',  bg: 'var(--ds-color-feedback-info-bg)',     text: 'var(--ds-color-feedback-info-text)',      border: 'var(--ds-color-feedback-info-border)' },
  first_approval:  { label: '1st Approval', bg: 'var(--ds-color-feedback-info-bg)',     text: 'var(--ds-color-feedback-info-text)',      border: 'var(--ds-color-feedback-info-border)' },
  second_approval: { label: '2nd Approval', bg: 'var(--ds-color-feedback-info-bg)',     text: 'var(--ds-color-feedback-info-text)',      border: 'var(--ds-color-feedback-info-border)' },
  sent_to_bank:    { label: 'Sent to Bank', bg: 'var(--ds-color-feedback-success-bg)',  text: 'var(--ds-color-feedback-success-text)',  border: 'var(--ds-color-feedback-success-border)' },
  bank_confirmed:  { label: 'Confirmed ✓',  bg: 'var(--ds-color-feedback-success-bg)',  text: 'var(--ds-color-feedback-success-text)',  border: 'var(--ds-color-feedback-success-border)' },
  failed:          { label: 'Failed',        bg: 'var(--ds-color-feedback-error-bg)',    text: 'var(--ds-color-feedback-error-text)',    border: 'var(--ds-color-feedback-error-border)' },
  rejected:        { label: 'Rejected',      bg: 'var(--ds-color-feedback-error-bg)',    text: 'var(--ds-color-feedback-error-text)',    border: 'var(--ds-color-feedback-error-border)' },
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
