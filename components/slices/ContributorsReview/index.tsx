import React, { useEffect, useRef } from 'react';
import { asText } from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import dayjs from 'dayjs';
import Conditional from 'components/common/Conditional';
import { getRandomImage } from 'components/ReviewsPage/utils';
import Image from 'UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import { REVIEWS_PAGE_SECTIONS, SLICE_TYPES } from 'const/index';
import { strings } from 'const/strings';
import ContributorsReviewDoubleQuotes from 'assets/contributorsReviewDoubleQuotes';
import { TContributorsReviewProps } from './interface';
import {
  Author,
  AuthorMetaInfo,
  AuthorName,
  BottomRightSvg,
  Date,
  Heading,
  ReviewWrapper,
  Separator,
  TopLeftSvg,
  Wrapper,
} from './styles';

const ContributorsReview: React.FC<TContributorsReviewProps> = ({
  heading,
  content,
  redirectionLink,
  authorImage,
  authorName,
  date,
  handleReadMoreCtaClick,
  trackingObject,
}) => {
  const sliceRef = useRef(null);
  const isSliceVisible = useOnScreen({
    ref: sliceRef,
    unobserve: true,
  });
  const { REVIEWS_PAGE, READ_MORE } = strings;
  const { CONTRIBUTORS_REVIEW } = REVIEWS_PAGE;
  const formattedDate = dayjs(date).format('MMM, YYYY');

  useEffect(() => {
    if (isSliceVisible) {
      trackEvent(trackingObject);
    }
  }, [isSliceVisible]);

  return (
    <Conditional if={asText(content)?.length > 0}>
      <Wrapper ref={sliceRef}>
        <Heading>{heading ?? CONTRIBUTORS_REVIEW}</Heading>
        <ReviewWrapper>
          <TopLeftSvg>
            <ContributorsReviewDoubleQuotes />
          </TopLeftSvg>
          <BottomRightSvg>
            <ContributorsReviewDoubleQuotes />
          </BottomRightSvg>
          <PrismicRichText
            field={content}
            components={(...defaultArgs: any) =>
              shortCodeSerializerWithParentProps(defaultArgs, {
                sectionName: heading ?? CONTRIBUTORS_REVIEW,
                sliceType: SLICE_TYPES.CONTRIBUTORS_REVIEW,
              })
            }
          />
          <a
            href={redirectionLink}
            onClick={() =>
              handleReadMoreCtaClick(REVIEWS_PAGE_SECTIONS.CONTRIBUTOR_REVIEW)
            }
          >
            {READ_MORE}
          </a>
          <Separator />
          <Author>
            <Image
              url={authorImage ?? getRandomImage(authorName)}
              height={38}
              width={38}
              alt="Author Profile"
            />
            <AuthorMetaInfo>
              <AuthorName>{authorName}</AuthorName>
              <Date>{formattedDate}</Date>
            </AuthorMetaInfo>
          </Author>
        </ReviewWrapper>
      </Wrapper>
    </Conditional>
  );
};
export default ContributorsReview;
