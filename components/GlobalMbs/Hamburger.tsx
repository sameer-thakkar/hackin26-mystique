import { COLORS } from 'const/ui-constants';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

const StyledHamburger = styled.div`
  display: none;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 50%;
  margin: 0;
  transform: translateY(-50%);
  width: 22px;
  &:after,
  &:before,
  & div {
    background-color: ${COLORS.WHITE};
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

type HamburgerProps = {
  isActive?: boolean;
  onClickFn?: Function;
  className?: string;
};

const Hamburger: FunctionComponent<HamburgerProps> = ({
  isActive = false,
  onClickFn = null,
  className = '',
}) => {
  return (
    <StyledHamburger
      isActive={isActive}
      onClick={onClickFn}
      className={className}
      id="hamburger"
      role="button"
      tabIndex={0}
    >
      <div role="button" tabIndex={0} />
    </StyledHamburger>
  );
};

export default Hamburger;
