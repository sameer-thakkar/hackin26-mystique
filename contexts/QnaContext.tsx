import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

interface QnaContextType {
  showDrawer: boolean;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  qnaCommonEvents: Record<string, any>;
  setQnaCommonEvents: Dispatch<SetStateAction<Record<string, any>>>;
}

export const QnaContext = createContext<QnaContextType>({
  showDrawer: false,
  setShowDrawer: () => {},
  showModal: false,
  setShowModal: () => {},
  qnaCommonEvents: {},
  setQnaCommonEvents: () => {},
});

export const QnaContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [qnaCommonEvents, setQnaCommonEvents] = useState<Record<string, any>>(
    {}
  );

  const contextValue = useMemo(
    () => ({
      showDrawer,
      setShowDrawer,
      showModal,
      setShowModal,
      qnaCommonEvents,
      setQnaCommonEvents,
    }),
    [showDrawer, showModal, qnaCommonEvents]
  );

  return (
    <QnaContext.Provider value={contextValue}>{children}</QnaContext.Provider>
  );
};
