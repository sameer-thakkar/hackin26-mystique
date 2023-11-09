/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { scroller } from 'react-scroll';
import { useRouter } from 'next/router';
import styled, { css, keyframes } from 'styled-components';
import Conditional from 'components/common/Conditional';
import useWindowSize from 'hooks/useWindowSize';
import { trackEvent } from 'utils/analytics';
import { throttle } from 'utils/gen';
import { addUrlParams } from 'utils/urlUtils';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  SIDEBAR_TYPES,
} from 'const/index';
import { expandFontToken } from 'const/typography';
import {
  BackArrow,
  CLOSE_WHITE,
  DOUBLE_CHEVRON,
  LIST_ICON,
} from 'assets/SvgIcons';

const fadeRight = (from: string, to: string) => keyframes`
from {
  transform: translateX(${from});
  height: 0;
  width: 10.25rem;
  opacity: 0;
}
to {
  transform: translateX(${to});
  height: 90%;
  width: 14.625rem;
  opacity: 1;
}
`;

export const StyledAsideModal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  overflow-y: scroll;
  scroll-behavior: smooth;
  padding: 20px
    ${({ sidePadding }: { sidePadding: number }) =>
      sidePadding ? sidePadding : '24'}px;
  padding-top: 0;
  max-width: calc(
    ${({ width }: { width: string | null }) =>
      width ? (1440 * parseFloat(width)) / 100 : '606'}px - 48px
  );
  width: calc(
    ${({ width, sidePadding }: { sidePadding: number; width: string | null }) =>
      `${width ? width : '27.5vw'} - ${sidePadding ? sidePadding * 2 : '48'}px`}
  );
  ${({
    // @ts-expect-error TS(2339): Property 'sidebarType' does not exist on type 'Pic... Remove this comment to see the full error message
    sidebarType,
  }) =>
    sidebarType === SIDEBAR_TYPES.SIDE_NAV
      ? css`
          animation: ${fadeRight('-2.5rem', '0')} 300ms ease-in-out;
          padding: 0 0 1.25rem;
          right: unset;
          left: 2.5rem;
          height: 90%;
          border-radius: 8px;
          margin-top: 1.5rem;
          ::-webkit-scrollbar {
            display: none;
          }
          @media (max-width: 768px) {
            animation: unset;
          }
        `
      : ``}
  background: ${COLORS.BRAND.WHITE};
  z-index: 100;
  @media (max-width: 768px) {
    position: absolute;
    height: 100vh;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    max-width: unset;
    width: unset;
    ${({
      // @ts-expect-error TS(2339): Property 'sidebarType' does not exist on type 'Pic... Remove this comment to see the full error message
      sidebarType,
    }) => {
      switch (sidebarType) {
        case SIDEBAR_TYPES.PRODUCT_CARD:
          return `
          height: auto;
          padding: 0;
          background: unset;
          top: 0;
          overflow-y: unset;
          max-width: unset;
        `;
        case SIDEBAR_TYPES.COMBO_VARIANT:
          return `height: auto;
          padding: 0;
          background: ${COLORS.BRAND.BLACK};
        `;
        case SIDEBAR_TYPES.SIDE_NAV:
          return `
          left: unset;
          box-sizing: border-box;
          width: 100%;
          border-radius: 20px 20px 0 0;
          `;
        case SIDEBAR_TYPES.LISTICLE_CARD:
          return `
          height: auto;
          padding: 0;
          background: unset;
          top: 0;
          overflow-y: unset;
          max-width: unset;
        `;
        default:
          return ``;
      }
    }}
  }
