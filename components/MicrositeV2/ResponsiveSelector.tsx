import React, { useState, useRef, useEffect, useContext } from 'react';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import * as labels from 'constants/localization/labels';
import Image from 'UI/Image';
import { COLORS, SOLEIL } from 'constants/ui-constants';
import { CHEVRON_DOWN } from 'assets/SvgIcons';
import styled from 'styled-components';
import { MBContext } from 'contexts/MBContext';
import { isSameURL } from 'utils/helper';

const ResponsiveSelectWrapper = styled.div`
  margin: 0;
  user-select: none;
  position: relative;
  .responsive-dropdown {
    z-index: 10;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
    border: 1px solid ${COLORS.DADDY};
    color: ${COLORS.DAVY_GREY};
  }
  .responsive-selector {
    line-height: 1;
  }
  .current-responsive-toggle {
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    text-transform: capitalize;
    cursor: pointer;
  }
  .responsive-dropdown {
    padding: 20px 15px;
    position: absolute;
    background: #fff;
    grid-row-gap: 24px;
    border-radius: 4px;
    display: grid;
    top: 50px;
  }

  .responsive-option,
  .close-btn {
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
  .responsive-dropdown .active-tab {
    color: ${({ theme }) => theme.primaryColor};
  }
  .current-selection {
    display: grid;
    grid-template-columns:
      auto ${({ hasIcon }) => (hasIcon ? 'auto' : '')}
      ${({ hasChevron }) => (hasChevron ? 'auto' : '')};
    justify-content: space-between;
    align-items: center;
    grid-gap: 8px;
    font-size: 16px;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.REGULAR};
    span {
      color: ${({ theme }) => theme.primaryBGText || COLORS.DAVY_GREY};
    }
    svg {
      path {
        stroke: ${({ theme }) => theme.primaryBGText || COLORS.DAVY_GREY};
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
    color: ${COLORS.RHAPSODY};
  }
  @media (max-width: 768px) {
    position: unset !important;
    .current-selection {
      justify-content: left;
      padding: ${({ addPadding }) => (addPadding ? '16px' : '')};
      span {
        color: ${COLORS.DAVY_GREY};
      }
      svg {
        path {
          stroke: ${COLORS.DAVY_GREY};
        }
      }
    }
    .responsive-option.active {
      color: ${COLORS.DAVY_GREY};
    }
    .responsive-dropdown {
      position: fixed;
      bottom: -2px;
      top: unset;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
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
      border-bottom: 1px solid #dadada;
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
      color: #ec1943;
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

export const ResponsiveSelector = (props) => {
  const {
    currentSelectionIndex,
    isMobile,
    onChange,
    customClassName = '',
    options,
    icon,
    iconPosition,
    toggleIcon = true,
    addPadding = false,
  } = props;

  const [toggleActive, setToggleActive] = useState(false);
  const [current, setCurrent] = useState(currentSelectionIndex || 0);
  const { lang: currentLanguage } = useContext(MBContext);

  const selectionChangeHandler = (index) => {
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
      const currentSelectionIndex = options.findIndex((option) =>
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
          {current > -1
            ? options[current].label
            : labels[currentLanguage].SELECT_CITY}
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
            {CHEVRON_DOWN}
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
          {options.map((option, index) => {
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
                {current == index ? (
                  <img
                    className="check-mark"
                    src="https://cdn-imgix-open.headout.com/mystique/assets/tick.svg"
                    alt=""
                  />
                ) : null}
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
