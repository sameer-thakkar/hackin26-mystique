import Chevron from '../UI/Chevron';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SOLEIL, COLORS } from '../../constants/ui-constants';

const StyledAccordion = styled.div`
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
    padding: 16px;
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
};

const Accordion = ({
  heading,
  content,
  isOpenOverride = false,
  clickHandler = null,
}: AccordionProps) => {
  const [isOpen, setOpen] = useState(false || isOpenOverride);

  useEffect(() => {
    setOpen(isOpenOverride);
  }, [isOpenOverride]);

  return (
    <StyledAccordion isOpen={isOpen}>
      <Title
        role="button"
        tabIndex={0}
        className="question"
        onClick={() => {
          clickHandler ? clickHandler() : setOpen(!isOpen);
        }}
      >
        <div className="question-text">{heading}</div>
        <div className="state-icon">
          <Chevron isActive={isOpen} activeCursor={false} />
        </div>
      </Title>
      <ContentBlock isOpen={isOpen}>{content}</ContentBlock>
    </StyledAccordion>
  );
};

export default Accordion;
