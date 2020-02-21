import React from 'react';
import ReactDOM from 'react-dom';
import { sliceHandler } from '../Slices';
import { CLOSE_WHITE } from '../../public/static/svg-icons';
import { COLORS } from '../../constants/ui-constants';

const Popup = props => {
  const { data, togglePopup } = props;
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
            return <div className="popup-slice">{sliceHandler(slice)}</div>;
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
        }
        .aio-popup-container {
          display: grid;
          padding: 50px;
          grid-template-rows: 60px auto;
          width: max-content;
          justify-self: center;
          align-self: center;
        }
        .aio-header {
          z-index: 1;
          background: #fff;
          display: grid;
          align-items: center;
          justify-content: right;
          padding: 16px;
        }
        .popup-slices {
          display: grid;
          justify-content: center;
        }
        .popup-slice {
          display: flex;
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
            align-self: end;
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
      `}</style>
    </div>,
    document.body
  );
};
export default Popup;
