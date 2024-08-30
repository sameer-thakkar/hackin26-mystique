import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { PrismicRichText } from '@prismicio/react';
import dayjs from 'dayjs';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import { RatingStars } from 'components/ReviewsPage/components/ReviewCount';
import {
  Author,
  Avatar,
  Date,
  MetaInfo,
  Rating,
  RatingCount,
  ReviewContent,
  ReviewHeader,
  ReviewWrapper,
  TitleWrapper,
  Wrapper,
} from 'components/ReviewsPage/components/Reviews/styles';
import SortSelector from 'components/ReviewsPage/components/SortByPopup';
import { getUICompatibleReviewsData } from 'components/ReviewsPage/utils';
import TabWrapper from 'components/slices/TabWrapper';
import Button from 'UI/Button';
import Image from 'UI/Image';
import { useIsFirstRender } from 'hooks/useIsFirstRender';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { sendLog } from 'utils/logger';
import { shortCodeSerializer } from 'utils/shortCodes';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  FILTER_RATING_TO_API_PARAM_MAPPING,
  QUERY_PARAMS,
  REVIEWS_PAGE_SECTIONS,
} from 'const/index';
import { strings } from 'const/strings';
import { withTrailingSlash } from '../../../../utils/helper';
import { TReviewsProps, TReviewUIProps } from './interface';

const ReviewUI: React.FC<TReviewUIProps> = ({
  repeatableContent,
  showSortBySelector,
  isLoading,
  handleOnClick,
  showLoadMoreCTA,
  isMobile,
}) => {
  const { NEWS_PAGE } = strings;
  const { LOAD_MORE } = NEWS_PAGE;

  return (
    <Conditional if={!!repeatableContent?.length}>
      <Conditional if={showSortBySelector}>
        <SortSelector isMobile={isMobile} />
      </Conditional>
      {repeatableContent?.map((review, index) => {
        const {
          author_name,
          origin_website,
          origin_website_link,
          review_date,
          rating,
          review: reviewContent,
          reviewer_img_url: reviewerImgUrl,
        } = review;

        const formattedDate = dayjs(review_date).format('MMM, YYYY');
        const commaPresence = origin_website_link?.url ? ',' : '';
        const spacePresence = author_name ? ' ' : '';
        const anchorTarget = origin_website_link?.target;

        return (
          <ReviewWrapper key={index} $isLoading={isLoading}>
            <ReviewHeader>
              <Conditional if={reviewerImgUrl}>
                <Avatar>
                  <Image
                    url={reviewerImgUrl}
                    alt="Avatar"
                    height={44}
                    width={44}
                  />
                </Avatar>
              </Conditional>
              <MetaInfo>
                <TitleWrapper>
                  <Author>
                    <Conditional if={author_name}>
                      <h3 className="author-name">{`${author_name}${commaPresence}`}</h3>
                    </Conditional>
                    <Conditional if={origin_website_link?.url}>
                      <a href={origin_website_link?.url} target={anchorTarget}>
                        {`${spacePresence}${origin_website}`}
                      </a>
                    </Conditional>
                  </Author>
                  <Date>{formattedDate}</Date>
                </TitleWrapper>
                <Rating>
                  <Conditional if={rating}>
                    <RatingStars averageRating={rating} isComponentVisible />
                    <RatingCount>{`${rating}/5`}</RatingCount>
                  </Conditional>
                </Rating>
              </MetaInfo>
            </ReviewHeader>
            <ReviewContent>
              <Conditional if={typeof reviewContent === 'string'}>
                {reviewContent}
              </Conditional>
              <Conditional if={typeof reviewContent !== 'string'}>
                <PrismicRichText
                  field={reviewContent}
                  components={shortCodeSerializer}
                />
              </Conditional>
            </ReviewContent>
          </ReviewWrapper>
        );
      })}
      <Conditional if={showLoadMoreCTA}>
        <Button onClick={handleOnClick}>{LOAD_MORE}</Button>
      </Conditional>
    </Conditional>
  );
};

