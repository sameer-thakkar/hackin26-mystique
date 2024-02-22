import { TTrackEvent } from 'utils/analytics';

export type TContributorsReviewProps = {
  heading: string;
  content: RichTextField;
  redirectionLink: string;
  authorImage: string;
  authorName: string;
  date: Date;
  handleReadMoreCtaClick: Function;
  trackingObject: TTrackEvent;
};
