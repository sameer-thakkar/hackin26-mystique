import React, { useState, useRef } from 'react';
import { CHEVRON_DOWN } from '../../assets/SvgIcons';
import { useCaptureClickOutside } from '../hooks/ClickOutside';
import { COLORS, GRAPHIK } from '../../constants/ui-constants';

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

  const [dropdownActive, setDropdownActive] = useState(false);
  const [activeFilter, setActiveFilter] = useState(0);

  const changeFilter = (index = 0) => {
    setActiveFilter(index);
    props.toggleFilterDropdown();
    props.changeOrder(filters[index].key);
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
    <div className="filter-selector-container" ref={parentRef}>
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
        <div className={'icon ' + (dropdownActive ? 'active' : '')}>
          {CHEVRON_DOWN}
        </div>
      </div>
      {dropdownActive ? (
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
                    {isActive ? (
                      <img
                        alt="check"
                        src="https://cdn-imgix-open.headout.com/mystique/assets/tick.svg"
                      />
                    ) : null}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <style jsx>
        {`
          .filter-dropdown {
            z-index: 10;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
          }
          .filter-selector-container {
            margin: 0;
            position: relative;
          }
          .selected-tab {
            color: ${COLORS.RHAPSODY};
          }
          .filter-selector {
            line-height: 1;
          }
          .current-filter-toggle {
            font-family: ${GRAPHIK.FONT_STACK};
            font-weight: ${GRAPHIK.REGULAR};
            font-size: 16px;
            text-transform: capitalize;
            cursor: pointer;
            display: grid;
            grid-template-columns: auto 16px;
            grid-column-gap: 12px;
            align-items: center;
          }
          .current-filter {
            color: ${COLORS.TEAL};
          }
          .current-filter-toggle .icon {
            transition: transform ease 0.4s;
            transform-origin: center center;
          }
          .current-filter-toggle .icon.active {
            transform: rotate(180deg);
          }
          .icon {
            display: flex;
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
            font-family: Avenir;
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
        `}
      </style>
    </div>
  );
};
