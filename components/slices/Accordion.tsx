import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { SOLEIL, COLORS } from 'const/ui-constants';
import Conditional from 'components/common/Conditional';

import Chevron from '../UI/Chevron';

export const StyledAccordion = styled.div`
  padding: 16px 0;
  margin-right: ${({ isGlobalMb }) => (isGlobalMb ? '0' : '24px')};
  border-bottom: 1px solid ${COLORS.CHALK};
  display: grid;
  grid-template-rows: max-content max-content;
  grid-row-gap: ${({ isOpen }) => (isOpen ? '8px' : '')};
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    grid-row-gap: 16px;
    margin-right: 0;
    padding: 16px 0;

    &:first-child {
      border-top: ${({ isGlobalMb }) =>
        isGlobalMb && `1px solid ${COLORS.CHALK}`};
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
  line-height: 20px;
  font-weight: ${SOLEIL.SEMIBOLD};
  font-family: ${SOLEIL.FONT_STACK};
  ${({ isGlobalMb }) => isGlobalMb && `font-size: 16px;`}
  .question-text {
    cursor: pointer;
  }
  .with-amp {
    position: absolute;
    top: 0;
    right: 0;
  }
  @media (max-width: 768px) {
    ${({ isAmp }) => {
      return isAmp
        ? `
          background-color: transparent;
          outline: none;
          border: none;
          margin: 0;
        `
        : '';
    }}
  }
`;

const ContentBlock = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'grid' : 'none')};
  grid-row-gap: 8px;
  font-family: ${SOLEIL.FONT_STACK};
  p {
    margin: 0;
    ${({ isGlobalMb }) => isGlobalMb && `font-size: 14px; line-height: 20px;`}
  }
  a {
    color: ${COLORS.MED_SLATE_BLUE};
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
  isAmp?: Boolean;
  useSchema?: Boolean;
  isGlobalMb?: Boolean;
};

const Accordion = ({
  heading,
  content,
  isOpenOverride = false,
  clickHandler = null,
  isAmp = false,
  useSchema = false,
  isGlobalMb,
}: AccordionProps) => {
  const [isOpen, setOpen] = useState(false || isOpenOverride);
  const chevronContainerClass = classNames({
    'state-icon': true,
    'with-amp': isAmp,
  });
  const accordionContainerClass = classNames({
    'accordion-container': isAmp,
  });

  useEffect(() => {
    setOpen(isOpenOverride);
  }, [isOpenOverride]);
  return (
    <StyledAccordion
      isOpen={isOpen}
      as={isAmp ? 'section' : 'div'}
      className={accordionContainerClass}
      isGlobalMb={isGlobalMb}
      {...(useSchema && {
        itemProp: 'mainEntity',
        itemType: 'https://schema.org/Question',
        itemScope: true,
      })}
    >
      <Title
        role="button"
        tabIndex={0}
        className="question"
        as={isAmp ? 'header' : 'div'}
        isAmp={isAmp}
        onClick={() => {
          clickHandler ? clickHandler() : setOpen(!isOpen);
        }}
        isGlobalMb={isGlobalMb}
      >
        <div
          className="question-text"
          {...(useSchema && {
            itemProp: 'name',
          })}
        >
          {heading}
        </div>
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
        isOpen={isOpen}
        isGlobalMb={isGlobalMb}
        {...(useSchema && {
          itemProp: 'acceptedAnswer',
          itemType: 'https://schema.org/Answer',
          itemScope: true,
        })}
      >
        <div
          {...(useSchema && {
            itemProp: 'text',
          })}
        >
          <Conditional if={typeof content !== 'string'}>{content}</Conditional>
        </div>
      </ContentBlock>
    </StyledAccordion>
  );
};

export default Accordion;
