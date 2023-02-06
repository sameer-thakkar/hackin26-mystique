import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';

import sliceHandler from '../Slices';
import { CLOSE_BLACK } from '../../assets/SvgIcons';

const Popup = (props: any) => {
  const { data, togglePopup, children } = props;
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (window) setIsMobile(window?.innerWidth < 768);
  }, []);
  const { body } = data;

  return ReactDOM.createPortal(
    <div className="aio-popup-wrap">
      <div
        className="popup-mask"
        role="button"
        tabIndex={0}
        onClick={() => {
          togglePopup(false);
        }}
      ></div>
      <div className="aio-popup-container">
        <div className="aio-header">
          <div
            className="close"
            role="button"
            tabIndex={0}
            onClick={() => {
              togglePopup(false);
            }}
          >
            {CLOSE_BLACK}
          </div>
        </div>
        <div className="popup-slices">
          {children ? (
            children
          ) : (
            <div className={`popup-slice ${body[0].slice_type}`}>
              {sliceHandler(body[0], { isMobile })}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .aio-popup-wrap {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: grid;
          z-index: 999;
          place-content: center;
        }
        .aio-popup-container {
          display: grid;
          grid-template-rows: auto;
          width: auto;
          justify-self: center;
          z-index: 10;
          align-self: center;
          position: relative;
        }
        .aio-header {
          z-index: 1;
          padding: 8px;
          display: contents;
        }
        .popup-slices {
          display: grid;
          justify-content: center;
          height: auto;
        }
        .popup-slice {
          display: block;
          font-family: ${HALYARD.FONT_STACK};
          font-weight: 400;
          background: #fff;
        }
        .popup-mask {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 0;
          background: rgba(0, 0, 0, 0.6);
        }
        .close {
          cursor: pointer;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 2;
          margin: 8px;
        }
        @media (max-width: 768px) {
          .popup-slice {
            ${props.alert ? 'border-radius: 8px 8px 0px 0px;' : ''}
          }
          .aio-popup-wrap {
            ${props.alert ? 'place-content: end;' : ''}
          }
          .aio-popup-container {
            padding: 0;
            place-content: unset;
            max-width: 100%;
            width: 100%;
          }
          .aio-header {
            width: calc(100% - 32px);
          }
        }
      `}</style>
      <style jsx global>{`
        .aio-popup-container .close svg {
          height: 24px;
          width: 24px;
        }
        .aio-popup-container .close svg path {
          stroke: ${COLORS.BRAND.WHITE};
          height: 32px;
          width: 32px;
        }
        .popup-slices h1 {
          text-align: center;
        }
        .popup-slices p,
        .popup-slices li {
          font-size: 1.2em;
          line-height: 1.5;
        }
        .popup-slice.rich_text {
          border-top: none;
          padding: 0 1em 2em 0;
          color: ${COLORS.GRAY.G2};
          font-family: ${HALYARD.FONT_STACK};
        }
        @media (max-width: 768px) {
          .popup-slice.rich_text {
            padding: 0;
          }
          .popup-slices p,
          .popup-slices li {
            font-size: 1em;
          }
          .popup-slice.rich_text ul {
            padding: 0.5em;
          }
          .popup-slice.rich_text h1 {
            margin: 0;
          }
          .popup-slice img {
            height: auto;
            width: 100%;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};
export default Popup;
