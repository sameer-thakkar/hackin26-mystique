import React from 'react';
import { COLORS } from '../constants/ui-constants';
import styled from 'styled-components';

const StyledCTAShortcode = styled.div`
  margin: 30px 0px;
  text-align: ${({ align }) => align};
  a {
    text-decoration: none;
  }
  .short-code-cta {
    display: inline-flex;
    font-weight: 500;
    justify-content: center;
    align-items: center;
    border: 1.5px solid #ec1943;
    color: #ec1943;
    background-color: #fff;
    height: 2.5em;
    min-width: 6em;
    padding: 0px 30px;
    border-radius: 4px;
    transition: transform 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55),
      background-position 800ms cubic-bezier(0.68, -0.55, 0.265, 1.55),
      box-shadow 500ms linear;
    transform: scale(1, 1);
    will-change: transform;
    cursor: pointer;
    ${({ fill }) =>
      fill
        ? `
      border: none;
      background: ${COLORS.RHAPSODY};
      background: ${COLORS.RHAPSODY_GRADIENT};
      span {
        color: ${COLORS.WHITE};
      }
    `
        : ''}
  }

  .short-code-cta-container a {
    text-decoration: none;
  }
  .short-code-cta:hover {
    transform: scale(1.02, 1.08);
  }
`;

const CTAShortCode = (props) => {
  const { text, link, align, fill } = props;
  return (
    <StyledCTAShortcode {...{ align, fill }}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <div className="short-code-cta">
          <span>{text}</span>
        </div>
      </a>
    </StyledCTAShortcode>
  );
};

export default CTAShortCode;
