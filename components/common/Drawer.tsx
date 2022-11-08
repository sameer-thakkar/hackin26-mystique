import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import { CloseIcon } from 'assets/SvgIcons';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

const DrawerContainer = styled.div`
  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 72px);
  display: grid;

  .shadow {
    position: fixed;
    height: calc(100% - 56px);
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: rgba(0, 0, 0, 0.5);
    animation: fade 0.4s ease;
  }

  ${({ $drawerStyles }) => $drawerStyles}

  @keyframes fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @media (min-width: 768px) {
    .shadow {
      height: calc(100% - 80px);
    }
  }
`;

const DrawerWrapper = styled.div`
  background: ${COLORS.BRAND.WHITE};
  border-radius: 20px 20px 0px 0px;
  padding: ${({ $noMargin }) => ($noMargin ? 'unset' : '0 24px')};
  box-shadow: 0px -2px 12px rgba(84, 84, 84, 0.1);
  display: grid;
  margin-top: auto;
  grid-row-gap: ${({ $hasHeading }) => ($hasHeading ? '24px' : '0')};
  z-index: 1000;
  height: 100%;
  align-content: flex-start;
  animation: enter 0.4s ease;

  @keyframes enter {
    from {
      transform: translateY(72vh);
    }

    to {
      transform: translateY(0);
    }
  }

  @media (min-width: 768px) {
    position: relative;
    border-radius: 12px;
    margin-top: unset;
    align-self: center;
    justify-self: center;
    height: auto;
    min-width: 432px;
  }
`;

const CoreDrawerText = styled.div`
  .content-wrapper {
    display: grid;
    grid-row-gap: 2.4rem;
  }
  span,
  p {
    color: ${COLORS.BRAND.BLACK};
    b {
      font-weight: 500;
    }
  }
`;

const Separator = styled.div`
  border-top: 1px solid ${COLORS.GRAY.G6};
`;

const HeadingContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ $hasHeading }) =>
    $hasHeading ? '1fr 1.6rem' : '1fr'};
  grid-row-gap: 1.2rem;
  align-items: center;
  ${Separator} {
    grid-column: 1 / 3;
  }
  .close-icon {
    grid-column: 2 / 3;
    grid-row: 1;
  }
`;

const PanelAnchor = styled.div`
  display: inline-block;
  height: 4px;
  width: 32px;
  background-color: ${COLORS.GRAY.G6};
  border-radius: 100px;
  justify-self: center;
  margin: 8px 0;

  @media (min-width: 768px) {
    display: none;
  }
`;

const HeadingText = styled.div`
  grid-column: 1 / 2;
  ${expandFontToken(FONTS.HEADING_SMALL)}
`;

const Drawer = ({
  closeHandler,
  contents,
  className,
  heading,
  children,
  noMargin = false,
  $drawerStyles,
  container = null,
}: {
  closeHandler?: Function;
  contents?: JSX.Element;
  className?: string;
  heading?: string;
  children?: JSX.Element | Array<JSX.Element>;
  noMargin?: boolean;
  $drawerStyles?: any;
  container?: HTMLElement;
}) => {
  useEffect(() => {
    document.body.classList.add('scroll-lock', 'no-shadow');

    return () => {
      document.body.classList.remove('scroll-lock', 'no-shadow');
    };
  }, []);

  if (typeof window === 'undefined') return null;

  return ReactDOM.createPortal(
    <DrawerContainer $drawerStyles={$drawerStyles} $noMargin={noMargin}>
      <div
        className="shadow"
        role="button"
        tabIndex={0}
        onClick={() => closeHandler('Outside')}
      />
      <DrawerWrapper
        $hasHeading={heading?.length}
        className={`${className || ''}`}
        $noMargin={noMargin}
      >
        <HeadingContainer $hasHeading={heading?.length}>
          <PanelAnchor />
          <Conditional if={heading}>
            <HeadingText>{heading}</HeadingText>
            <Separator />
          </Conditional>
          <CloseIcon
            onClick={() => closeHandler('Close Icon')}
            className="close-icon"
          />
        </HeadingContainer>
        <CoreDrawerText>{contents || children}</CoreDrawerText>
      </DrawerWrapper>
    </DrawerContainer>,
    container ?? document.body
  );
};

export default Drawer;
