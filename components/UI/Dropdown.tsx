import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { PURPS_TICK_MARK } from 'assets/SvgIcons';
import { useCaptureClickOutside } from '../hooks/ClickOutside';

const TriggerElement = styled.div`
  cursor: pointer;
`;

const DropdownOverlay = styled.div`
  position: absolute;
  cursor: pointer;
  display: ${(props) => ((props as any).showOverlay ? `grid` : `none`)};
  padding: 20px 15px;
  background: #fff;
  grid-row-gap: 24px;
  border-radius: 4px;
  z-index: 10;
  border: 1px solid ${COLORS.GRAY.G6};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
  margin-top: 5px;
`;

const StyledDropdownItem = styled.div`
  font-size: 14px;
  ${({
    // @ts-expect-error TS(2339): Property 'active' does not exist on type 'Pick<Det... Remove this comment to see the full error message
    active,
  }) =>
    active
      ? `
      display: grid;
      grid-auto-flow: column;
      grid-gap: 20px;
      color: ${COLORS.BRAND.PURPS};
      align-items: center;
    `
      : ``}
`;

export const DropdownItem: React.FC<any> = ({ active, children, ...props }) => {
  return (
    <StyledDropdownItem active={active} {...props}>
      {children}
      {active ? PURPS_TICK_MARK : null}
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
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <DropdownOverlay showOverlay={showOverlay}>{children}</DropdownOverlay>
    </div>
  );
};

export default Dropdown;
