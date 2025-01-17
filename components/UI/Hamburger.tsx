import React from 'react';
import styled from 'styled-components';
import COLORS from 'const/colors';

const StyledHamburger = styled.div<{
  bgColor: string | undefined;
  isGlobalMb?: boolean;
  isActive?: boolean;
  theme: any;
  isLtt?: boolean;
  isDarkMode?: boolean;
}>`
  display: none;
  cursor: pointer;
  width: ${({ isLtt }) => (isLtt ? '14px' : '22px')};
  padding: ${({ isLtt }) => (isLtt ? '8px' : '0')};
  border-radius: ${({ isLtt }) => (isLtt ? '50%' : '0')};
  background-color: ${({ isLtt }) =>
    isLtt ? `${COLORS.BRAND.WHITE}20` : 'transparent'};
  &:after,
  &:before,
  & div {
    background-color: ${({ bgColor, theme }) =>
      bgColor ? bgColor : theme.primaryBGText || COLORS.GRAY.G2};
    border-radius: 3px;
    content: '';
    display: block;
    height: ${({ isLtt }) => (isLtt ? '1.2px' : '2px')};
    margin: ${({ isLtt }) => (isLtt ? '2.8px 0' : '5px 0')};
    transition: all 0.2s ease-in-out;
  }

  &.close {
    &:before {
      transform: translateY(7px) rotate(135deg);
    }

    &:after {
      transform: translateY(-7px) rotate(-135deg);
    }
    & div {
      transform: scale(0);
    }
  }

  ${({ isActive, isLtt }) => {
    return (
      isActive &&
      `
      &:before {
        transform: translateY(${isLtt ? '4px' : '7px'}) rotate(135deg);
      }
      
      &:after {
        transform: translateY(-${isLtt ? '4px' : '7px'}) rotate(-135deg);
      }
      & div {
        transform: scale(0);
      }
    `
    );
  }};

  @media (max-width: 768px) {
    display: block;
    ${({ isLtt }) =>
      isLtt &&
      `
      height: 16px;
      width: 16px;
    `}
  }
`;

const Hamburger: React.FC<React.PropsWithChildren<any>> = ({
  isActive = false,
  onClickFn = null,
  className = '',
  isGlobalMb = false,
  isLtt = false,
  isDarkMode = false,
}) => {
  const getBgColor = () => {
    switch (true) {
      case isDarkMode:
        return COLORS.BRAND.WHITE;
      case isGlobalMb:
        return COLORS.GRAY.G2;
      default:
        return '';
    }
  };

  return (
    <StyledHamburger
      isActive={isActive}
      onClick={onClickFn}
      className={className}
      id="hamburger"
      role="button"
      tabIndex={0}
      bgColor={getBgColor()}
      isGlobalMb={isGlobalMb}
      isLtt={isLtt}
      isDarkMode={isDarkMode}
    >
      <div role="button" tabIndex={0} />
    </StyledHamburger>
  );
};

export default Hamburger;
