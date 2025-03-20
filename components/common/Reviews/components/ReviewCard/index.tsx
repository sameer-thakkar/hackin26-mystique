import { useContext } from 'react';
import { getIntlDate } from '@headout/espeon/utils/date';
import Conditional from 'components/common/Conditional';
import { RatingStars } from 'components/ReviewsPage/components/ReviewCount';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { convertUidToUrl } from 'utils/urlUtils';
import { StarIcon } from 'const/descriptorIcons';
import { strings } from 'const/strings';
import Avatar from 'assets/avatar';
import {
  ImageWrapper,
  MetaInfo,
  Review,
  ReviewContentWrapper,
  ReviewHeader,
  ReviewStarsWrapper,
  Separator,
  Wrapper,
} from './styles';

export const ReviewStars = () => {
  const numberOfStars = [0, 1, 2, 3, 4];
  return (
    <>
      <ReviewStarsWrapper>
        {numberOfStars.map((_, index) => {
          return <StarIcon key={index} />;
        })}
      </ReviewStarsWrapper>
    </>
  );
};

const ReviewContent = (props: any) => {
  const { lang } = useContext(MBContext);

  const { reviewImageUrl, nonCustomerName, content, reviewTime, rating } =
    props;

  const formattedTime = getIntlDate({
    date: reviewTime,
    dateFormat: 'MMM-YYYY',
    lang,
  });

  return (
    <ReviewContentWrapper>
      <Image
        url={reviewImageUrl}
        width={108}
        height={173}
        alt="Experience"
        className="review-image"
        loadHigherQualityImage={true}
      />
      <Review>
        <ReviewHeader>
          <ImageWrapper>{Avatar}</ImageWrapper>
          <MetaInfo>
            <h5>{nonCustomerName}</h5>
            <RatingStars averageRating={rating} />
          </MetaInfo>
        </ReviewHeader>
        <div className="content" lang={lang}>
          {content}
        </div>
        <div className="formatted-time">{formattedTime}</div>
      </Review>
    </ReviewContentWrapper>
  );
};

const ReviewCard = (props: any) => {
  const { lang, host } = useContext(MBContext);
  const {
    tourGroupName,
    tourGroupId,
    reviewMedia,
    customerName,
    rating,
    content,
    reviewTime,
    tgidToReviewsPageUidMapping,
  } = props;
  const { NEWS_PAGE } = strings;
  const { SHOW_ALL_REVIEWS } = NEWS_PAGE;

  const reviewsPageUrl = convertUidToUrl({
    uid: tgidToReviewsPageUidMapping?.[tourGroupId] ?? '',
    lang,
    hostname: host,
  });

  return (
    <>
      <Wrapper>
        <h4>{tourGroupName}</h4>
        <Separator />
        <ReviewContent
          reviewImageUrl={reviewMedia}
          nonCustomerName={customerName}
          rating={rating}
          content={content}
          reviewTime={reviewTime}
        />
        <Conditional if={reviewsPageUrl}>
          <a href={reviewsPageUrl} className="show-all-reviews">
            {SHOW_ALL_REVIEWS}
          </a>
        </Conditional>
      </Wrapper>
    </>
  );
};

export default ReviewCard;
