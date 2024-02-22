export type TReviewsSectionProps = {
  criticsReviewsRepeatableContent: Record<string, any>[];
  reviewsData: Record<string, any>;
  tgidData: Record<string, any>;
  isMobile: boolean;
  contributorsReviewHeading: string;
  contributorsReviewContent: RichTextField;
  redirectionLink: {
    url: string;
  };
  contributorsReviewAuthorImage: {
    url: string;
  };
  contributorsReviewAuthorName: string;
  date: Date;
  handleReadMoreCtaClick: Function;
};
