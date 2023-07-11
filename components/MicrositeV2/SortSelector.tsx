import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import { CHEVRON_DOWN, PURPS_TICK_MARK } from 'assets/SvgIcons';

const StyledSortSelector = styled.div<{ isEntertainmentMb: boolean }>`
  margin: 0;
  position: relative;
  .filter-dropdown {
    z-index: 10;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
  }
  .selected-tab {
    color: ${COLORS.BRAND.PURPS};
  }
  .filter-selector {
    line-height: 1;
  }
  .current-filter-toggle {
    ${expandFontToken('UI/Label Regular')};
    cursor: pointer;
    display: grid;
    grid-template-columns: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '1fr' : 'auto 16px'};
    grid-column-gap: 12px;
    align-items: center;

    span {
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && `color: ${COLORS.GRAY.G4};`}
    }
    .current-filter {
      color: ${COLORS.BRAND.PURPS};
    }
    .icon {
      display: flex;
      transition: transform ease 0.4s;
      transform-origin: center center;
      .active {
        transform: rotate(180deg);
      }
    }
  }
  .filter-dropdown {
    padding: 20px 15px;
    background: #fff;
    grid-row-gap: 24px;
    border-radius: 4px;
    position: absolute;
    right: 0;
    top: 40px;
    display: grid;
  }
  .filter-name {
    cursor: pointer;
    border: none;
    text-transform: capitalize;
    display: grid;
    padding: 0;
    grid-template-columns: auto 16px;
    grid-gap: 10px;
    justify-items: space-between;
    min-width: 150px;
  }
`;

export const SortSelector = (props: any) => {
  let filters = [
    {
      name: strings.POPULARITY,
      key: 'popularity',
    },
    {
      name: strings.PRICE,
      key: 'price',
    },
  ];

  const {
    toggleFilterDropdown,
    changeOrder,
    isEntertainmentMb,
    isFilterDropdownActive: dropdownActive,
  } = props;

  const [activeFilter, setActiveFilter] = useState(0);

  const changeFilter = (index = 0) => {
    setActiveFilter(index);
    toggleFilterDropdown();
    changeOrder(filters[index].key);
  };

  const closeFilterDropdown = () => {
    toggleFilterDropdown(false);
  };

  const selectorRef = useRef(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const exceptionElementRefs = [parentRef];
  useCaptureClickOutside(
    selectorRef,
    closeFilterDropdown,
    exceptionElementRefs
  );

  return (
    <StyledSortSelector ref={parentRef} isEntertainmentMb={isEntertainmentMb}>
      <div
        onClick={toggleFilterDropdown}
        className="current-filter-toggle"
        role="button"
        tabIndex={0}
      >
        <span>
          {strings.SORT_BY}:
          <span className="current-filter"> {filters[activeFilter].name}</span>
        </span>
        <Conditional if={!isEntertainmentMb}>
          <div className={'icon ' + (dropdownActive ? 'active' : '')}>
            {CHEVRON_DOWN}
          </div>
        </Conditional>
      </div>
      <Conditional if={dropdownActive}>
        <div ref={selectorRef} className={`filter-dropdown`}>
          {filters.map((filter, index) => {
            const isActive = filters[activeFilter].name == filter.name;
            return (
              <div
                className={isActive ? 'selected-tab' : ''}
                key={index}
                onClick={() => {
                  changeFilter(index);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="filter">
                  <span className="filter-name">
                    {filter.name}
                    <Conditional if={isActive}>{PURPS_TICK_MARK}</Conditional>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Conditional>
    </StyledSortSelector>
  );
};
