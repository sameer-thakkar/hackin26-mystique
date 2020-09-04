import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { CLOSE_WHITE, BackArrow } from 'assets/SvgIcons';
import { useState, useEffect } from 'react';
import { COLORS } from 'constants/ui-constants';
import { SIDEBAR_TYPES } from 'constants/index';
import { useWindowWidth } from '@react-hook/window-size';

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
    position: unset; // Check global css to find respective styles.
    height: auto;
    overflow-y: unset;
    max-width: unset;
    width: unset;
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  position: ${({ type }) =>
    type === SIDEBAR_TYPES.FIXED ? 'fixed' : 'sticky'};
  ${({ type, sidePadding }) =>
    type === SIDEBAR_TYPES.FIXED
      ? `
      width: calc(100% - ${(sidePadding || 24) * 2}px);
    `
      : ''};
  top: 0;
  background: ${({ addBg }) => (addBg ? COLORS.WHITE : 'transparent')};
  padding-top: 20px;
  padding-bottom: 24px;
  z-index: 2;
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
    stroke-width: 1.5px;
  }
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
}) => {
  const [container, setContainer] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
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
          <StyledAsideModal width={width} sidePadding={sidePadding}>
            <Header addBg={!!title} type={type} sidePadding={sidePadding}>
              <Title>{title}</Title>
              {hasBack ? (
                <BackIcon onClick={onClose}>{BackArrow}</BackIcon>
              ) : (
                <CloseIcon onClick={onClose}>{CLOSE_WHITE}</CloseIcon>
              )}
            </Header>
            {children}
          </StyledAsideModal>
        </>,
        container
      )
    : null;
};

export default AsideModal;
