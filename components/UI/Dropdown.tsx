import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import COLORS from 'const/colors';
import PurpsTickMark from 'assets/purpsRightArrow';
import { useCaptureClickOutside } from '../hooks/ClickOutside';

const TriggerElement = styled.div`
  cursor: pointer;
`;

export const DropdownOverlay = styled.div<{ showOverlay: boolean }>`
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

const StyledDropdownItem = styled.div<{ active: boolean }>`
  font-size: 14px;
  ${({ active }) =>
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
      {active ? PurpsTickMark : null}
    </StyledDropdownItem>
  );
};
const Dropdown: React.FC<any> = ({
  children,
  triggerElement,
  autoClose,
  onDropdownStateChange,
}: {
  children: JSX.Element | JSX.Element[];
  triggerElement: JSX.Element;
  autoClose?: () => {};
  onDropdownStateChange?: (open: boolean) => {};
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const dropdownRef = useRef(null);
  useCaptureClickOutside(
    dropdownRef,
    () => {
      setShowOverlay(false);
      onDropdownStateChange?.(false);
    },
    []
  );
  const autoCloseOverlay = () => {
    if (autoClose) {
      setShowOverlay(false);
      onDropdownStateChange?.(false);
    }
  };
  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <TriggerElement
        onClick={() => {
          onDropdownStateChange?.(!showOverlay);
          setShowOverlay((c) => !c);
        }}
      >
        {triggerElement}
      </TriggerElement>
      <DropdownOverlay showOverlay={showOverlay} onClick={autoCloseOverlay}>
        {children}
      </DropdownOverlay>
    </div>
  );
};

export default Dropdown;
