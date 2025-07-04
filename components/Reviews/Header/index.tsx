import { useContext, useMemo } from 'react';
import { getIntlDate } from '@headout/espeon/utils/date';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { getStars } from 'utils/productUtils';
import { getRandomReviewerImage, isDefaultReviewerName } from 'utils/reviewUtils';
import { strings } from 'const/strings';
import { StyledReviewHeader } from './styles';
import { TReviewHeaderProps } from './types';

const ReviewHeader = ({
  reviewerImgUrl,
  nonCustomerName,
  reviewTime,
  rating,
  isPartner = false,
}: TReviewHeaderProps) => {
  const customerFirstName = useMemo(() => {
    if (!nonCustomerName) return '';
    if (isDefaultReviewerName(nonCustomerName))
      return nonCustomerName;
    return nonCustomerName?.split(' ')?.[0];
  }, [nonCustomerName]);

  const { lang } = useContext(MBContext);

  const datePublished = getIntlDate({
    date: new Date(reviewTime).toString(),
    dateFormat: 'MMM-YYYY',
    lang,
  });

  return (
    <StyledReviewHeader>
      <div className="review-header">
        <div className="pfp">
          <Image
            url={
              reviewerImgUrl ?? getRandomReviewerImage(nonCustomerName ?? '')
            }
            alt="reviewer"
          />
        </div>
        <div className="name">{customerFirstName ?? nonCustomerName}</div>
        <div className="date">
          {datePublished}
          <span className="verified">
            {isPartner
              ? strings.REVIEWS_SECTION.VERIFIED_REVIEW
              : strings.TRUST_VB_TAG}
          </span>
        </div>
        <div className="rating">
          {getStars(rating)}
          <span className="rating-count">{rating}/5</span>
        </div>
      </div>
    </StyledReviewHeader>
  );
};

export default ReviewHeader;
