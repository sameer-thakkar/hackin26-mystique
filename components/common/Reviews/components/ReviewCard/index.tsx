import { useContext } from 'react';
// import Conditional from 'components/common/Conditional';
// import Button from 'UI/Button';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { formatDateToString } from 'utils/dateUtils';
import { StarIcon } from 'const/descriptorIcons';
// import { strings } from 'const/strings';
import Avatar from 'assets/avatar';
import {
  // Gradient,
  ImageWrapper,
  MetaInfo,
  Review,
  ReviewContentWrapper,
  ReviewHeader,
  ReviewStarsWrapper,
  Separator,
  Wrapper,
} from './styles';

const ReviewStars = () => {
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

  const { reviewImageUrl, nonCustomerName, content, reviewTime } = props;

  const formattedTime = formatDateToString(reviewTime, 'EN', 'MMM, YYYY');

  return (
    <ReviewContentWrapper>
      <Image
        url={reviewImageUrl}
        width={108}
        height={173}
        alt="Experience"
        className="review-image"
      />
      <Review>
        <ReviewHeader>
          <ImageWrapper>{Avatar}</ImageWrapper>
          <MetaInfo>
            <h5>{nonCustomerName}</h5>
            <ReviewStars />
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
  const {
    tourGroupName,
    reviewMedia,
    customerName,
    rating,
    content,
    reviewTime,
    // isMobile,
  } = props;
  // const { NEWS_PAGE } = strings;
  // const { SHOW_ALL_REVIEWS } = NEWS_PAGE;

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
        {/* <Conditional if={!isMobile}>
          <Button widthProp="100%" className="show-all-reviews">
            {SHOW_ALL_REVIEWS}
          </Button>
        </Conditional> */}
      </Wrapper>
      {/* <Gradient /> */}
    </>
  );
};

export default ReviewCard;
