import React from 'react';
import styled from 'styled-components';
import { AVENIR } from '../../constants/ui-constants';
import { YELLOW_CLOSE } from '../../public/static/svg-icons';

const StyledAlert = styled.div`
  font-family: ${AVENIR.FONT_STACK};
  margin-top: 80px;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  left: 0;
  right: 0;
  z-index: 2;
  background: #fff8e5;
  @media (max-width: 768px) {
    margin-top: 56px;
  }
`;

const StyledContent = styled.div`
  font-size: 12px;
  line-height: 12px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  color: #755a0f;
  display: grid;
  grid-column-gap: 8px;
  grid-template-columns: auto max-content auto max-content;
  grid-template-areas: 'key-text text read-more svg';
  align-items: center;
  padding: 8px;
  .alert-key-text {
    grid-area: key-text;
    font-weight: ${AVENIR.HEAVY};
    justify-self: end;
  }
  .alert-text {
    grid-area: text;
    justify-self: center;
  }
  .close {
    grid-area: svg;
    align-self: start;
    justify-self: end;
    cursor: pointer;
  }
  @media (max-width: 768px) {
    .alert-key-text {
      justify-self: unset;
    }
    grid-column-gap: 0px;
    grid-row-gap: 8px;
    padding: 16px;
    grid-template-columns: auto auto;
    grid-template-areas: 'key-text svg' 'text svg' 'read-more svg';
  }
`;

const StyledReadMore = styled.a`
  grid-area: read-more;
  font-size: 12px;
  color: #755a0f;
  text-decoration: underline;
`;

const DismissAlert: React.FC<{
  readMore: string;
  keyText: string;
  text: string;
  handleClose: any;
}> = ({ readMore, keyText, text, handleClose }) => {
  return (
    <StyledAlert>
      <StyledContent>
        <div className="alert-key-text">{keyText}</div>
        <div className="alert-text">{text}</div>
        <StyledReadMore
          href="https://medium.com/headout/coronavirus-outbreak-cancellation-policy-8fe8e1104b83"
          target="_blank"
        >
          {readMore}
        </StyledReadMore>
        <div className="close" onClick={handleClose}>
          {YELLOW_CLOSE}
        </div>
      </StyledContent>
    </StyledAlert>
  );
};

export default DismissAlert;
