import React from 'react';
import COLORS from 'const/colors';
import styled from 'styled-components';

const StyledHamburger = styled.div`
  display: none;
  cursor: pointer;
  position: absolute;
  right: 19px;
  top: 50%;
  margin: 0;
  transform: translateY(-50%);
  width: 22px;
  &:after,
  &:before,
  & div {
    background-color: ${({ isGlobalMb, theme }) =>
    isGlobalMb ? COLORS.GRAY.G2 : theme.primaryBGText || COLORS.GRAY.G2};
    border-radius: 3px;
    content: '';
    display: block;
    height: 2px;
    margin: 5px 0;
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
}) => {
  return (
    <StyledHamburger
      isActive={isActive}
      onClick={onClickFn}
      className={className}
      id="hamburger"
      role="button"
      tabIndex={0}
      on="
        tap:hamburger.toggleClass(class='close'),
        nav-menu.toggleClass(class='now-active'),
        navigation-menu-mobile.toggleClass(class='navigation-nav-open'),
        navigation-menu-mobile_0.toggleClass(class='navigation-nav-open')
      "
      isGlobalMb={isGlobalMb}
    >
      <div role="button" tabIndex={0} />
    </StyledHamburger>
  );
};

export default Hamburger;