`;
const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  padding-top: 20px;
  padding-bottom: 24px;
  position: ${({
    // @ts-expect-error TS(2339): Property 'headerType' does not exist on type 'Pick... Remove this comment to see the full error message
    headerType,
  }) => (headerType === SIDEBAR_TYPES.PRODUCT_CARD ? 'unset' : 'sticky')};
  ${({
    // @ts-expect-error TS(2339): Property 'headerType' does not exist on type 'Pick... Remove this comment to see the full error message
    headerType,
  }) =>
    headerType === SIDEBAR_TYPES.PRODUCT_CARD ||
    headerType === SIDEBAR_TYPES.LISTICLE_CARD
      ? `
      width: calc(100% - 32px);
      padding: 0 16px;
      padding-top: 12px;
      padding-bottom: 12px;
      .close-icon {
        display: flex;
        padding: 6px;
        border-radius: 100%;
        background: ${COLORS.BRAND.WHITE};
        svg {
          height: 10px;
          width: 10px;
        }
      }
    `
      : headerType === SIDEBAR_TYPES.SIDE_NAV
      ? ` 
      padding: 0.75rem 1rem;
      .close-icon {
        transform: rotate(180deg);
      }
      @media (max-width: 768px) {
        display: grid;
        grid-template-columns: 1.75rem auto auto;
        border-bottom: 1px solid ${COLORS.GRAY.G6};

        .close-icon {
          padding: 0 0.375rem;
          background: ${COLORS.GRAY.G8};
          border-radius: 4px;
          svg {
            height: 10px;
            width: 10px;
          }
          path {
            stroke: #545454;
            stroke-width: 1.8px;
          }
        }
      }
      `
      : headerType === SIDEBAR_TYPES.CONTACT_US_PANEL
      ? `
        border-bottom: 0.063rem solid ${COLORS.GRAY.G6};
        padding-bottom: 1rem;
        svg {
          height: 1rem;
          width: 1rem;
        };
        .close-icon{
          path {
            stroke-width: unset;
          };
        };
        `
      : ''}
  top: 0;
  background: ${({
    addBg,
    isGlobalMb,
  }: {
    addBg: boolean;
    isGlobalMb: boolean;
  }) =>
    addBg
      ? COLORS.BRAND.WHITE
      : isGlobalMb
      ? COLORS.BRAND.WHITE
      : 'transparent'};
  z-index: 12;
  ${({
    // @ts-expect-error TS(2339): Property 'headerType' does not exist on type 'Pick... Remove this comment to see the full error message
    headerType,
  }) =>
    headerType === SIDEBAR_TYPES.COMBO_VARIANT
      ? `
      width: calc(100% - 32px);
      background: ${COLORS.BRAND.WHITE};
      margin-top: 8px;
      padding: 32px 16px 8px 16px;
      border-radius: 20px 20px 0 0;
      .close-icon {
        display: flex;
        padding: 6px;
        background: ${COLORS.GRAY.G8};
        border-radius: 4px;
        svg {
          height: 10px;
          width: 10px;
        }
      }`
      : ''}
  @media (max-width: 768px) {
    &:before,
    &:after {
      ${({ addBg }) => (addBg ? `content: '';` : '')};
      display: block;
      width: 24px;
      position: absolute;
      height: 100%;
      background: ${COLORS.BRAND.WHITE};
    }
    &::before {
      left: 100%;
    }
    &::after {
      right: 100%;
    }
  }
`;

const StyledIcon = styled.div`
  padding-top: 0.2rem;
`;
const CloseIcon = styled.div`
  justify-self: right;
  cursor: pointer;
  z-index: 999;
  ${({ sidebarType }: { sidebarType: string }) =>
    sidebarType !== SIDEBAR_TYPES.SIDE_NAV
      ? `
      path {
        stroke: #545454;
        stroke-width: 1.8px;
      }`
      : ''}
`;

const Title = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}

  ${({ sidebarType }: { sidebarType: string }) =>
    sidebarType === SIDEBAR_TYPES.CONTACT_US_PANEL
      ? `${expandFontToken(FONTS.HEADING_SMALL)}`
      : ``}
      
  @media (max-width: 768px) {
    ${({ sidebarType }: { sidebarType: string }) =>
      sidebarType === SIDEBAR_TYPES.SIDE_NAV
        ? `
    ${expandFontToken(FONTS.HEADING_SMALL)}`
        : ``}
  }
`;

const BackIcon = styled.div`
  grid-column: 1 / 2;
  cursor: pointer;
`;
const Mask = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vw;
  background: rgba(0, 0, 0, 0.4);
  z-index: 90;
  @media (max-width: 768px) {
    display: none;
  }
`;
const ModalContent = styled.div`
  ${({
    sidebarType,
    windowHeight,
  }: {
    sidebarType: string;
    windowHeight: number;
  }) =>
    sidebarType === SIDEBAR_TYPES.PRODUCT_CARD
      ? `
  overflow-x: scroll;
  height: ${windowHeight - 46}px;
  border-radius: 10px 10px 0 0;
  `
      : sidebarType === SIDEBAR_TYPES.LISTICLE_CARD
      ? `
  overflow-x: scroll;
  height: ${windowHeight - 46}px;
  border-radius: 16px 16px 0 0;
  width: 100vw;
  max-width: 100vw;
  `
      : sidebarType === SIDEBAR_TYPES.COMBO_VARIANT
      ? `
  overflow-x: scroll;
  height: ${windowHeight - 46}px;`
      : sidebarType === SIDEBAR_TYPES.SIDE_NAV
      ? `
      overflow-y: scroll;
      height: 95%;
      ::-webkit-scrollbar {
        width: 10px;
      }
      ::-webkit-scrollbar-thumb {
        border: 4px solid ${COLORS.BRAND.WHITE};
        border-radius: 1000px;
        background-color: ${COLORS.GRAY.G4A};
      }`
      : ``}
`;

type OnCloseOptions = { triggeredByPopstate?: boolean };

