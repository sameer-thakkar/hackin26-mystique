import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import Conditional from 'components/common/Conditional';
import Chevron from 'components/UI/Chevron';
import Button from 'UI/Button';
import Image from 'UI/Image';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { metaAtom } from 'store/atoms/meta';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';

export const StyledAccordion = styled.div<{
  isOpen: boolean;
  $isCatOrSubCatPage?: boolean;
  isGlobalMb?: boolean;
}>`
  padding: 1rem 0;
  margin-right: ${({ isGlobalMb, $isCatOrSubCatPage }) =>
    isGlobalMb || $isCatOrSubCatPage ? '0' : '1.5rem'};
  border-bottom: ${({ $isCatOrSubCatPage }) =>
    $isCatOrSubCatPage
      ? `1px solid ${COLORS.GRAY.G6}`
      : `1px solid ${COLORS.GRAY.G7}`};
  display: grid;
  grid-template-rows: max-content max-content;
  ${({ isOpen, $isCatOrSubCatPage }) =>
    isOpen && !$isCatOrSubCatPage && 'grid-row-gap: 0.5rem'};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    ${({ isOpen, $isCatOrSubCatPage }) =>
      isOpen && !$isCatOrSubCatPage && 'grid-row-gap: 1rem'};
    margin-right: 0;

    &:first-child {
      border-top: ${({ $isCatOrSubCatPage }) =>
        !$isCatOrSubCatPage && `1px solid ${COLORS.GRAY.G7}`};
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
  isVenuePage?: boolean;
  isGlobalMb?: boolean;
  $isCatOrSubCatPage?: boolean;
}>`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: 0.625rem;
  ${({ isVenuePage, $isCatOrSubCatPage }) => {
    switch (true) {
      case $isCatOrSubCatPage:
        return expandFontToken(FONTS.HEADING_REGULAR);
      case isVenuePage:
        return expandFontToken(FONTS.SUBHEADING_LARGE);
      default:
        return expandFontToken(FONTS.HEADING_SMALL);
    }
  }}
  ${({ isGlobalMb }) => isGlobalMb && `font-size: 1rem;`}

  .question-text {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    ${({ isVenuePage, $isCatOrSubCatPage }) =>
      (isVenuePage || $isCatOrSubCatPage) &&
      expandFontToken(FONTS.SUBHEADING_REGULAR)}
  }
`;

const ContentBlock = styled.div<{
  $isOpen: boolean;
  $isGlobalMb?: boolean;
  $isCatOrSubCatPage?: boolean;
}>`
  display: ${({ $isOpen }) => ($isOpen ? 'grid' : 'none')};
  ${({ $isCatOrSubCatPage }) => !$isCatOrSubCatPage && `grid-row-gap: 1rem;`}
  ${({ $isCatOrSubCatPage }) => $isCatOrSubCatPage && `padding-top: 1rem;`}

  ${({ $isCatOrSubCatPage }) =>
    $isCatOrSubCatPage &&
    `
      * {
        margin: unset;

      }
    `};

  p {
    margin: 0;
    ${({ $isGlobalMb }) =>
      $isGlobalMb ? `font-size: 14px; line-height: 20px;` : `font-size: 15px;`}
    ${({ $isCatOrSubCatPage }) =>
      $isCatOrSubCatPage && expandFontToken(FONTS.PARAGRAPH_LARGE)}
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
  .tabbed-info-image {
    .seatmap-image,
    .legend-image {
      display: flex;
      justify-content: center;
    }
    .seatmap-image {
      img {
        object-fit: contain;
        margin: 0 auto;
      }
    }
    .legend-image {
      img {
        object-fit: contain;
        margin-bottom: 1.5rem;
      }
    }
  }

  @media (max-width: 768px) {
    ${({ $isCatOrSubCatPage }) => $isCatOrSubCatPage && `padding-top: 0.5rem;`}

    p, ol, ul {
      ${({ $isCatOrSubCatPage }) =>
        $isCatOrSubCatPage && expandFontToken(FONTS.PARAGRAPH_SMALL)}
    }
  }
`;

type AccordionProps = {
  clickHandler?: Function | null;
  isOpenOverride?: boolean;
  heading: string;
  content: any;
  isGlobalMb?: boolean;
  useSchema?: boolean;
  index: number;
  tabData?: Array<{
    image_source: string;
    legend_image_source: string;
  }>;
  findBestSeatsCtaCallback?: () => void | null;
  isVenuePage?: boolean;
  isCatOrSubCatPage?: boolean;
};

const Accordion = ({
  heading,
  content,
  isOpenOverride = false,
  clickHandler = null,
  isGlobalMb,
  useSchema = false,
  index,
  tabData = [],
  findBestSeatsCtaCallback,
  isVenuePage,
  isCatOrSubCatPage,
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
    <StyledAccordion
      as={'div'}
      isOpen={isOpen}
      $isCatOrSubCatPage={isCatOrSubCatPage}
      isGlobalMb={isGlobalMb}
    >
      <Title
        role="button"
        tabIndex={0}
        className="question"
        as="div"
        onClick={onAccordionToggle}
        isGlobalMb={isGlobalMb}
        isVenuePage={isVenuePage}
        $isCatOrSubCatPage={isCatOrSubCatPage}
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
        $isOpen={isOpen}
        $isGlobalMb={isGlobalMb}
        $isCatOrSubCatPage={isCatOrSubCatPage}
      >
        <Conditional if={typeof content !== 'string'}>
          {content}

          <div className="tabbed-info-image">
            <Image
              url={tabData[index]?.image_source}
              height="500"
              width="327"
              className="seatmap-image"
              alt="Seatmap"
            />
            <Conditional if={tabData[index]?.legend_image_source}>
              <Image
                url={tabData[index]?.legend_image_source}
                height="190"
                width="327"
                alt="Legend"
                className="legend-image"
              />
              <Conditional if={findBestSeatsCtaCallback}>
                <Button
                  fillType="fillGradient"
                  widthProp="100%"
                  onClick={findBestSeatsCtaCallback}
                >
                  {strings.THEATRE_PAGE.FIND_BEST_SEATS}
                </Button>
              </Conditional>
            </Conditional>
          </div>
        </Conditional>
      </ContentBlock>
    </StyledAccordion>
  );
};

export default memo(Accordion);
