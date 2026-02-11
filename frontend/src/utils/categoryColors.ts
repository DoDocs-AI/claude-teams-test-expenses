const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F97316',
  Transportation: '#3B82F6',
  Housing: '#8B5CF6',
  Utilities: '#06B6D4',
  Entertainment: '#EC4899',
  Healthcare: '#10B981',
  Shopping: '#F59E0B',
  Other: '#6B7280',
};

const CUSTOM_PALETTE = [
  '#7C3AED',
  '#2563EB',
  '#059669',
  '#D97706',
  '#DC2626',
  '#9333EA',
  '#0891B2',
  '#65A30D',
  '#E11D48',
  '#4F46E5',
];

let customIndex = 0;

export function getCategoryColor(name: string): string {
  if (CATEGORY_COLORS[name]) return CATEGORY_COLORS[name];
  const color = CUSTOM_PALETTE[customIndex % CUSTOM_PALETTE.length];
  customIndex++;
  return color;
}

export function getCategoryColorMap(categoryNames: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  let ci = 0;
  for (const name of categoryNames) {
    if (CATEGORY_COLORS[name]) {
      map[name] = CATEGORY_COLORS[name];
    } else {
      map[name] = CUSTOM_PALETTE[ci % CUSTOM_PALETTE.length];
      ci++;
    }
  }
  return map;
}
