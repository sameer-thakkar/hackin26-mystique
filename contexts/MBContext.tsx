/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { getLangObject } from 'utils/helper';
import { SIDEBAR_TYPES } from 'const/index';
import { useRouter } from 'next/router';
import { addUrlParams } from 'utils/urlUtils';

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
  host: '',
  isDev: false,
  isStage: false,
  bookSubdomain: 'book',
  primaryCountry: null,
  primaryCity: null,
  redirectToHeadoutBookingFlow: false,
});

export const MBContextProvider = (props: any) => {
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
    isDev,
    isStage,
    bookSubdomain,
    primaryCountry,
    primaryCity,
    redirectToHeadoutBookingFlow,
  } = props;
  const [sidebarModalStack, setSidebarModalStack] = useState([]);
  const router = useRouter();
  // edge case
  //2. handle URLs for desktop
  // a. combo should redirect to booking flow
  // b. pid should scroll to that card

  const addToAside = ({
    children,
    title = '',
    width = '',
    sidePadding = 0,
    type = SIDEBAR_TYPES.DEFAULT,
    onCloseCallback,
    history,
  }: any) => {
    const modalState = {
      children,
      title,
      width,
      sidePadding,
      type,
      onCloseCallback,
      history,
    };

    // @ts-expect-error TS(2322): Type '{ children: any; title: any; width: any; sid... Remove this comment to see the full error message
    setSidebarModalStack([...sidebarModalStack, modalState]);
    if (history) {
      const {
        pid: routerPid,
        popup: routerPopup,
        ...otherParams
      } = router.query;
      //URL as a single source of truth
      const urlParams = new URLSearchParams(window.location.search);
      const pid = urlParams.get('pid');
      const popup = urlParams.get('popup');

      //for multilevel replace params
      if (pid && popup)
        addUrlParams({
          urlParams: { ...otherParams, ...history.params },
          historyState: { ...window.history.state, ...history.params },
          replace: true,
        });
      else
        addUrlParams({
          urlParams: { ...otherParams, ...history.params },
          historyState: { ...window.history.state, ...history.params },
          replace: false,
        });
    }
  };

  const closeAside = () => {
    setSidebarModalStack([...sidebarModalStack.slice(0, -1)]);
  };
  const resetAside = () => setSidebarModalStack([]);

  const getActiveAside = () =>
    sidebarModalStack && sidebarModalStack[sidebarModalStack.length - 1];

  const buttons = {
    see_more_text: microsite?.see_more_text,
  };
  const nakedDomain = !host?.includes('localhost')
    ? host.replace('stage-', '').split('.').slice(1).join('.')
    : 'headout.com';

  return (
    <MBContext.Provider
      value={{
        uid,
        lang: getLangObject(lang).code,
        language_full: lang,
        nakedDomain,
        // @ts-expect-error TS(2322): Type '{ see_more_text: any; }' is not assignable t... Remove this comment to see the full error message
        buttons: buttons,
        design,
        sidebarModal: {
          stack: sidebarModalStack,
          // @ts-expect-error TS(2322): Type '({ children, title, width, sidePadding, type... Remove this comment to see the full error message
          addToAside,
          // @ts-expect-error TS(2322): Type '() => void' is not assignable to type 'null'... Remove this comment to see the full error message
          closeAside,
          // @ts-expect-error TS(2322): Type '() => void' is not assignable to type 'null'... Remove this comment to see the full error message
          resetAside,
        },
        mbTheme,
        isPreview,
        currencySymbolMap,
        noTrack,
        biLink,
        isGlobalMb,
        host,
        isDev,
        isStage,
        bookSubdomain,
        primaryCountry,
        primaryCity,
        redirectToHeadoutBookingFlow,
      }}
    >
      {props.children}
      {sidebarModalStack.length ? (
        <AsideModal
          resetAside={resetAside}
          active={sidebarModalStack.length}
          width={(getActiveAside() as any)?.width}
          sidePadding={(getActiveAside() as any)?.sidePadding}
          stack={sidebarModalStack}
          title={(getActiveAside() as any)?.title}
          closeModal={closeAside}
          type={(getActiveAside() as any)?.type}
          onCloseCallback={(getActiveAside() as any)?.onCloseCallback}
          isQueryRestore={(getActiveAside() as any)?.history?.isQueryRestore}
          isGlobalMb={isGlobalMb}
        >
          {(getActiveAside() as any)?.children}
        </AsideModal>
      ) : null}
    </MBContext.Provider>
  );
};
