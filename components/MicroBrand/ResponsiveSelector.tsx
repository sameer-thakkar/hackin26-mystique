import React, { Component, useState, useEffect, useRef } from 'react';
import { useCaptureClickOutside } from '../hooks/ClickOutside';
import Image from '../UI/Image';
import { AVENIR, COLORS, GRAPHIK } from '../../constants/ui-constants';
import { CHEVRON_DOWN } from '../../public/static/svg-icons';

export const ResponsiveSelector = props => {
  const {
    currentSelectionIndex,
    responsiveDropdown,
    host,
    isMobile,
    onChange,
    customClassName = '',
    options,
    icon,
    iconPosition,
    toggleIcon = true,
  } = props;

  const [toggleActive, setToggleActive] = useState(false);
  const [current, setCurrent] = useState(currentSelectionIndex || 0);

  const selectionChangeHandler = index => {
    setCurrent(index);
    onChange(options[index]);
    handleMenuToggle();
  };

  const handleMenuToggle = () => {
    setToggleActive(prevState => !prevState);
  };

  const selectorRef = useRef(null);
  const parentRef = useRef(null);
  const exceptionElementRefs = [parentRef];
  useCaptureClickOutside(selectorRef, handleMenuToggle, exceptionElementRefs);
  return options.length ? (
    <div
      ref={parentRef}
      className={`responsive-selector-container ${customClassName}`}
    >
      <div className="current-selection" onClick={handleMenuToggle}>
        <span className="current-selection-toggle">
          {options[current].label}
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
                onClick={() => selectionChangeHandler(index)}
              >
                <span>{option.label}</span>
                {current == index ? (
                  <img
                    className="check-mark"
                    src="https://cdn-imgix-open.headout.com/mystique/assets/tick.svg"
                  />
                ) : null}
              </div>
            );
          })}
          {isMobile ? (
            <div onClick={handleMenuToggle} className="close-btn">
              Close
            </div>
          ) : null}
        </div>
      ) : null}
      {isMobile && toggleActive ? (
        <div onClick={handleMenuToggle} className="close-mask"></div>
      ) : null}
      <style jsx>
        {`
          .responsive-dropdown {
            z-index: 10;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
            border: 1px solid ${COLORS.DADDY};
            color: ${COLORS.DAVY_GREY};
          }
          .responsive-selector-container {
            margin: 0;
            user-select: none;
            position: relative;
          }
          .responsive-selector {
            line-height: 1;
          }
          .current-responsive-toggle {
            font-family: Avenir;
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
          .responsive-dropdown .active-tab {
            color: #ec1943;
          }
          .current-selection {
            display: grid;
            grid-template-columns: auto ${icon ? 'auto' : ''} ${toggleIcon
                ? 'auto'
                : ''};
            justify-content: space-between;
            align-items: center;
            grid-gap: 8px;
            font-size: 16px;
            font-family: ${GRAPHIK.FONT_STACK};
            font-weight: ${GRAPHIK.REGULAR};
            color: ${COLORS.DAVY_GREY};
          }
          .current-selection .field-icon {
            grid-column: ${iconPosition == 'left' ? 1 : 2};
            grid-row: ${iconPosition == 'left' ? 1 : 'unset'};
          }
          .responsive-option.active {
            color: ${COLORS.RHAPSODY};
          }
          @media (max-width: 768px) {
            .current-selection {
              justify-content: left;
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

            .responsive-selector-container {
              position: unset !important;
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
        `}
      </style>
      <style global jsx>{`
        .field-icon {
          display: grid;
        }
        .field-icon img {
          height: 16px;
          width: 16px;
        }
      `}</style>
    </div>
  ) : null;
};
