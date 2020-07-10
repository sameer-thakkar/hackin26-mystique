import React, { createContext, useState } from 'react';
import AsideModal from 'UI/AsideModal';

export const MBContext = createContext({
  uid: null,
  lang: 'en',
  language_full: null,
  nakedDomain: null,
  buttons: null,
  design: null,
  sidebarModal: {
    addToAside: null, //(modalProps: {children, title, width?}) => {}
    stack: [],
    closeAside: null,
    resetAside: null,
  },
  mbTheme: null,
});

export const MBContextProvider = (props) => {
  const { uid, lang, microsite, host, design, mbTheme } = props;
  const [sidebarModalStack, setSidebarModalStack] = useState([]);

  const addToAside = ({
    children,
    title = '',
    width = '',
    sidePadding = 0,
  }) => {
    const tempStack = [...sidebarModalStack];
    tempStack.push({ children, title, width, sidePadding });
    setSidebarModalStack(tempStack);
  };

  const closeAside = () => setSidebarModalStack(sidebarModalStack.slice(0, -1));
  const resetAside = () => setSidebarModalStack([]);

  const getActiveAside = () =>
    sidebarModalStack && sidebarModalStack[sidebarModalStack.length - 1];

  const buttons = {
    see_more_text: microsite?.see_more_text,
  };
  const nakedDomain = !host.includes('localhost')
    ? host.replace('stage.', '').split('.').slice(1).join('.')
    : 'headout.com';

  return (
    <MBContext.Provider
      value={{
        uid,
        lang: lang.split('-')[0],
        language_full: lang,
        nakedDomain,
        buttons: buttons,
        design,
        sidebarModal: {
          stack: sidebarModalStack,
          addToAside,
          closeAside,
          resetAside,
        },
        mbTheme,
      }}
    >
      {props.children}
      {sidebarModalStack.length ? (
        <AsideModal
          resetAside={resetAside}
          active={sidebarModalStack.length}
          width={getActiveAside()?.width}
          sidePadding={getActiveAside()?.sidePadding}
          stack={sidebarModalStack}
          title={getActiveAside()?.title}
          closeModal={closeAside}
        >
          {getActiveAside()?.children}
        </AsideModal>
      ) : null}
    </MBContext.Provider>
  );
};
