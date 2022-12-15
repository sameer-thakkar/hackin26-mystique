import React, { useState, useEffect } from 'react';
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

export const StyledAccordion = styled.div`
  padding: 16px 0;
  margin-right: ${({ isGlobalMb }) => (isGlobalMb ? '0' : '24px')};
  border-bottom: 1px solid ${COLORS.GRAY.G7};
  display: grid;
  grid-template-rows: max-content max-content;
  ${({ isOpen }) => isOpen && 'grid-row-gap: 8px'};

  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    ${({ isOpen }) => isOpen && 'grid-row-gap: 16px'};
    margin-right: 0;
    padding: 16px 0;

    &:first-child {
      border-top: ${({ isGlobalMb }) =>
        isGlobalMb && `1px solid ${COLORS.GRAY.G7}`};
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

const Title = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: 10px;
  ${expandFontToken('Heading/Small')}
  ${({ isGlobalMb }) => isGlobalMb && `font-size: 16px;`}
  .question-text {
    cursor: pointer;
  }
`;

const ContentBlock = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'grid' : 'none')};
  grid-row-gap: 16px;
  p {
    margin: 0;
    ${({ $isGlobalMb }) => $isGlobalMb && `font-size: 14px; line-height: 20px;`}
  }
  a {
    color: ${COLORS.TEXT.CANDY_1};
  }
  img {
    width: 100%;
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
};

const Accordion = ({
  heading,
  content,
  isOpenOverride = false,
  clickHandler = null,
  isGlobalMb,
  useSchema = false,
  index = null,
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
    <StyledAccordion isOpen={isOpen} as={'div'} isGlobalMb={isGlobalMb}>
      <Title
        role="button"
        tabIndex={0}
        className="question"
        as={'div'}
        onClick={onAccordionToggle}
        isGlobalMb={isGlobalMb}
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
      >
        <Conditional if={typeof content !== 'string'}>{content}</Conditional>
      </ContentBlock>
    </StyledAccordion>
  );
};

export default Accordion;
