import React from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Rating from 'UI/Rating';
import Image from 'UI/Image';
import COLORS from 'const/colors';
import { QUOTES } from 'assets/SvgIcons';
import { generateSidenavId } from 'utils/helper';

const Slider = dynamic(() => import('UI/Slider'));
dayjs.extend(relativeTime);

const StyledReviews = styled.div`
  width: 690px;
  margin: 0 auto 20px auto;
  position: relative;
  ${({ reviewType }: { reviewType: string | null }) => {
    if (reviewType === 'testimonial') {
      return `
        .custom-pagination {
          bottom: 40px;
          right: 64px;
          z-index: 1;
        }
    `;
    }
    return `
      .custom-pagination {
        top: 110%;
        left: 50%;
        transform: translateX(-50%);
      } 
    `;
  }}
  .slider-bullet {
    background-color: ${(props) => props.theme.primaryColor};
  }
  @media (max-width: 768px) {
    width: 100%;
    ${({ reviewType }) => {
      if (reviewType === 'testimonial') {
        return `
        .custom-pagination {
          top: 95%;
          left: 50%;
          transform: translateX(-50%);
        }
      `;
      }
    }}
  }
`;

const Title = styled.h2`
  font-size: 24px !important;
  line-height: 28px !important;
  font-weight: unset !important;
  display: block !important;
  text-align: center;
  margin-bottom: 32px;
  ::after {
    content: unset !important;
  }
`;

const Quotes = styled.div`
  position: absolute;
  top: 94px;
  left: 32px;
  @media (max-width: 768px) {
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Review = styled.div`
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 8px;
  min-height: 300px;
  @media (max-width: 768px) {
    padding-bottom: 30px;
  }
`;

const ReviewContent = styled.div`
  margin: 60px 64px 40px 64px;
  @media (max-width: 768px) {
    margin: 60px 16px 40px 16px;
  }
`;

const ReviewText = styled.div`
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 34px;
`;

const ReviewBottom = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Reviewer = styled.div`
  width: fit-content;
  display: grid;
  grid-column-gap: 16px;
  grid-template-areas: 'image name' 'image subtext';
`;

const ReviewerImage = styled.div`
  grid-area: image;
  width: 48px;
  height: 48px;
  img {
    width: 100%;
    border-radius: 50%;
  }
`;

const ReviewerName = styled.div`
  font-size: 16px;
  line-height: 24px;
`;

const ReviewerSubtext = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: ${COLORS.GRAY.G4};
`;

const RatingWrapper = styled.div`
  justify-self: flex-end;
  @media (max-width: 768px) {
    margin-top: 32px;
    justify-self: start;
  }
`;

const RatingTime = styled.div`
  margin-top: 10px;
  text-align: right;
  font-size: 12px;
  line-height: 16px;
  color: ${COLORS.GRAY.G4};
`;

/**
 * A slice for displaying reviews/testimonials.
 *
 * Video Tutorial:
 *
 * <div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/aa05669787c245f1b970a020fadc3e78" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - Title
 * - Type
 *  - Can be regular or a testimonial. Regular will display the rating and testimonial will not.
 *
 * ### Repeatable zone
 * - Reviewer Image
 *  - If left blank an image will by fetched from the S3 bucket.
 * - Review Text
 *  - The reviews text
 * - Reviewer Name *
 * - Reviewer Subtext
 *  - The text that appears below the reviewer.
 * - Rating
 *  - Rating given. If blank, defaults to 4.5. If 5 < rating < 0 then defaults to 4.5.
 * - Rating Date
 *
 */

const Reviews: React.FC<{
  title: string;
  type?: string;
  reviews: any[];
}> = ({ type = 'regular', title = '', reviews }) => {
  const reviewSlides = reviews
    .filter((review) => !!review.review_text?.length)
    .map((review, index) => {
      const n = (index % 202) + 1;

      return {
        reviewText: review.review_text,
        reviewerName: review.reviewer_name,
        reviewerSubtext: review.reviewer_subtext,
        imageUrl:
          review.reviewer_image_url.url ||
          review.reviewer_image?.url ||
          `https://cdn-s3-open.headout.com/reviews/${n}.jpg`,
        imageAlt:
          review.reviewer_image_alt ||
          review.reviewer_image?.alt ||
          'reviewer-image',
        rating: review.rating
          ? review.rating > 5 || 0 > review.rating
            ? 4.5
            : review.rating
          : 4.5,
        ratingDate: review.rating_date
          ? dayjs(review.rating_date).fromNow()
          : '',
      };
    });

  return (
    <StyledReviews reviewType={type}>
      <Title id={generateSidenavId(title)}>{title}</Title>
      <Quotes>{QUOTES}</Quotes>
      <Slider
        sliderOptions={{
          slidesPerView: 1,
          autoHeight: true,
        }}
        paginationClass="custom-pagination"
      >
        {reviewSlides.map(
          (
            {
              reviewText,
              reviewerName,
              reviewerSubtext,
              imageUrl,
              imageAlt,
              rating,
              ratingDate,
            },
            index
          ) => (
            <Review key={index}>
              <ReviewContent>
                <ReviewText>{reviewText}</ReviewText>
                <ReviewBottom>
                  <Reviewer>
                    <ReviewerImage>
                      <Image
                        url={imageUrl}
                        alt={imageAlt}
                        height={48}
                        width={48}
                      />
                    </ReviewerImage>
                    <ReviewerName>{reviewerName}</ReviewerName>
                    <ReviewerSubtext>{reviewerSubtext}</ReviewerSubtext>
                  </Reviewer>
                  {type === 'regular' ? (
                    <RatingWrapper>
                      <Rating fillColor={COLORS.BRAND.CANDY} value={rating} />
                      <RatingTime>{ratingDate}</RatingTime>
                    </RatingWrapper>
                  ) : null}
                </ReviewBottom>
              </ReviewContent>
            </Review>
          )
        )}
      </Slider>
    </StyledReviews>
  );
};

export default Reviews;
