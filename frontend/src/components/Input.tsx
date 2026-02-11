import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

export function Input({ label, error, prefix, id, style, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          htmlFor={inputId}
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
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span
            style={{
              position: 'absolute',
              left: 12,
              color: 'var(--color-text-secondary)',
              pointerEvents: 'none',
            }}
          >
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-invalid={!!error}
          style={{
            width: '100%',
            height: 40,
            padding: prefix ? '0 12px 0 28px' : '0 12px',
            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-input)',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            ...style,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
            e.target.style.boxShadow = '0 0 0 2px var(--color-primary-light)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)';
            e.target.style.boxShadow = 'none';
            props.onBlur?.(e);
          }}
          {...props}
        />
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4 }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
