import React from 'react';
import styled from 'styled-components';

const StyledHamburger = styled.div`
  display: none;
  cursor: pointer;
  position: absolute;
  right: 19px;
  top: 50%;
  margin: 0;
  transform: translateY(-50%);
  width: 19.25px;
  &:after,
  &:before,
  & div {
    background-color: #333;
    border-radius: 3px;
    content: '';
    display: block;
    height: 1px;
    margin: 5px 0;
    transition: all 0.2s ease-in-out;
  }

  ${({ isActive }) => {
    return (
      isActive &&
      `
      &:before {
        transform: translateY(6px) rotate(135deg);
      }
      
      &:after {
        transform: translateY(-6px) rotate(-135deg);
      }
      & div {
        transform: scale(0);
      }
    `
    );
  }}

  @media (max-width: 768px) {
    display: block;
  }
`;

const Hamburger: React.FC<any> = ({
  isActive = false,
  onClickFn = null,
  className = '',
}) => {
  return (
    <StyledHamburger
      isActive={isActive}
      onClick={onClickFn}
      className={className}
    >
      <div />
    </StyledHamburger>
  );
};

export default Hamburger;
