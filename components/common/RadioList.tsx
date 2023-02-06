import React from 'react';
import styled from 'styled-components';
import { RadioIcon } from 'assets/SvgIcons';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

const RadioListContainer = styled.div``;

const RadioItem = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
  cursor: pointer;
  padding: calc(16px - 0.5px) 0; // 1px to offset border.
  border-bottom: 1px solid ${COLORS.GRAY.G6};

  &:last-child {
    border-bottom: none;
  }
  ${({  
 // @ts-expect-error TS(2339): Property '$isActive' does not exist on type 'Pick<... Remove this comment to see the full error message
 $isActive }) => $isActive && `pointer-events: none;`}
  .label-text.label-text {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    ${({    
 // @ts-expect-error TS(2339): Property '$isActive' does not exist on type 'Pick<... Remove this comment to see the full error message
 $isActive }) =>
      $isActive &&
      `
        color: ${COLORS.BRAND.PURPS};
    `}
  }
`;

export type RadioItemArg = { label: any; value: string; [str: string]: any };

const RadioList = ({
  items = [],
  // @ts-expect-error TS(2322): Type 'null' is not assignable to type '(args: Radi... Remove this comment to see the full error message
  onChange = null,
  currentValue,
}: {
  items: Array<RadioItemArg>;
  onChange: (args: RadioItemArg) => void;
  currentValue: string;
}) => {
  return (
    <RadioListContainer>
      {items.map((item, index) => {
        const { label, value } = item;
        const isActive = currentValue === value;
        const isClickable = !isActive && onChange;
        return (
          <RadioItem
            $isActive={isActive}
            key={index}
            // @ts-expect-error TS(2769): No overload matches this call.
            onClick={isClickable ? () => onChange(item) : null}
          >
            <span className="label-text">{label}</span>
            <RadioIcon isActive={isActive} />
          </RadioItem>
        );
      })}
    </RadioListContainer>
  );
};

export default RadioList;
