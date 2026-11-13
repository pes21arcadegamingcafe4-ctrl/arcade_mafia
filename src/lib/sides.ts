import type { Side } from '@/types';

export const SIDES: { value: Side; label: string; color: string }[] = [
  { value: 'mafia', label: 'مافیا', color: 'text-gold-500' },
  { value: 'citizen', label: 'شهروند', color: 'text-ice-400' },
];

export function getSideLabel(side: Side): string {
  return SIDES.find((s) => s.value === side)?.label ?? side;
}

export function getSideColor(side: Side): string {
  return SIDES.find((s) => s.value === side)?.color ?? '';
}
