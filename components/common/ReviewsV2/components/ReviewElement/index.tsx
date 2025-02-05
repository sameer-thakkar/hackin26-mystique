import { useMemo, useRef } from 'react';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { onEnterKeyPress } from 'utils/gen';
import { getStars } from 'utils/productUtils';
import { getCountryFlagUrl, getRandomReviewerImage } from 'utils/reviewUtils';
import ArrowRight from 'assets/arrowRight';
import { useReviewElement } from './hooks/useReviewElement';
import {
  CarouselLastSlide,
  CountryAndDateContainer,
  CountryDateSeparator,
  LocalizeText,
  RatingContainer,
  ReviewCarouselItemWrapper,
  ReviewContent,
  ReviewContentWrapper,
  ReviewDateTime,
  ReviewerCountryFlag,
  ReviewerCountryName,
  ReviewerImage,
  ReviewHeader,
  ReviewImageCarouselContainer,
  ReviewWrapper,
  StyledBottomCTAContainer,
  StyledCTAText,
} from './styles';
import type { TReviewElementProps } from './types';
import { getCapitalizedFirstName } from './utils';

const ReviewElement = (props: TReviewElementProps) => {
  const {
    nonCustomerName,
    rating,
    reviewerImageUrl,
    reviewMedias = [],
    nonCustomerCountryCode,
    nonCustomerCountryName,
    useTranslatedContent,
    tourGroup,
    shouldFocusProductCardOnCTAClick = true,
  } = props;

  const reviewContentRef = useRef<HTMLDivElement>(null);

  const {
    reviewContent,
    toggleReviewContent,
    onMediaClick,
    handleBottomCTAClick,
    reviewTimeFormatted,
    finalReviewMedia,
    balanceImages,
    isProductCardPresent,
    getReviewContent,
  } = useReviewElement(props);

  const carouselItems = useMemo(
    () =>
      finalReviewMedia?.map(({ url }, index) => (
        <ReviewCarouselItemWrapper
          key={index}
          onClick={() => onMediaClick(index)}
          onKeyDown={(e) => onEnterKeyPress(e, onMediaClick, index)}
          role="button"
          tabIndex={0}
        >
          <Image width={80} height={106} url={url} alt="review-image" />

          <Conditional if={index === 2 && balanceImages}>
            <CarouselLastSlide>
              <div className="flexContainer">
                <p className="balanceImages">+ {balanceImages} more</p>
              </div>
            </CarouselLastSlide>
          </Conditional>
        </ReviewCarouselItemWrapper>
      )),
    [finalReviewMedia, onMediaClick, balanceImages]
  );

  return (
    <>
      <ReviewWrapper>
        <ReviewHeader $hasCountryDetails={!!nonCustomerCountryName}>
          <div className="row">
            <ReviewerImage>
              <Image
                className="reviewer-image"
                alt={nonCustomerName}
                url={
                  reviewerImageUrl ??
                  getRandomReviewerImage(nonCustomerName || '')
                }
                width={36}
                height={36}
              />
              <Conditional if={nonCustomerCountryCode}>
                <ReviewerCountryFlag>
                  <Image
                    url={getCountryFlagUrl(nonCustomerCountryCode!)}
                    alt={nonCustomerCountryCode ?? 'country flag'}
                    height={15}
                    width={15}
                    className="country-flag"
                  />
                </ReviewerCountryFlag>
              </Conditional>
            </ReviewerImage>
            <div className="column">
              <p className="reviewer-name block">
                {getCapitalizedFirstName(nonCustomerName)}
              </p>
              <CountryAndDateContainer>
                <Conditional if={nonCustomerCountryName}>
                  <ReviewerCountryName>
                    {nonCustomerCountryName}
                  </ReviewerCountryName>
                </Conditional>
                <Conditional
                  if={!!reviewTimeFormatted && nonCustomerCountryName}
                >
                  <CountryDateSeparator />
                </Conditional>
                <ReviewDateTime>{reviewTimeFormatted}</ReviewDateTime>
              </CountryAndDateContainer>
            </div>
          </div>

          <RatingContainer>{getStars(rating, 16)}</RatingContainer>
        </ReviewHeader>
        <Conditional if={reviewMedias?.length}>
          <ReviewImageCarouselContainer>
            {carouselItems}
          </ReviewImageCarouselContainer>
        </Conditional>

        <Conditional if={reviewContent}>
          <ReviewContentWrapper $hasMedia={reviewMedias?.length > 0}>
            <ReviewContent
              ref={reviewContentRef}
              className="translate"
              $shouldLimitLines={reviewMedias?.length > 0}
              $hasTranslation={useTranslatedContent}
            >
              {reviewContent}
            </ReviewContent>

            <Conditional if={useTranslatedContent}>
              <LocalizeText onClick={toggleReviewContent}>
                {getReviewContent()}
              </LocalizeText>
            </Conditional>
          </ReviewContentWrapper>
        </Conditional>

        <Conditional if={tourGroup}>
          <StyledBottomCTAContainer
            onClick={handleBottomCTAClick}
            $isClickable={
              shouldFocusProductCardOnCTAClick && isProductCardPresent
            }
          >
            <StyledCTAText
              className="block"
              $isClickable={isProductCardPresent}
            >
              {tourGroup?.urlText}
            </StyledCTAText>
            <Conditional
              if={shouldFocusProductCardOnCTAClick && isProductCardPresent}
            >
              <div className="arrow-right">
                <ArrowRight />
              </div>
            </Conditional>
          </StyledBottomCTAContainer>
        </Conditional>
      </ReviewWrapper>
    </>
  );
};

export default ReviewElement;
