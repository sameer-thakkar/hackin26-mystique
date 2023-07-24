import React from 'react';
import styled from 'styled-components';
import COLORS from 'const/colors';

const StyledHamburger = styled.div<{
  isGlobalMb?: boolean;
  isActive?: boolean;
  theme: any;
  showContainer?: boolean;
  isDarkMode?: boolean;
}>`
  display: none;
  cursor: pointer;
  width: ${({ showContainer }) => (showContainer ? '14px' : '22px')};
  padding: ${({ showContainer, isActive }) =>
    showContainer && !isActive ? '6.5px 9px' : '0'};
  border-radius: ${({ showContainer }) => (showContainer ? '50%' : '0')};
  background-color: ${({ showContainer }) =>
    showContainer ? `${COLORS.BRAND.WHITE}20` : 'transparent'};
  &:after,
  &:before,
  & div {
    background-color: ${({ isGlobalMb, theme, isDarkMode }) => {
      switch (true) {
        case isDarkMode:
          return COLORS.BRAND.WHITE;
        case isGlobalMb:
          return COLORS.GRAY.G2;
        default:
          return theme.primaryBGText || COLORS.GRAY.G2;
      }
    }};
    border-radius: 3px;
    content: '';
    display: block;
    height: ${({ showContainer, isActive }) =>
      showContainer && !isActive ? '1px' : '2px'};
    margin: ${({ showContainer, isActive }) =>
      showContainer && !isActive ? '4px 0' : '5px 0'};
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

  ${({ isActive }) => {
    return (
      isActive &&
      `
      &:before {
        transform: translateY(7px) rotate(135deg);
      }
      
      &:after {
        transform: translateY(-7px) rotate(-135deg);
      }
      & div {
        transform: scale(0);
      }
    `
    );
  }};

  @media (max-width: 768px) {
    display: block;
  }
`;

const Hamburger: React.FC<any> = ({
  isActive = false,
  onClickFn = null,
  className = '',
  isGlobalMb = false,
  showContainer = false,
  isDarkMode = false,
}) => {
  return (
    <StyledHamburger
      isActive={isActive}
      onClick={onClickFn}
      className={className}
      id="hamburger"
      role="button"
      tabIndex={0}
      isGlobalMb={isGlobalMb}
      showContainer={showContainer}
      isDarkMode={isDarkMode}
    >
      <div role="button" tabIndex={0} />
    </StyledHamburger>
  );
};

export default Hamburger;
