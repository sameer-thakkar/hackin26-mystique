import React, { useState } from 'react';
import styled from 'styled-components';
import { THEMES } from 'const/index';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import Conditional from 'components/common/Conditional';
import { TickSvg } from 'assets/SvgIcons';

const StyledSelector = styled.div`
  margin-left: 16px;
  position: relative;

  .selector-dropdown a {
    text-decoration: none;
    color: ${COLORS.GRAY.G2};
  }
  .selector-dropdown {
    display: none;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 24px;
    background-color: ${COLORS.BRAND.WHITE};
    padding: 12px 0;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    max-height: 320px;
    overflow-y: scroll;
    :after {
      height: 10px;
      content: '';
      display: block;
    }
    ::-webkit-scrollbar {
      width: 2px;
    }
    ::-webkit-scrollbar-track {
      /* box-shadow: inset 0 0 2px transparent; */
      border-radius: 2;
    }
    ::-webkit-scrollbar-thumb {
      background: ${COLORS.GRAY.G4};
      border-radius: 5px;
    }
  }
  &:after {
    /* this adds white space below the active text,
    increasing the hover area
    */
    content: '';
    display: block;
    height: 30px;
    position: absolute;
    left: 0;
    width: 100%;
    left: 0;
  }
  .selector-item {
    display: flex;
    align-items: center;
    ${expandFontToken('UI/Label Medium')}
    padding: 10px 16px;
    cursor: pointer;
    min-width: 148px;
    justify-content: space-between;
  }
  .selector-dropdown span {
    color: ${COLORS.GRAY.G2};
  }
  .selector-item:hover {
    color: ${COLORS.BRAND.PURPS};
  }
  .item-label {
    white-space: nowrap;
  }
  .selected-tab .selector-item,
  .selector-item:hover {
    background: ${COLORS.GRAY.G8};
  }
  .selector-dropdown-active {
    display: block;
  }
`;

const StyledActiveValue = styled.span`
  margin-top: 7px;
  ${expandFontToken('UI/Label Medium')}
  color: ${COLORS.GRAY.G3};
  cursor: pointer;
  transform: translateY(-3px);
  svg {
    margin-right: 6px;
    margin-bottom: -2px;
  }
  ${({ theme }) =>
    theme.theme === THEMES.MIN_BLUE
      ? `
      display: grid;
      grid-template-columns: auto auto;
      grid-column-gap: 4px;
      align-items: center;
      .chevron {
        transform: scale(0.7);
      }
      .chevron::before,
      .chevron::after {
        background-color: ${theme.primaryBGText};
        width: 
      }
    `
      : ``}
`;

const StyledItem = styled.div``;

type Option = {
  label: string;
  activeLabel?: string | JSX.Element;
  value: string;
  itemComponent?: JSX.Element;
  itemProps?: { [key: string]: any };
};

const DropdownSelector = ({
  options,
  currentValue,
  onChange,
  onShowDropdown,
  isCrawlable,
}: {
  options: Array<Option>;
  currentValue: Option;
  onChange: (value: Option) => void;
  onShowDropdown?: () => void;
  isCrawlable?: boolean;
}) => {
  const [isActive, toggleActive] = useState(false);

  const handleChange = (value: any) => {
    toggleActive(!isActive);
    onChange(value);
  };

  const onActive = () => {
    toggleActive(true);
    // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    onShowDropdown();
  };

  if (!options.length) return null;

  return (
    <StyledSelector
      onMouseEnter={onActive}
      onMouseLeave={() => toggleActive(false)}
    >
      <StyledActiveValue>
        {currentValue.activeLabel ?? currentValue.label}
      </StyledActiveValue>
      <Conditional if={isActive || isCrawlable}>
        <div
          className={`selector-dropdown ${
            isActive ? 'selector-dropdown-active' : ''
          }`}
        >
          {options.map((option, index) => {
            const isSelected = currentValue.value == option.value;
            return (
              <StyledItem
                className={isSelected ? 'selected-tab' : ''}
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => handleChange(option)}
                {...option.itemProps}
              >
                <div className="selector-item">
                  <span className="item-label">{option.label}</span>
                  <Conditional if={isSelected}>
                    <TickSvg />
                  </Conditional>
                </div>
              </StyledItem>
            );
          })}
        </div>
      </Conditional>
    </StyledSelector>
  );
};

export default DropdownSelector;
