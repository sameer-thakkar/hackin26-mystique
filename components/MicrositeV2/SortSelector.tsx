import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import Conditional from 'components/common/Conditional';
import { CHEVRON_DOWN, PURPS_TICK_MARK } from 'assets/SvgIcons';
import { COLORS, SOLEIL } from 'const/ui-constants';

const StyledSortSelector = styled.div`
  margin: 0;
  position: relative;
  .filter-dropdown {
    z-index: 10;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
  }
  .selected-tab {
    color: ${COLORS.PURPS};
  }
  .filter-selector {
    line-height: 1;
  }
  .current-filter-toggle {
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? SOLEIL.SEMIBOLD : SOLEIL.REGULAR};
    font-size: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '14px' : '16px'};
    line-height: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '15px' : '17px'};
    text-transform: capitalize;
    cursor: pointer;
    display: grid;
    grid-template-columns: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '1fr' : 'auto 16px'};
    grid-column-gap: 12px;
    align-items: center;

    span {
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && `color: ${COLORS.GREY.G4};`}
    }
    .current-filter {
      color: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? COLORS.PURPS : COLORS.TEAL};
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb &&
        `font-weight:${SOLEIL.REGULAR};font-size: 15px;line-height:20px;font-feature-settings: 'ss04' on;`}
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
    font-family: ${SOLEIL.FONT_STACK};
    cursor: pointer;
    font-size: 16px;
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

export const SortSelector = (props) => {
  let filters = [
    {
      name: 'Popularity',
      key: 'popularity',
    },
    {
      name: 'Price',
      key: 'price',
    },
  ];

  const {
    toggleFilterDropdown: toggleFilterDropdownFn,
    changeOrder,
    isEntertainmentMb,
  } = props;

  const [dropdownActive, setDropdownActive] = useState(false);
  const [activeFilter, setActiveFilter] = useState(0);

  const changeFilter = (index = 0) => {
    setActiveFilter(index);
    toggleFilterDropdownFn();
    changeOrder(filters[index].key);
  };

  const toggleFilterDropdown = () => {
    setDropdownActive((prevState) => !prevState);
  };

  const closeFilterDropdown = () => {
    setDropdownActive(false);
  };

  const selectorRef = useRef(null);
  const parentRef = useRef(null);
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
          Sort By:{' '}
          <span className="current-filter">{filters[activeFilter].name}</span>
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
