import type { SpacingToken } from '@headout/pixie/tokens';

export type TCardGridProps<T> = {
  cards: T[];
  columns: number;
  CardComponent: React.ComponentType<T>;
  horizontalSpace?: SpacingToken;
  verticalSpace?: SpacingToken;
};
