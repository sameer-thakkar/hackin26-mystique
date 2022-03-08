import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { CLOSE_WHITE, BackArrow } from 'assets/SvgIcons';
import { useState, useEffect } from 'react';
import { SOLEIL, COLORS } from 'const/ui-constants';
import { SIDEBAR_TYPES } from 'const/index';
import useWindowSize from 'hooks/useWindowSize';
import { pxToRem } from 'utils/cssUtils';
import { strings } from 'const/strings';

export const StyledAsideModal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  overflow-y: scroll;
  scroll-behavior: smooth;
  padding: 1.25rem
    ${({ sidePadding }) => (sidePadding ? pxToRem(sidePadding) : '1.5')}rem;
  padding-top: 0;
  max-width: calc(
    ${({ width }) =>
        width ? (90 * pxToRem(parseFloat(width))) / 6.25 : '37.875'}rem - 3rem
  );
  width: calc(
    ${({ width, sidePadding }) =>
      `${width ? pxToRem(width) : '27.5vw'} - ${
        pxToRem(sidePadding) ? pxToRem(sidePadding) * 2 : '3'
      }rem`}
  );
  background: ${COLORS.WHITE};
  z-index: 100;
  @media (max-width: 768px) {
    position: absolute;
    height: 100vh;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    max-width: unset;
    width: unset;
    ${({ sidebarType }) =>
      sidebarType === SIDEBAR_TYPES.PRODUCT_CARD
        ? `
      height: auto;
      padding: 0;
      background: unset;
      top: 0;
      bottom: 0;
      overflow-y: unset;
      max-width: unset;
    `
        : sidebarType === SIDEBAR_TYPES.COMBO_VARIANT
        ? `
      height: auto;
      padding: 0;
      background: ${COLORS.BLACK};
    `
        : ``}
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  padding-top: 1.25rem;
  padding-bottom: 1.5rem;
  position: ${({ type }) =>
    type === SIDEBAR_TYPES.PRODUCT_CARD ? 'unset' : 'sticky'};
  ${({ type }) =>
    type === SIDEBAR_TYPES.PRODUCT_CARD
      ? `
      width: calc(100% - 2rem);
      padding: 0 1rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      .close-icon {
        display: flex;
        padding: 0.375rem;
        border-radius: 100%;
        background: ${COLORS.WHITE};
        svg {
          height: 0.625rem;
          width: 0.625rem;
        }
      }
    `
      : ''}
  top: 0;

  background: ${({ addBg, isGlobalMb }) =>
    addBg ? COLORS.WHITE : isGlobalMb ? COLORS.WHITE : 'transparent'};
  z-index: 12;

  ${({ type }) =>
    type === SIDEBAR_TYPES.COMBO_VARIANT
      ? `
      width: calc(100% - 2rem);
      background: ${COLORS.WHITE};
      margin-top: 0.5rem;
      padding: 2rem 1rem 0.5rem 1rem;
      border-radius: 1.25rem 1.25rem 0 0;
      .close-icon {
        display: flex;
        padding: 0.375rem;
        background: ${COLORS.GREY.G8};
        border-radius: 0.25rem;
        svg {
          height: 0.625rem;
          width: 0.625rem;
        }
      }`
      : ''}
  @media (max-width: 768px) {
    &:before,
    &:after {
      ${({ addBg }) => (addBg ? `content: '';` : '')};
      display: block;
      width: 1.5rem;
      position: absolute;
      height: 100%;
      background: ${COLORS.WHITE};
    }
    &::before {
      left: 100%;
    }
    &::after {
      right: 100%;
    }
  }
`;

const CloseIcon = styled.div`
  justify-self: right;
  grid-column: 2 / 2;
  cursor: pointer;
  path {
    stroke: #545454;
    stroke-width: 0.113rem;
  }
  z-index: 999;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 0.875rem;
  line-height: 1.25rem;
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
  ${({ sidebarType, windowHeight }) =>
    sidebarType === SIDEBAR_TYPES.PRODUCT_CARD
      ? `
overflow-x: scroll;
height: ${pxToRem(windowHeight) - 2.875}rem;
border-radius: 0.625rem 0.625rem 0 0;
`
      : sidebarType === SIDEBAR_TYPES.COMBO_VARIANT
      ? `
overflow-x: scroll;
height: ${pxToRem(windowHeight) - 2.875}rem;`
      : ``}
`;

const MobileHeading = styled.div`
  grid-column: 1 / 2;
  font-family: ${SOLEIL.FONT_STACK};
  font-style: normal;
  font-weight: 600;
  font-size: 0.875rem;
`;

const HorizontalLine = styled.hr`
  grid-column: 1 / span 2;
  color: ${COLORS.GREY.G6};
  margin: 0.625rem 0rem;
`;

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
}) => {
  const [container, setContainer] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = isGlobalMb ? windowWidth <= 768 : windowWidth < 768;
  const hasBack = stack.length > 1;

  useEffect(() => {
    const container = window.document.body;
    if (isMobile) {
      setScrollY(window.scrollY);
      // Saving scroll and hiding body is required for iOS compatability,
      // fixed elements break, they move from their position after partial scroll (browser hides its header)
      // to avoid this we removed position: fixed, and let the sidebar live in regular scroll flow.
      window.scrollTo(0, 0);
    }
    if (active) container.classList.add('scroll-lock');
    setContainer(container);
  }, [active, isMobile]);

  const onClose = (e) => {
    e.stopPropagation();
    container.classList.remove('scroll-lock');
    if (isMobile) window.scrollTo(0, scrollY);
    closeModal();
    if (onCloseCallback) onCloseCallback();
  };

  const onCloseAll = () => {
    container.classList.remove('scroll-lock');
    if (isMobile) window.scrollTo(0, scrollY);
    resetAside();
  };

  return container && active
    ? createPortal(
        <>
          <Mask onClick={onCloseAll} />
          <StyledAsideModal
            windowHeight={windowHeight}
            sidebarType={type}
            width={width}
            sidePadding={sidePadding}
          >
            <Header
              onClick={type === SIDEBAR_TYPES.PRODUCT_CARD ? onClose : null}
              addBg={!!title || isMobile}
              type={type}
              sidePadding={sidePadding}
              isGlobalMb={isGlobalMb}
            >
              <Title>{title}</Title>
              {hasBack ? (
                <BackIcon
                  onClick={type === SIDEBAR_TYPES.PRODUCT_CARD ? null : onClose}
                >
                  {BackArrow}
                </BackIcon>
              ) : (
                <>
                  {isMobile ? (
                    <>
                      <MobileHeading>
                        {strings.SAFE_EXPERIENCE_NEW.MODAL.HEADING}
                      </MobileHeading>
                      <CloseIcon className={'close-icon'} onClick={onClose}>
                        {CLOSE_WHITE}
                      </CloseIcon>
                      <HorizontalLine />
                    </>
                  ) : (
                    <CloseIcon className={'close-icon'} onClick={onClose}>
                      {CLOSE_WHITE}
                    </CloseIcon>
                  )}
                </>
              )}
            </Header>
            <ModalContent windowHeight={windowHeight} sidebarType={type}>
              {children}
            </ModalContent>
          </StyledAsideModal>
        </>,
        container
      )
    : null;
};

export default AsideModal;
