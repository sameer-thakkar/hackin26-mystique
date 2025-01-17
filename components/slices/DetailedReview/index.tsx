import React, { useEffect, useRef, useState } from 'react';
import { PrismicRichText } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import { REVIEWS_PAGE_SECTIONS, SLICE_TYPES } from 'const/index';
import { strings } from 'const/strings';
import ChevronDown from 'assets/chevronDown';
import DOUBLE_QUOTES from 'assets/doubleQuotes';
import { TDetailedReviewProps } from './interface';
import {
  Content,
  Description,
  HeadingWrapper,
  Separator,
  SubContent,
  SubDescription,
  Toggle,
  Wrapper,
} from './styles';

const DetailedReview: React.FC<
  React.PropsWithChildren<TDetailedReviewProps>
> = ({
  heading = strings.REVIEWS_PAGE.REVIEW_BY_HEADOUT,
  description,
  repeatableContent,
  handleReadMoreClick,
  trackingObject,
}) => {
  const [expanded, setExpand] = useState(false);
  const sliceRef = useRef(null);
  const isSliceVisible = useOnScreen({
    ref: sliceRef,
    unobserve: true,
  });
  const { READ_MORE, READ_LESS, REVIEWS_PAGE } = strings;
  const { REVIEW_BY_HEADOUT } = REVIEWS_PAGE;

  const toggleJSX = (
    <>
      {expanded ? READ_LESS : READ_MORE}
      <ChevronDown />
    </>
  );

  useEffect(() => {
    if (isSliceVisible) {
      trackEvent(trackingObject);
    }
  }, [isSliceVisible]);

  return (
    <Conditional if={!!description || !!repeatableContent?.length}>
      <Wrapper ref={sliceRef}>
        <HeadingWrapper>
          <h2>{heading ?? REVIEW_BY_HEADOUT}</h2>
          <DOUBLE_QUOTES />
        </HeadingWrapper>
        <Content>
          <Description>
            <PrismicRichText
              field={description}
              components={(...defaultArgs: any) =>
                shortCodeSerializerWithParentProps(defaultArgs, {
                  sectionName: heading ?? REVIEW_BY_HEADOUT,
                  sliceType: SLICE_TYPES.DETAILED_REVIEW,
                })
              }
            />
          </Description>
          <Conditional if={repeatableContent?.length}>
            <Toggle
              onClick={() => {
                handleReadMoreClick(REVIEWS_PAGE_SECTIONS.DETAILED_REVIEW);
                setExpand(!expanded);
              }}
              $expanded={expanded}
            >
              {toggleJSX}
            </Toggle>
            <Conditional if={expanded}>
              <SubContent>
                {repeatableContent?.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <h3>{item.subheading}</h3>
                      <SubDescription>
                        <PrismicRichText
                          field={item.subdescription}
                          components={(...defaultArgs: any) =>
                            shortCodeSerializerWithParentProps(defaultArgs, {
                              sectionName: heading ?? REVIEW_BY_HEADOUT,
                              sliceType: SLICE_TYPES.DETAILED_REVIEW,
                            })
                          }
                        />
                      </SubDescription>
                      <Conditional if={index < repeatableContent?.length - 1}>
                        <Separator />
                      </Conditional>
                    </React.Fragment>
                  );
                })}
              </SubContent>
            </Conditional>
          </Conditional>
        </Content>
      </Wrapper>
    </Conditional>
  );
};

export default DetailedReview;
