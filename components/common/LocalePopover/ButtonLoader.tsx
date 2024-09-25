import React from 'react';
import styled, { keyframes } from 'styled-components';
import COLORS from 'const/colors';

type IButtonLoader = {
  isMobile?: boolean;
  isDarkMode?: boolean;
  className?: string;
};

const coreLeadingDotsAnimation = keyframes`
	0% {opacity: 0.4; transform: scale(1, 1);} 
	50% {opacity: 1; transform: scale(1.2, 1.2);} 
	100% {opacity: 0.4; transform: scale(1, 1);}
`;

const LoadingDotStyled = styled.div<{
  $isMobile: boolean;
  $isDarkMode: boolean;
}>`
  &.core-loading-dots {
    display: flex;
    align-items: center;
    text-align: center;
    width: ${({ $isMobile }) => ($isMobile ? '100%' : '100px')};
    justify-content: center;
    height: 37px;
    margin: 0;
    margin-top: 2px;
    ${({ $isDarkMode }) => $isDarkMode && `margin-left: 3px`};

    .dot {
      animation: ${coreLeadingDotsAnimation} 1.5s infinite ease-in-out;
      background-color: ${({ $isDarkMode }) =>
        $isDarkMode ? `${COLORS.BRAND.WHITE}` : `${COLORS.BRAND.PURPS}`};
      ${({ $isMobile }) => ($isMobile ? '7px' : '10px')};
      border-radius: 8px;
      display: inline-block;
      height: 4px;
      width: 4px;
      margin-right: ${({ $isMobile }) => ($isMobile ? '3px' : '10px')};

      &:nth-child(2) {
        animation-delay: 0.5s;
      }

      &:nth-child(3) {
        animation-delay: 1s;
      }
    }
  }
`;

export const ButtonLoader = ({
  isMobile = false,
  isDarkMode = false,
  className,
}: IButtonLoader) => {
  return (
    <LoadingDotStyled
      $isMobile={isMobile}
      $isDarkMode={isDarkMode}
      key="loading-dots"
      className={`core-loading-dots ${className}`}
    >
      <div className="dot" key="dot-1" />
      <div className="dot" key="dot-2" />
      <div className="dot" key="dot-3" />
    </LoadingDotStyled>
  );
};
