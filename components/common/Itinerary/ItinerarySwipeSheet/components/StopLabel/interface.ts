import type { CombinedStopAndPassby } from 'utils/itinerary';

export type TStopLabelProps = {
  stopCardProps: CombinedStopAndPassby[];
  currentStop: number;
  skipAnimation?: boolean;
};
