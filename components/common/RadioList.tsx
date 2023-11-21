import React from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { RadioIcon } from 'assets/SvgIcons';

const RadioListContainer = styled.div<{ $isCatOrSubCatPage: boolean }>`
  ${({ $isCatOrSubCatPage }) =>
    $isCatOrSubCatPage &&
    ` display: flex;
      flex-direction: column;
      gap: 1.25rem;
    `}
`;

const RadioItem = styled.div<{
  $isActive: boolean;
  $isCatOrSubCatPage: boolean;
  $isNoBorderBottom?: boolean;
}>`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
  cursor: pointer;

  ${({ $isCatOrSubCatPage }) =>
    !$isCatOrSubCatPage &&
    ` padding: calc(16px - 0.5px) 0;
      border-bottom: 1px solid ${COLORS.GRAY.G6}; 
      &:last-child {
        border-bottom: none;
      }
    `}

  &:last-child {
    ${({ $isNoBorderBottom }) => $isNoBorderBottom && `border-bottom: none;`}
  }

  ${({ $isActive }) => $isActive && `pointer-events: none;`}

  .label-text.label-text {
    ${({ $isCatOrSubCatPage }) =>
      $isCatOrSubCatPage
        ? expandFontToken(FONTS.BUTTON_SMALL)
        : expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    ${({ $isActive }) => $isActive && `color: ${COLORS.BRAND.PURPS};`}
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
  onChange,
  currentValue,
  isCurrencyLabel = false,
  isCatOrSubCatPage = false,
  isNoBorderBottom = true,
}: {
  items: Array<RadioItemArg>;
  onChange: (args: RadioItemArg) => void;
  currentValue: string;
  isCurrencyLabel?: boolean;
  isCatOrSubCatPage?: boolean;
  isNoBorderBottom?: boolean;
}) => {
  return (
    <RadioListContainer $isCatOrSubCatPage={isCatOrSubCatPage}>
      {items.map((item, index) => {
        const { label, value, localSymbol } = item;
        const isActive = currentValue === value;
        const isClickable = !isActive && onChange;

        return (
          <RadioItem
            $isActive={isActive}
            $isCatOrSubCatPage={isCatOrSubCatPage}
            key={index}
            onClick={isClickable ? () => onChange(item) : undefined}
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
