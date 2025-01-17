import { createContext, useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';
import {
  RemoveToast,
  TAddToast,
  ToastContextType,
  TSToast,
} from 'components/common/SimpleToast/types';

const ToastManager = dynamic(
  () =>
    import(
      /* webpackChunkName: "SimpleToast" */ 'components/common/SimpleToast'
    ),
  {
    ssr: false,
  }
);

const toastContext = createContext<ToastContextType>({} as ToastContextType);

export const useToast = () => useContext(toastContext);

export const ToastProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<TSToast[]>([]);
  const { Provider: ToastContextProvider } = toastContext;

  const addToast: TAddToast = ({
    message,
    duration = 3000,
    autoClose = true,
    position = 'top-center',
  }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: TSToast = { id, message, duration, autoClose, position };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    if (autoClose) {
      setTimeout(() => removeToast(id), duration || 0);
    }
  };

  const removeToast: RemoveToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContextProvider value={{ addToast, removeToast }}>
      {children}
      <Conditional if={toasts.length}>
        <ToastManager toasts={toasts} />
      </Conditional>
    </ToastContextProvider>
  );
};
