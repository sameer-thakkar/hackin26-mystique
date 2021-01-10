import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown/with-html';
import Chevron from '../UI/Chevron';
import { SOLEIL, COLORS } from '../../constants/ui-constants';
import Conditional from 'components/common/Conditional';

export const StyledAccordion = styled.div`
  padding: 16px 0;
  margin-right: 24px;
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
  isAmp?: boolean;
  useSchema?: Boolean;
};

const Accordion = ({
  heading,
  content,
  isOpenOverride = false,
  clickHandler = null,
  isAmp = false,
  useSchema = false,
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
            activeCursor={false}
            className={'chevron-icon'}
          />
        </div>
      </Title>
      <ContentBlock
        className="answer"
        isOpen={isOpen}
        {...(useSchema && {
          itemProp: 'acceptedAnswer',
          itemType: 'https://schema.org/Answer',
          itemScope: true,
        })}
      >
        <div
          {...(useSchema && {
            itemprop: 'text',
          })}
        >
          <Conditional if={typeof content === 'string'}>
            <ReactMarkdown
              renderers={{ root: React.Fragment }}
              source={content}
              escapeHtml={false}
            />
          </Conditional>
          <Conditional if={typeof content !== 'string'}>{content}</Conditional>
        </div>
      </ContentBlock>
    </StyledAccordion>
  );
};

export default Accordion;
