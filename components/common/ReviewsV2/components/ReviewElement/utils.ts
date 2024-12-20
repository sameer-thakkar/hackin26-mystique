import type { TReviewMedia } from 'types/reviews';
import { getFirstName } from 'utils/reviewUtils';
import { titleCase } from 'utils/stringUtils';
import { DEFAULT_REVIEWER_NAME } from 'const/index';

export const getCapitalizedFirstName = (nonCustomerName: string) => {
  return titleCase(
    (nonCustomerName ?? '').toLowerCase().trim() === DEFAULT_REVIEWER_NAME
      ? nonCustomerName ?? ''
      : getFirstName(nonCustomerName)
  );
};

export const parseReviewMedia = ({
  media,
  id,
}: {
  media: TReviewMedia[];
  id: number;
}) => {
  return media.map((item, index) => ({
    ...item,
    location: {
      localIndex: index,
      reviewId: id,
      globalIndex: -1,
    },
    alt: `review-${id}-media-${index}`,
  }));
};
