// Imported from deimos in the interest of time
import React from 'react';
import styled from 'styled-components';

const defaultTimeout = 8000; // ms
// const animationDuration = 300; // ms

let toast: any = null;

const ToastNotification = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  top: -50px;
  left: 50%;
  z-index: 99999;
  pointer-events: none;
  transition: all 300ms ease;
  transform: translate(-50%, 0);
  border-radius: 12px;
  background: #fff;
  padding: 1rem 1.5rem !important;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1rem !important;
  }
  &.confirmation {
    width: 100%;
    opacity: 0;
    background: #34a853;
    border-radius: 0;
    padding: 15px 0;
    top: 54px;
    transform: translate(-50%, 0);
    transition: opacity 350ms linear;

    &.show {
      opacity: 0.9;
      transform: translate(-50%, 0);
    }

    &.hide {
      opacity: 0;
      transform: translate(-50%, 0);
    }
  }

  &.show {
    transform: translate(-50%, 108px);
  }

  &.hide {
    transform: translate(-50%, -108px);
  }

  &.success {
    background: #55ca92;
  }

  &.error {
    background: #ffe6e6;

    span {
      color: #444444;
    }
  }

  &.info {
    background: #bababa;
  }

  &.warning {
    background: #f5e273;

    span {
      color: #333333;
    }
  }

  .warning-icon {
    margin-right: 12px;
  }

  .close-icon {
    margin-left: 20px;
    cursor: pointer;
    pointer-events: all;
  }

  span {
    white-space: pre-wrap;
    color: #fff;
  }
`;

type NotificationTypes = 'info' | 'warning' | 'confirmation' | 'success';

/* React Notification Component */
/* eslint-disable react/no-multi-comp */
class Toast extends React.Component {
  state = { className: '', text: '', type: '' };

  displayToast = (
    text: string,
    type: NotificationTypes,
    timeout = defaultTimeout
  ) => {
    this.setState({ text, type });
    setTimeout(this.show, 100); // wait 100ms after the component is called to animate toast.
    setTimeout(this.hide, timeout);
  };

  hide = () => {
    this.setState({ className: 'hide' });
  };

  show = () => {
    this.setState({ className: 'show' });
  };

  render() {
    const { text, type, className } = this.state;
    return (
      <ToastNotification
        className={`toast-notification ${type} ${className}`}
        id="toast"
      >
        <span>{text}</span>
      </ToastNotification>
    );
  }
}

/* Show Animated Toast Message */
const show = (
  text: string,
  type: NotificationTypes,
  timeout = defaultTimeout
) => {
  // Render Component with Props.
  if (toast) {
    toast.displayToast(text, type, timeout);
  }
};

const showConfirmation = (msg: string, timeout: number) => {
  show(msg, 'confirmation', timeout);
};

/* Export notification container */
// eslint-disable-next-line react/display-name
export default function ToastFunc() {
  return <Toast ref={(node) => (toast = node)} />;
}

/* Export notification functions */
export const notify = { show, showConfirmation };
/* eslint-enable react/no-multi-comp */
