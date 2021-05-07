import React, { createContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { getLangObject } from 'utils/helper';
import { SIDEBAR_TYPES } from 'const/index';

const AsideModal = dynamic(() => import('UI/AsideModal'), { ssr: false });

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
  isPreview: false,
  currencySymbolMap: {},
  noTrack: false,
  biLink: '',
  isGlobalMb: false,
});

export const MBContextProvider = (props) => {
  const {
    uid,
    lang,
    microsite,
    host,
    design,
    mbTheme,
    isPreview,
    currencySymbolMap,
    noTrack,
    biLink,
    isGlobalMb,
  } = props;
  const [sidebarModalStack, setSidebarModalStack] = useState([]);

  const addToAside = ({
    children,
    title = '',
    width = '',
    sidePadding = 0,
    type = SIDEBAR_TYPES.DEFAULT,
  }) => {
    const tempStack = [...sidebarModalStack];
    tempStack.push({ children, title, width, sidePadding, type });
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
    ? host.replace('stage-', '').split('.').slice(1).join('.')
    : 'headout.com';

  return (
    <MBContext.Provider
      value={{
        uid,
        lang: getLangObject(lang).short,
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
        isPreview,
        currencySymbolMap,
        noTrack,
        biLink,
        isGlobalMb,
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
          type={getActiveAside()?.type}
          isGlobalMb={isGlobalMb}
        >
          {getActiveAside()?.children}
        </AsideModal>
      ) : null}
    </MBContext.Provider>
  );
};
