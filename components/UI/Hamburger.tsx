import React from 'react';
import styled from 'styled-components';

const StyledHamburger = styled.div`
  display: none;
  cursor: pointer;
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  @media (max-width: 768px) {
    display: inline-block;
  }
`;

const StyledBar = styled.div`
  width: 19.25px;
  height: 1px;
  background-color: #545454;
  margin: 5px 0;
  transition: 0.4s;
  border-radius: 50px;
`;

const Hamburger: React.FC<any> = () => {
  return (
    <StyledHamburger>
      <StyledBar />
      <StyledBar />
      <StyledBar />
    </StyledHamburger>
  );
};

export default Hamburger;
