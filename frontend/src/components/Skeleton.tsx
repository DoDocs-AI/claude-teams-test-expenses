interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
}: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#E5E7EB',
        animation: 'pulse 1.5s infinite',
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div
      style={{
        padding: 20,
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <Skeleton width={80} height={12} />
      <div style={{ marginTop: 12 }}>
        <Skeleton width={120} height={28} />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: '12px 0',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <Skeleton width={80} height={16} />
      <Skeleton width={100} height={16} />
      <Skeleton width="1fr" height={16} />
      <Skeleton width={80} height={16} />
    </div>
  );
}
