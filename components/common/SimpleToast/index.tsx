import React from 'react';
import {
  CloseButton,
  TextContainer,
  ToastContainer,
  ToastGroup,
} from 'components/common/SimpleToast/styles';
import { TPositionType, TSToast } from 'components/common/SimpleToast/types';
import { useToast } from 'contexts/toastContext';
import { groupBy } from 'utils/arrayUtils';
import CrossIconSvg from 'assets/crossiconSvg';

const Toast = ({ message, id }: Partial<TSToast>) => {
  const { removeToast } = useToast();

  return (
    <ToastContainer>
      <TextContainer>{message}</TextContainer>
      <CloseButton onClick={() => removeToast(id as string)}>
        <CrossIconSvg />
      </CloseButton>
    </ToastContainer>
  );
};

const ToastManager = ({ toasts }: { toasts: TSToast[] }) => {
  const groupedToasts = groupBy(toasts, 'position');
  const positions = Object.keys(groupedToasts) as TPositionType[];

  return (
    <>
      {positions.map((position) => {
        return (
          <ToastGroup $pos={position || 'top-center'} key={position}>
            {groupedToasts[position].map((toast) => (
              <Toast message={toast.message} key={toast.id} id={toast.id} />
            ))}
          </ToastGroup>
        );
      })}
    </>
  );
};

export default ToastManager;
