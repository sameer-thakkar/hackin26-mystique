/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { TCityInfo } from 'components/AirportTransfers/interface';
import { getLangObject } from 'utils/helper';
import { addUrlParams } from 'utils/urlUtils';
import { SIDEBAR_TYPES } from 'const/index';

const AsideModal = dynamic(() => import('UI/AsideModal'), { ssr: false });

interface ISidebarModal {
  children?: React.ReactNode;
  title?: string;
  width?: string;
  sidePadding?: number;
  type?: string;
  onCloseCallback?: () => void;
  history?: {
    enable?: boolean;
    params?: Record<string, any>;
    isQueryRestore?: boolean;
  };
  isProductCardTracking?: boolean;
  tgid?: string | number;
  hideCloseButton?: boolean;
  noBackgroundOverlay?: boolean;
}

export const MBContext = createContext<{
  [x: string]: any;
  primaryCity: TCityInfo | null;
}>({
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
  bookSubdomain: 'book',
  primaryCountry: null,
  primaryCity: null,
  redirectToHeadoutBookingFlow: false,
  categoryHeaderMenu: {},
  userCountry: null,
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
    bookSubdomain,
    primaryCountry,
    primaryCity,
    redirectToHeadoutBookingFlow,
    categoryHeaderMenu,
    userCountry,
  } = props;
  const [sidebarModalStack, setSidebarModalStack] = useState<ISidebarModal[]>(
    []
  );
  const router = useRouter();
  const popstateBlockedRef = useRef(false);
  // edge case
  //2. handle URLs for desktop
  // a. combo should redirect to booking flow
  // b. pid should scroll to that card

  const getDefinedQueryParams = (
    query: Record<string, string | string[] | undefined>
  ) =>
    Object.fromEntries(
      Object.entries(query).filter(
        (entry): entry is [string, string | string[]] => entry[1] !== undefined
      )
    );

  const addToAside = ({
    children,
    title = '',
    width = '',
    sidePadding = 0,
    type = SIDEBAR_TYPES.DEFAULT,
    onCloseCallback,
    history,
    isProductCardTracking = false,
    tgid = '',
    hideCloseButton = false,
    noBackgroundOverlay = false,
  }: any) => {
    const activeAside = sidebarModalStack[sidebarModalStack.length - 1];
    const shouldIgnoreDuplicateProductCardOpen =
      type === SIDEBAR_TYPES.PRODUCT_CARD &&
      !!tgid &&
      activeAside?.type === SIDEBAR_TYPES.PRODUCT_CARD &&
      String(activeAside?.tgid) === String(tgid);

    if (shouldIgnoreDuplicateProductCardOpen) return;

    const modalState = {
      children,
      title,
      width,
      sidePadding,
      type,
      onCloseCallback,
      history,
      isProductCardTracking,
      tgid,
      hideCloseButton,
      noBackgroundOverlay,
    };

    // PRODUCT_CARD replaces the stack (one sheet at a time); stacking two broke iOS Safari.
    // Callbacks are read from the closure-captured stack (not the updater's prev) to
    // avoid side effects inside a pure updater — which fires twice in StrictMode.
    // Trade-off: two synchronous PRODUCT_CARD calls in the same React batch would both
    // read the same stale stack, but that scenario cannot occur via user interaction.
    if (type === SIDEBAR_TYPES.PRODUCT_CARD) {
      sidebarModalStack.forEach((entry) => entry.onCloseCallback?.());
    }
    setSidebarModalStack((prev) => {
      if (type === SIDEBAR_TYPES.PRODUCT_CARD) return [modalState];
      return [...prev, modalState];
    });
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

      // Block Next.js from processing popstate as a route transition
      // (which would call getServerSideProps and reload the page).
      // The aside's own popstate handler in AsideModal handles close.
      if (!popstateBlockedRef.current) {
        router.beforePopState(() => false);
        popstateBlockedRef.current = true;
      }

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

  const restoreAsideHistory = (aside?: ISidebarModal) => {
    if (!aside?.history?.isQueryRestore) return;

    const {
      pid: _routerPid,
      popup: _routerPopup,
      ...otherParams
    } = router.query;
    const {
      pid: _pid,
      popup: _popup,
      ...historyState
    } = window.history.state ?? {};

    addUrlParams({
      urlParams: getDefinedQueryParams(otherParams),
      historyState: { ...historyState },
      replace: true,
    });
  };

  const closeAside = () => {
    restoreAsideHistory(sidebarModalStack[sidebarModalStack.length - 1]);
    setSidebarModalStack((prev: ISidebarModal[]) => {
      const next = prev.slice(0, -1);
      // Restore Next.js back-button handling when no aside owns the URL.
      if (next.length === 0 && popstateBlockedRef.current) {
        router.beforePopState(() => true);
        popstateBlockedRef.current = false;
      }
      return next;
    });
  };
  const resetAside = () => {
    if (popstateBlockedRef.current) {
      router.beforePopState(() => true);
      popstateBlockedRef.current = false;
    }
    setSidebarModalStack([]);
  };

  const getActiveAside = () =>
    sidebarModalStack && sidebarModalStack[sidebarModalStack.length - 1];

  const buttons = {
    see_more_text: microsite?.see_more_text,
  };
  const nakedDomain = !host?.includes('localhost')
    ? host?.split('.').slice(1).join('.')
    : 'headout.com';

  return (
    <MBContext.Provider
      value={{
        uid,
        lang: getLangObject(lang).code,
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
        host,
        isDev,
        bookSubdomain,
        primaryCountry,
        primaryCity,
        redirectToHeadoutBookingFlow,
        categoryHeaderMenu,
        userCountry,
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
          isProductCardTracking={
            (getActiveAside() as any)?.isProductCardTracking
          }
          tgid={(getActiveAside() as any)?.tgid}
          hideCloseButton={(getActiveAside() as any)?.hideCloseButton}
          noBackgroundOverlay={(getActiveAside() as any)?.noBackgroundOverlay}
        >
          {(getActiveAside() as any)?.children}
        </AsideModal>
      ) : null}
    </MBContext.Provider>
  );
};
