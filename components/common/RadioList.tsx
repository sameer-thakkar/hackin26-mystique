import React from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { RadioIcon } from 'assets/SvgIcons';

const RadioListContainer = styled.div``;

const RadioItem = styled.div<{ $isNoBorderBottom?: boolean }>`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
  cursor: pointer;
  padding: calc(16px - 0.5px) 0; // 1px to offset border.
  border-bottom: 1px solid ${COLORS.GRAY.G6};

  &:last-child {
    ${({ $isNoBorderBottom }) => $isNoBorderBottom && `border-bottom: none;`}
  }
  ${({
    // @ts-expect-error TS(2339): Property '$isActive' does not exist on type 'Pick<... Remove this comment to see the full error message
    $isActive,
  }) => $isActive && `pointer-events: none;`}
  .label-text.label-text {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    ${({
      // @ts-expect-error TS(2339): Property '$isActive' does not exist on type 'Pick<... Remove this comment to see the full error message
      $isActive,
    }) =>
      $isActive &&
      `
        color: ${COLORS.BRAND.PURPS};
    `}
  }
`;

const CurrencyRadioLabel = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  .seperator {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 0.5rem;
    height: 10px;
    font-weight: 500;
    ${({ $isActive }) => $isActive && `color: ${COLORS.BRAND.PURPS}`}
  }

  .bold-label {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    font-weight: 500;
    ${({ $isActive }) => $isActive && `color: ${COLORS.BRAND.PURPS}`}
  }
`;

export type RadioItemArg = { label: any; value: string; [str: string]: any };

const RadioList = ({
  items = [],
  // @ts-expect-error TS(2322): Type 'null' is not assignable to type '(args: Radi... Remove this comment to see the full error message
  onChange = null,
  currentValue,
  isCurrencyLabel = false,
  isNoBorderBottom = true,
}: {
  items: Array<RadioItemArg>;
  onChange: (args: RadioItemArg) => void;
  currentValue: string;
  isCurrencyLabel?: boolean;
  isNoBorderBottom?: boolean;
}) => {
  return (
    <RadioListContainer>
      {items.map((item, index) => {
        const { label, value, localSymbol } = item;
        const isActive = currentValue === value;
        const isClickable = !isActive && onChange;
        return (
          <RadioItem
            $isActive={isActive}
            key={index}
            // @ts-expect-error TS(2769): No overload matches this call.
            onClick={isClickable ? () => onChange(item) : null}
            $isNoBorderBottom={isNoBorderBottom}
          >
            <Conditional if={isCurrencyLabel}>
              <CurrencyRadioLabel $isActive={isActive}>
                <span className="bold-label">{localSymbol}</span>
                <span className="seperator">.</span>
                <span className="label-text">{label}</span>
              </CurrencyRadioLabel>
            </Conditional>
            <Conditional if={!isCurrencyLabel}>
              <span className="label-text">{label}</span>
            </Conditional>
            <RadioIcon isActive={isActive} />
          </RadioItem>
        );
      })}
    </RadioListContainer>
  );
};

export default RadioList;
