import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{
            display: 'block',
            marginBottom: 4,
            fontWeight: 500,
            color: 'var(--color-text)',
          }}
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        aria-describedby={error ? `${selectId}-error` : undefined}
        aria-invalid={!!error}
        style={{
          width: '100%',
          height: 40,
          padding: '0 12px',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-input)',
          outline: 'none',
          backgroundColor: 'var(--color-surface)',
          cursor: 'pointer',
          appearance: 'auto',
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p
          id={`${selectId}-error`}
          style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4 }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
