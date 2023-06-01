import React, { useState, useEffect } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import Chevron from 'components/UI/Chevron';
import COLORS from 'const/colors';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { useRecoilValue } from 'recoil';
import { metaAtom } from 'store/atoms/meta';
import { expandFontToken } from 'const/typography';
import Image from 'UI/Image';
import Button from 'UI/Button';
import { strings } from 'const/strings';
import { FONTS } from 'const/fonts';

export const StyledAccordion = styled.div`
  padding: 16px 0;
  margin-right: ${({
    // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
    isGlobalMb,
  }) => (isGlobalMb ? '0' : '24px')};
  border-bottom: 1px solid ${COLORS.GRAY.G7};
  display: grid;
  grid-template-rows: max-content max-content;
  ${({
    // @ts-expect-error TS(2339): Property 'isOpen' does not exist on type 'Pick<Det... Remove this comment to see the full error message
    isOpen,
  }) => isOpen && 'grid-row-gap: 8px'};

  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    ${({
      // @ts-expect-error TS(2339): Property 'isOpen' does not exist on type 'Pick<Det... Remove this comment to see the full error message
      isOpen,
    }) => isOpen && 'grid-row-gap: 16px'};
    margin-right: 0;
    padding: 16px 0;

    &:first-child {
      border-top: ${({
        // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
        isGlobalMb,
      }) => isGlobalMb && `1px solid ${COLORS.GRAY.G7}`};
      border-top: 1px solid ${COLORS.GRAY.G7};
    }
    &.accordion-container[expanded] header .chevron-icon {
      &::before {
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }
      &::after {
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
      }
    }
  }
`;

const Title = styled.div<{
  headingNeedsSeparator: boolean;
  isVenuePage?: boolean;
}>`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: 10px;
  ${({ isVenuePage }) =>
    isVenuePage
      ? `
     ${expandFontToken(FONTS.SUBHEADING_LARGE)};
   `
      : `
    ${expandFontToken(FONTS.HEADING_SMALL)};
   `}

  ${({
    // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
    isGlobalMb,
  }) => isGlobalMb && `font-size: 16px;`}
  .question-text {
    cursor: pointer;
  }
  @media (max-width: 768px) {
    ${({ isVenuePage }) =>
      isVenuePage
        ? `
    &&{
      ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
    }
    `
        : `
     ${expandFontToken(FONTS.HEADING_SMALL)};
    `}
  }
`;

const ContentBlock = styled.div`
  display: ${({
    // @ts-expect-error TS(2339): Property '$isOpen' does not exist on type 'Pick<De... Remove this comment to see the full error message
    $isOpen,
  }) => ($isOpen ? 'grid' : 'none')};
  grid-row-gap: 16px;
  p {
    margin: 0;
    ${({
      // @ts-expect-error TS(2339): Property '$isGlobalMb' does not exist on type 'Pic... Remove this comment to see the full error message
      $isGlobalMb,
    }) =>
      $isGlobalMb ? `font-size: 14px; line-height: 20px;` : `font-size: 15px;`}
  }
  a {
    color: ${COLORS.TEXT.CANDY_1};
  }
  img {
    width: 100%;
  }
  .image-wrap {
    height: auto;
  }
  .seatmap-image {
    margin-bottom: 1rem;
  }
`;

type AccordionProps = {
  clickHandler?: Function;
  isOpenOverride?: Boolean;
  heading: string;
  content: any;
  isGlobalMb?: Boolean;
  useSchema?: Boolean;
  index?: number;
  tabData?: Array<{
    image_source: string;
    legend_image_source: string;
  }>;
  findBestSeatsCtaCallback?: () => void;
  isVenuePage?: boolean;
};

const Accordion = ({
  heading,
  content,
  isOpenOverride = false,
  // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'Function'.
  clickHandler = null,
  isGlobalMb,
  useSchema = false,
  // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'number'.
  index = null,
  tabData = [],
  findBestSeatsCtaCallback,
  isVenuePage,
}: AccordionProps) => {
  const [isOpen, setOpen] = useState(false || isOpenOverride);
  const chevronContainerClass = classNames({
    'state-icon': true,
  });

  const pageMetaData = useRecoilValue(metaAtom);

  useEffect(() => {
    setOpen(isOpenOverride);
  }, [isOpenOverride]);

  const onAccordionToggle = () => {
    if (clickHandler) clickHandler();
    else setOpen(!isOpen);

    if (useSchema)
      trackEvent({
        eventName: ANALYTICS_EVENTS.FAQ_ITEM_CLICKED,
        [ANALYTICS_PROPERTIES.HEADING]: heading,
        [ANALYTICS_PROPERTIES.RANKING]: index + 1,
        ...getCommonEventMetaData(pageMetaData),
      });
    else
      trackEvent({
        eventName: ANALYTICS_EVENTS.ACCORDION_TOGGLED,
        [ANALYTICS_PROPERTIES.HEADING]: heading,
        [ANALYTICS_PROPERTIES.ACTION]: !isOpen ? 'Expand' : 'Contract',
        [ANALYTICS_PROPERTIES.TGID]: null,
        [ANALYTICS_PROPERTIES.SECTION]: 'Longform Content',
        [ANALYTICS_PROPERTIES.RANKING]: index + 1,
        ...getCommonEventMetaData(pageMetaData),
      });
  };

  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <StyledAccordion isOpen={isOpen} as={'div'} isGlobalMb={isGlobalMb}>
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <Title
        role="button"
        tabIndex={0}
        className="question"
        as={'div'}
        onClick={onAccordionToggle}
        isGlobalMb={isGlobalMb}
        isVenuePage={isVenuePage}
      >
        <div className="question-text">{heading}</div>
        <div className={chevronContainerClass}>
          <Chevron
            isActive={isOpen}
            activeCursor={true}
            className={'chevron-icon'}
          />
        </div>
      </Title>
      <ContentBlock
        className="answer"
        // @ts-expect-error TS(2769): No overload matches this call.
        $isOpen={isOpen}
        $isGlobalMb={isGlobalMb}
      >
        <Conditional if={typeof content !== 'string'}>
          {content}

          <div className="tabbed-info-image">
            <Image
              url={tabData[index]?.image_source}
              height="568"
              width="327"
              className="seatmap-image"
              alt="Seatmap"
            />
            <Conditional if={tabData[index]?.legend_image_source}>
              <div className="legend-image">
                <Image
                  url={tabData[index]?.legend_image_source}
                  height="160"
                  width="327"
                  alt="Legend"
                />
                <Button
                  fillType="fillGradient"
                  widthProp="100%"
                  onClick={findBestSeatsCtaCallback}
                >
                  {strings.THEATRE_PAGE.FIND_BEST_SEATS}
                </Button>
              </div>
            </Conditional>
          </div>
        </Conditional>
      </ContentBlock>
    </StyledAccordion>
  );
};

export default Accordion;
