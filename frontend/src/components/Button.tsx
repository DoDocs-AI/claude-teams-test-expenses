import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
  danger: {
    backgroundColor: 'var(--color-danger)',
    color: '#FFFFFF',
    border: 'none',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-primary)',
    border: 'none',
  },
};

export function Button({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      style={{
        height: 40,
        padding: '0 16px',
        borderRadius: 'var(--radius-btn)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontWeight: 500,
        transition: 'background-color 0.15s, opacity 0.15s',
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: 16,
            height: 16,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
}
