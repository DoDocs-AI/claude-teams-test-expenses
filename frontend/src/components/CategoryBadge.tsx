import { getCategoryColor } from '../utils/categoryColors';

interface CategoryBadgeProps {
  name: string;
}

export function CategoryBadge({ name }: CategoryBadgeProps) {
  const color = getCategoryColor(name);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 10px',
        borderRadius: 'var(--radius-badge)',
        backgroundColor: color + '15',
        color: color,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
      {name}
    </span>
  );
}
