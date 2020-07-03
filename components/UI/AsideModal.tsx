import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { CLOSE_WHITE, BackArrow } from 'assets/SvgIcons';
import { useState, useEffect } from 'react';
import { COLORS } from 'constants/ui-constants';

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
    max-width: unset;
    width: unset;
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  position: sticky;
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
}) => {
  const [container, setContainer] = useState(null);
  const hasBack = stack.length > 1;

  useEffect(() => {
    const container = window.document.body;
    if (active) container.classList.add('scroll-lock');
    setContainer(container);
  }, [active]);

  const onClose = () => {
    container.classList.remove('scroll-lock');
    closeModal();
  };

  const onCloseAll = () => {
    container.classList.remove('scroll-lock');
    resetAside();
  };

  return container && active
    ? createPortal(
        <>
          <Mask onClick={onCloseAll} />
          <StyledAsideModal width={width} sidePadding={sidePadding}>
            <Header addBg={!!title}>
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
