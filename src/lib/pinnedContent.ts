export const PINNED_MARKER = '[PINNED]';

const pinnedPattern = /^\[PINNED\]\s*/i;

export function isPinnedText(value?: string | null): boolean {
  return typeof value === 'string' && pinnedPattern.test(value.trim());
}

export function stripPinnedMarker(value?: string | null): string {
  if (!value) return '';
  return value.replace(pinnedPattern, '').trim();
}

export function setPinnedText(value: string | null | undefined, pinned: boolean): string | null {
  const cleaned = stripPinnedMarker(value);

  if (pinned) {
    return cleaned ? `${PINNED_MARKER} ${cleaned}` : PINNED_MARKER;
  }

  return cleaned || null;
}

export function sortPinnedFirst<T>(items: T[], getPinnedState: (item: T) => boolean): T[] {
  return [...items].sort((left, right) => Number(getPinnedState(right)) - Number(getPinnedState(left)));
}
