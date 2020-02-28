import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import sliceHandler from '../Slices';
import { CLOSE_WHITE } from '../../public/static/svg-icons';
import { COLORS, GRAPHIK, AVENIR } from '../../constants/ui-constants';

const Popup = props => {
  const { data, togglePopup } = props;
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (window) setIsMobile(window?.innerWidth < 768);
  }, []);
  const { body } = data;
  return ReactDOM.createPortal(
    <div className="aio-popup-wrap">
      <div
        className="popup-mask"
        onClick={() => {
          togglePopup(false);
        }}
      ></div>
      <div className="aio-popup-container">
        <div className="aio-header">
          <div
            className="close"
            onClick={() => {
              togglePopup(false);
            }}
          >
            {CLOSE_WHITE}
          </div>
        </div>
        <div className="popup-slices">
          {body.map((slice, index) => {
            return (
              <div className={`popup-slice ${slice.slice_type}`}>
                {sliceHandler(slice, { isMobile })}
              </div>
            );
          })}
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
          margin: 50px;
          grid-template-rows: 60px auto;
          width: auto;
          justify-self: center;
          z-index: 10;
          align-self: center;
        }
        .aio-header {
          z-index: 1;
          background: #fff;
          display: grid;
          align-items: center;
          justify-content: right;
          border-bottom: 1px solid ${COLORS.DADDY};
          padding: 16px;
        }
        .popup-slices {
          display: grid;
          justify-content: center;
          height: max-content;
        }
        .popup-slice {
          display: block;
          font-family: ${GRAPHIK.FONT_STACK};
          font-weight: ${GRAPHIK.REGULAR};
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
        }
        @media (max-width: 768px) {
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
          stroke: ${COLORS.DAVY_GREY};
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
          color: ${COLORS.DAVY_GREY};
          font-family: ${AVENIR.FONT_STACK};
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
