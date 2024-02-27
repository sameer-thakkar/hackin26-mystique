import { ReactNode } from 'react';

export type TPositionType = 'top-center' | 'bottom-center';

export type TSToast = {
  id: string;
  message: string | ReactNode;
  duration?: number | null;
  autoClose?: boolean;
  position?: TPositionType;
};

export type TAddToast = (config: {
  message: string | ReactNode;
  duration?: number | null;
  autoClose?: boolean;
  position?: TPositionType;
}) => void;

export type RemoveToast = (id: string) => void;

export interface ToastContextType {
  addToast: TAddToast;
  removeToast: RemoveToast;
}
