import type { TReviewMedia } from 'types/reviews';
import { getFirstName, isDefaultReviewerName } from 'utils/reviewUtils';
import { titleCase } from 'utils/stringUtils';

export const getCapitalizedFirstName = (nonCustomerName: string) => {
  if (!nonCustomerName) return '';

  return isDefaultReviewerName(nonCustomerName)
    ? nonCustomerName
    : titleCase(getFirstName(nonCustomerName));
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