const Reviews: React.FC<TReviewsProps> = ({
  criticReviewsData,
  reviewsData,
  tgid,
  isMobile,
  trackingObject,
}) => {
  const router = useRouter();
  const sliceRef = useRef(null);
  const isFirstRender = useIsFirstRender();
  const [reviewEndpoint, setReviewEndpoint] = useState<string | null>(null);
  const { data, error, isValidating } = useSWR(reviewEndpoint, {
    fetcher: swrFetcher,
  });
  const [criticReviewsToShow, setcriticReviewsToShow] = useState(5);
  const [isLoadMoreCtaClicked, setLoadMoreCtaClicked] = useState(false);
  const [userReviewsData, setUserReviewsData] = useState(
    reviewEndpoint && data
      ? getUICompatibleReviewsData(data.items)
      : getUICompatibleReviewsData(reviewsData?.items)
  );
  const isComponentVisible = useOnScreen({
    ref: sliceRef,
    unobserve: true,
  });
  const { query } = router;

  const isLoading = !data && !error && isValidating;
  const { REVIEWS_PAGE } = strings;
  const { CRITIC_REVIEWS, USER_REVIEWS } = REVIEWS_PAGE;
  const filterRatingParamValue =
    FILTER_RATING_TO_API_PARAM_MAPPING[
      query[QUERY_PARAMS.FILTER_REVIEWS] as string
    ];
  const isFilterReviewQueryParamViable =
    (query[QUERY_PARAMS.FILTER_REVIEWS] as string) in
    FILTER_RATING_TO_API_PARAM_MAPPING;
  const nextPaginatedUrl = reviewEndpoint
    ? data?.nextUrl
    : reviewsData?.nextUrl;

  /*
   * Using `queryParams` as the source of truth and listening to it,
   * instead of listening directly to onClick event on SortSelector component.
   */
  useEffect(() => {
    if (query[QUERY_PARAMS.FILTER_REVIEWS] && !isFirstRender) {
      const reviewEndpoint = getHeadoutApiUrl({
        endpoint: HeadoutEndpoints.TourGroupReviewsV2,
        id: tgid,
        params: {
          ...(query[QUERY_PARAMS.FILTER_REVIEWS] &&
            isFilterReviewQueryParamViable && {
              'filter-type': filterRatingParamValue['filter-type'],
              'sort-type': filterRatingParamValue['sort-type'],
              'sort-order': filterRatingParamValue['sort-order'],
              limit: '5',
            }),
        },
      });
      setReviewEndpoint(reviewEndpoint);
      setLoadMoreCtaClicked(false);
    }
  }, [query]);

  useEffect(() => {
    if (data?.items) {
      if (isLoadMoreCtaClicked) {
        setUserReviewsData([
          ...userReviewsData,
          ...getUICompatibleReviewsData(data.items),
        ]);
      } else {
        setUserReviewsData([...getUICompatibleReviewsData(data.items)]);
      }
    }
  }, [data, isLoadMoreCtaClicked, query]);

  useEffect(() => {
    if (isComponentVisible) {
      trackEvent(trackingObject);
    }
  }, [isComponentVisible]);

  const getNextSetOfData = () => {
    if (nextPaginatedUrl) {
      const formattedEndpointSlug = nextPaginatedUrl.replace('/tours/', '/');
      /**
       * NOTE:
       * Ensure that the following API endpoint is ending with a trailing slash "/"
       * This is being done to prevent creating duplicate records on CDN.
       */
      const paginatedUrl = withTrailingSlash(
        `https://api.headout.com${formattedEndpointSlug}`
      );
      setReviewEndpoint(paginatedUrl);
      setLoadMoreCtaClicked(true);
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.REVIEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.LOAD_MORE,
      [ANALYTICS_PROPERTIES.SECTION]: REVIEWS_PAGE_SECTIONS.USER_REVIEWS,
    });
  };

  const handleCriticsLoadMoreClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.REVIEWS_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.LOAD_MORE,
      [ANALYTICS_PROPERTIES.SECTION]: REVIEWS_PAGE_SECTIONS.CRITIC_REVIEWS,
    });
    setcriticReviewsToShow(criticReviewsToShow + 5);
  };

  const tabsArray = [];

  if (criticReviewsData?.length) {
    tabsArray.push({
      heading: CRITIC_REVIEWS,
      children: (
        <ReviewUI
          repeatableContent={criticReviewsData?.slice(0, criticReviewsToShow)}
          showSortBySelector={false}
          isLoading={false}
          handleOnClick={handleCriticsLoadMoreClick}
          showLoadMoreCTA={criticReviewsToShow <= criticReviewsData?.length}
          isMobile={isMobile}
        />
      ),
    });
  }

  if (userReviewsData?.length) {
    tabsArray.push({
      heading: USER_REVIEWS,
      children: (
        <ReviewUI
          repeatableContent={userReviewsData}
          showSortBySelector
          isLoading={isLoading}
          handleOnClick={getNextSetOfData}
          showLoadMoreCTA={nextPaginatedUrl}
          isMobile={isMobile}
        />
      ),
    });
  }

  if (error) {
    sendLog({
      err: error,
      message: `Error while fetching reviews`,
    });
    return null;
  }

  if (!tabsArray.length) {
    return <></>;
  }

  return (
    <Wrapper id="reviews-section">
      <TabWrapper tabElements={tabsArray} renderTabElements={true} />
    </Wrapper>
  );
};

export default Reviews;
