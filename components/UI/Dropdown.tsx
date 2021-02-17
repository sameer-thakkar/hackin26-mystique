import React, { useState, useRef } from 'react';
import { COLORS } from 'const/ui-constants';
import styled from 'styled-components';

import { useCaptureClickOutside } from '../hooks/ClickOutside';

const TriggerElement = styled.div`
  cursor: pointer;
`;

const DropdownOverlay = styled.div`
  position: absolute;
  cursor: pointer;
  display: ${(props) => (props.showOverlay ? `grid` : `none`)};
  padding: 20px 15px;
  background: #fff;
  grid-row-gap: 24px;
  border-radius: 4px;
  z-index: 10;
  border: 1px solid #dadada;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
  margin-top: 5px;
`;

const StyledDropdownItem = styled.div`
  font-size: 14px;
  ${({ active }) =>
    active
      ? `
      display: grid;
      grid-auto-flow: column;
      grid-gap: 20px;
      color: ${COLORS.RHAPSODY};
      align-items: center;
    `
      : ``}
`;

export const DropdownItem: React.FC<any> = ({ active, children, ...props }) => {
  return (
    <StyledDropdownItem active={active} {...props}>
      {children}
      {active ? (
        <img
          src="https://cdn-imgix-open.headout.com/mystique/assets/tick.svg"
          alt="tick"
        />
      ) : null}
    </StyledDropdownItem>
  );
};
const Dropdown: React.FC<any> = ({ children, triggerElement }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const dropdownRef = useRef(null);
  useCaptureClickOutside(
    dropdownRef,
    () => {
      setShowOverlay(false);
    },
    []
  );

  return (
    <div ref={dropdownRef}>
      <TriggerElement
        onClick={() => {
          setShowOverlay((c) => !c);
        }}
      >
        {triggerElement}
      </TriggerElement>
      <DropdownOverlay showOverlay={showOverlay}>{children}</DropdownOverlay>
    </div>
  );
};

export default Dropdown;
