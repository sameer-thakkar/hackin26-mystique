import { TTrackEvent } from 'utils/analytics';

export type TDetailedReviewProps = {
  heading?: string;
  description: RichTextField;
  repeatableContent: Record<string, any>[];
  handleReadMoreClick: Function;
  trackingObject: TTrackEvent;
};
