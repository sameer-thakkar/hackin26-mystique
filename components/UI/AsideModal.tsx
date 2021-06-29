import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { CLOSE_WHITE, BackArrow } from 'assets/SvgIcons';
import { useState, useEffect } from 'react';
import { COLORS } from 'const/ui-constants';
import { SIDEBAR_TYPES } from 'const/index';
import useWindowSize from 'hooks/useWindowSize';

const StyledAsideModal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  overflow-y: scroll;
  padding: 20px ${({ sidePadding }) => (sidePadding ? sidePadding : '24')}px;
  padding-top: 0;
  max-width: calc(
    ${({ width }) => (width ? (1440 * parseFloat(width)) / 100 : '606')}px -
      48px
  );
  width: calc(
    ${({ width, sidePadding }) =>
      `${width ? width : '27.5vw'} - ${sidePadding ? sidePadding * 2 : '48'}px`}
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
      overflow-y: unset;
      max-width: unset;
    `
        : ``}
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  padding-top: 20px;
  padding-bottom: 24px;
  position: ${({ type }) =>
    type === SIDEBAR_TYPES.PRODUCT_CARD ? 'unset' : 'sticky'};
  ${({ type }) =>
    type === SIDEBAR_TYPES.PRODUCT_CARD
      ? `
      width: calc(100% - 32px);
      padding: 0 16px;
      padding-top: 12px;
      padding-bottom: 12px;
      .close-icon {
        display: flex;
        padding: 6px;
        border-radius: 100%;
        background: ${COLORS.WHITE};
        svg {
          height: 10px;
          width: 10px;
        }
      }
    `
      : ''}
  top: 0;
  background: ${({ addBg, isGlobalMb }) =>
    addBg ? COLORS.WHITE : isGlobalMb ? COLORS.WHITE : 'transparent'};
  z-index: 12;
  @media (max-width: 768px) {
    &:before,
    &:after {
      ${({ addBg }) => (addBg ? `content: '';` : '')};
      display: block;
      width: 24px;
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
  cursor: pointer;
  path {
    stroke: #545454;
    stroke-width: 1.8px;
  }
  z-index: 999;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
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
  height: ${windowHeight - 46}px;
  border-radius: 10px 10px 0 0;
  `
      : ``}
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

  const onClose = () => {
    container.classList.remove('scroll-lock');
    if (isMobile) window.scrollTo(0, scrollY);
    closeModal();
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
              addBg={!!title}
              type={type}
              sidePadding={sidePadding}
              isGlobalMb={isGlobalMb}
            >
              <Title>{title}</Title>
              {hasBack ? (
                <BackIcon onClick={onClose}>{BackArrow}</BackIcon>
              ) : (
                <CloseIcon className={'close-icon'} onClick={onClose}>
                  {CLOSE_WHITE}
                </CloseIcon>
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
