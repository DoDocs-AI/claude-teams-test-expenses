import { useToast, type ToastType } from '../context/ToastContext';

const borderColors: Record<ToastType, string> = {
  success: 'var(--color-success)',
  error: 'var(--color-danger)',
  info: 'var(--color-primary)',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          aria-live="polite"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            maxWidth: 360,
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-card)',
            borderLeft: `4px solid ${borderColors[toast.type]}`,
            animation: 'slideIn 0.2s ease-out',
          }}
        >
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: 4,
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}