const AsideModal = ({
  active,
  title,
  closeModal,
  children,
  stack = [],
  width,
  resetAside,
  sidePadding = 0,
  type,
  isGlobalMb = false,
  onCloseCallback = null,
  isQueryRestore = false,
  isProductCardTracking = false,
  tgid = '',
}: any) => {
  const container = useRef(null);
  // @ts-expect-error TS(2322): Type 'HTMLElement' is not assignable to type 'null... Remove this comment to see the full error message
  if (!container.current) container.current = document.body;

  const [scrollY, setScrollY] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const isMobile = isGlobalMb ? windowWidth <= 768 : windowWidth < 768;
  const hasBack = stack.length > 1;
  const router = useRouter();
  const scrollRef = useRef(null);
  const [scrollDetails, setScrollDetails] = useState({
    percentage: 0,
    isScrolledComplete: false,
  });

  useEffect(() => {
    scroller.scrollTo('active-element', {
      duration: 100,
      smooth: 'easeInOutQuart',
      containerId: 'side-container-index',
    });
    const onPopState = () => {
      onClose(null, { triggeredByPopstate: true });
    };

    if (isMobile) {
      setScrollY(window.scrollY);
      if (active) {
        window.addEventListener('popstate', onPopState);
      }
      // Saving scroll and hiding body is required for iOS compatability,
      // fixed elements break, they move from their position after partial scroll (browser hides its header)
      // to avoid this we removed position: fixed, and let the sidebar live in regular scroll flow.
      window.scrollTo(0, 0);
    }
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    if (active) container.current.classList.add('scroll-lock');

    return () => window.removeEventListener('popstate', onPopState);
  }, [active, isMobile]);

  useEffect(() => {
    const isScrolled =
      isProductCardTracking &&
      scrollDetails.percentage === 100 &&
      !scrollDetails.isScrolledComplete;

    if (isScrolled) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MORE_DETAILS_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.PERCENTAGE_VIEWED]: scrollDetails.percentage,
        [ANALYTICS_PROPERTIES.TGID]: tgid,
      });
      setScrollDetails({ ...scrollDetails, isScrolledComplete: true });
    }
  }, [scrollDetails.percentage]);

  const getScrollPercent = () => {
    if (scrollRef?.current && isProductCardTracking) {
      const {
        scrollTop = 0,
        scrollHeight = 0,
        clientHeight = 0,
      } = scrollRef.current;
      const percentageScrolled =
        (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollDetails({ ...scrollDetails, percentage: percentageScrolled });
    }
  };

  const throttledScrollHandler = throttle(getScrollPercent, 200);

  const onClose = (e = null, options: OnCloseOptions = {}) => {
    if ((e as any)?.target) {
      (e as any).stopPropagation();
    }
    if (!options.triggeredByPopstate) {
      if (isQueryRestore) {
        //go to landing page
        const {
          pid: routerPid,
          popup: routerPopup,
          ...otherParams
        } = router.query;
        const { pid, popup, ...historyState } = window.history.state;
        addUrlParams({
          urlParams: { ...otherParams },
          historyState: { ...historyState },
          replace: false,
        });
      } else {
        history.back();
      }
    }

    // @ts-expect-error TS(2531): Object is possibly 'null'.
    container.current.classList.remove('scroll-lock');
    if (isMobile) window.scrollTo(0, scrollY);
    if (onCloseCallback) onCloseCallback();
    closeModal();
  };
  const onCloseAll = () => {
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    container.current.classList.remove('scroll-lock');
    if (isMobile) window.scrollTo(0, scrollY);
    resetAside();
  };

  return container.current && active
    ? createPortal(
        <>
          <Mask onClick={onCloseAll} />
          <StyledAsideModal
            // @ts-expect-error TS(2769): No overload matches this call.
            windowHeight={windowHeight}
            sidebarType={type}
            width={width}
            sidePadding={sidePadding}
          >
            <Header
              // @ts-expect-error TS(2769): No overload matches this call.
              onClick={type === SIDEBAR_TYPES.PRODUCT_CARD ? onClose : null}
              addBg={!!title}
              headerType={type}
              sidePadding={sidePadding}
              isGlobalMb={isGlobalMb}
            >
              <Conditional if={type === SIDEBAR_TYPES.SIDE_NAV && isMobile}>
                <StyledIcon>{LIST_ICON}</StyledIcon>
              </Conditional>
              <Title sidebarType={type}>{title}</Title>
              {hasBack && type !== SIDEBAR_TYPES.CONTACT_US_PANEL ? (
                <BackIcon
                  // @ts-expect-error TS(2769): No overload matches this call.
                  onClick={type === SIDEBAR_TYPES.PRODUCT_CARD ? null : onClose}
                >
                  {BackArrow}
                </BackIcon>
              ) : (
                <CloseIcon
                  className={'close-icon'}
                  /* @ts-expect-error TS(2769): No overload matches this call. */
                  onClick={
                    [
                      SIDEBAR_TYPES.SIDE_NAV,
                      SIDEBAR_TYPES.CONTACT_US_PANEL,
                    ].includes(type)
                      ? onCloseAll
                      : onClose
                  }
                  sidebarType={type}
                >
                  {type === SIDEBAR_TYPES.SIDE_NAV && !isMobile
                    ? DOUBLE_CHEVRON
                    : CLOSE_WHITE}
                </CloseIcon>
              )}
            </Header>
            <ModalContent
              /* @ts-expect-error TS(2769): No overload matches this call. */
              windowHeight={windowHeight}
              sidebarType={type}
              ref={scrollRef}
              onScroll={throttledScrollHandler}
              id="side-container-index"
            >
              {children}
            </ModalContent>
          </StyledAsideModal>
        </>,
        container.current
      )
    : null;
};
export default AsideModal;
