import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Image from 'UI/Image';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { isSameURL } from 'utils/helper';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import ChevronDown from 'assets/chevronDown';
import PurpsTickMark from 'assets/purpsTickMark';

interface IResponsiveSelectWrapper {
  hasIcon?: boolean;
  hasChevron?: boolean;
  iconPosition?: string;
  addPadding?: boolean;
}

const ResponsiveSelectWrapper = styled.div<IResponsiveSelectWrapper>`
  margin: 0;
  user-select: none;
  position: relative;
  .responsive-dropdown {
    z-index: 10;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
    border: 1px solid ${COLORS.GRAY.G6};
    color: ${COLORS.GRAY.G2};
  }
  .responsive-selector {
    line-height: 1;
  }
  .current-responsive-toggle {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 16px;
    text-transform: capitalize;
    cursor: pointer;
  }
  .responsive-dropdown {
    padding: 20px 15px;
    position: absolute;
    background: ${COLORS.BRAND.WHITE};
    grid-row-gap: 24px;
    border-radius: 4px;
    display: grid;
    top: 50px;
    overflow-y: scroll;
    max-height: 70vh;
  }

  .responsive-option,
  .close-btn {
    font-family: ${HALYARD.FONT_STACK};
    cursor: pointer;
    font-size: 16px;
    border: none;
    display: grid;
    padding: 0;
    grid-template-columns: auto 16px;
    grid-gap: 10px;
    justify-items: space-between;
    min-width: 150px;
  }
  .responsive-dropdown .active-tab {
    color: ${({ theme }) => theme.primaryColor};
  }
  .current-selection {
    display: grid;
    grid-template-columns: auto ${({ hasIcon }) => (hasIcon ? 'auto' : '')} ${({
        hasChevron,
      }) => (hasChevron ? 'auto' : '')};
    justify-content: space-between;
    align-items: center;
    grid-gap: 8px;
    font-size: 16px;
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 400;
    span {
      color: ${({ theme }) => theme.primaryBGText || COLORS.GRAY.G2};
    }
    svg {
      path {
        stroke: ${({ theme }) => theme.primaryBGText || COLORS.GRAY.G2};
      }
    }
  }
  .current-selection .field-icon {
    grid-column: ${({ iconPosition }) => (iconPosition == 'left' ? 1 : 2)};
    grid-row: ${({ iconPosition }) => (iconPosition == 'left' ? 1 : 'unset')};
  }
  .current-selection .toggle-icon {
    display: flex;
  }
  .responsive-option.active {
    color: ${COLORS.PURPS};
  }
  @media (max-width: 768px) {
    position: unset !important;
    .current-selection {
      justify-content: left;
      padding: ${({ addPadding }) => (addPadding ? '16px' : '')};
      span {
        color: ${COLORS.GRAY.G2};
      }
      svg {
        path {
          stroke: ${COLORS.GRAY.G2};
        }
      }
    }
    .responsive-option.active {
      color: ${COLORS.GRAY.G2};
    }
    .responsive-dropdown {
      position: fixed;
      z-index: 999;
      bottom: -2px;
      top: unset;
      left: 50%;
      transform: translateX(-50%);
      width: 95%;
      text-align: center;
      grid-gap: 0;
      padding: 0;
      border-radius: 4px;
    }
    .responsive-dropdown-active {
      animation: scroll-in ease 0.3s forwards;
    }
    .responsive-dropdown .active-tab {
      color: #545454;
    }
    .current-responsive-toggle {
      text-transform: uppercase;
    }

    .responsive-option,
    .close-btn {
      border-bottom: 1px solid ${COLORS.GRAY.G6};
      padding: 16px 0;
      background: none;
    }
    .responsive-option .check-mark {
      display: none;
    }

    .close-mask {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      background: #000;
      opacity: 0.5;
      z-index: 500;
    }
    .close-btn {
      color: ${COLORS.BRAND.PURPS};
    }

    @keyframes scroll-in {
      from {
        bottom: -100%;
      }
      to {
        bottom: -2px;
      }
    }
  }
  .field-icon {
    display: grid;
  }
  .field-icon img {
    height: 16px;
    width: 16px;
  }
`;

export const ResponsiveSelector = (props: any) => {
  const {
    currentSelectionIndex,
    isMobile,
    onChange,
    customClassName = '',
    options: optionsProp,
    icon,
    iconPosition,
    toggleIcon = true,
    addPadding = false,
  } = props;

  // Sometimes we get options with value as undefined
  const options = optionsProp.filter((option: any) => Boolean(option.value));
  const [toggleActive, setToggleActive] = useState(false);
  const [current, setCurrent] = useState(currentSelectionIndex || 0);

  const selectionChangeHandler = (index: number) => {
    setCurrent(index);
    onChange(options[index]);
    handleMenuToggle();
  };

  const handleMenuToggle = () => {
    setToggleActive((prevState) => !prevState);
  };

  const selectorRef = useRef(null);
  const parentRef = useRef(null);
  const exceptionElementRefs = [parentRef];
  useCaptureClickOutside(selectorRef, handleMenuToggle, exceptionElementRefs);

  useEffect(() => {
    if (window) {
      const currentUrl = window.location.href;
      const currentSelectionIndex = options.findIndex((option: any) =>
        isSameURL(currentUrl, option.value)
      );
      setCurrent(currentSelectionIndex);
    }
  }, [options]);

  return options.length ? (
    <ResponsiveSelectWrapper
      ref={parentRef}
      className={`responsive-selector-container ${customClassName}`}
      hasChevron={toggleIcon}
      hasIcon={icon}
      iconPosition={iconPosition}
      addPadding={addPadding}
    >
      <div
        className="current-selection"
        role="button"
        tabIndex={0}
        onClick={handleMenuToggle}
      >
        <span className="current-selection-toggle">
          {current > -1 ? options[current].label : strings.SELECT_CITY}
        </span>
        {icon ? (
          <span className="field-icon">
            {typeof icon === 'string' && icon.trim().startsWith('http') ? (
              <Image url={icon} alt="Selector Icon" />
            ) : (
              icon
            )}
          </span>
        ) : null}
        {toggleIcon ? (
          <div className={'toggle-icon ' + (toggleActive ? 'active' : '')}>
            <ChevronDown />
          </div>
        ) : null}
      </div>
      {toggleActive ? (
        <div
          ref={selectorRef}
          className={`responsive-dropdown ${
            toggleActive ? 'responsive-dropdown-active' : ''
          }`}
        >
          {options.map((option: any, index: number) => {
            return (
              <div
                className={`responsive-option ${
                  current == index ? 'active' : ''
                }`}
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => selectionChangeHandler(index)}
              >
                <span>{option.label}</span>
                {current == index ? PurpsTickMark : null}
              </div>
            );
          })}
          {isMobile ? (
            <div
              onClick={handleMenuToggle}
              role="button"
              tabIndex={0}
              className="close-btn"
            >
              Close
            </div>
          ) : null}
        </div>
      ) : null}
      {isMobile && toggleActive ? (
        <div
          onClick={handleMenuToggle}
          role="button"
          tabIndex={0}
          className="close-mask"
        ></div>
      ) : null}
    </ResponsiveSelectWrapper>
  ) : null;
};
