import { css } from '@headout/pixie/css';
import LoaderFallback from 'assets/loaderFallback';
import SvgAnimatedLoader from 'assets/svgAnimatedLoader';

const loaderWrapperStyles = (isClosing?: boolean) =>
  css({
    width: '100vw',
    height: '100vh',
    textAlign: 'center',
    position: 'fixed',
    zIndex: '1010000', // select screen bottom bar is 1000
    top: 0,
    left: 0,
    backgroundColor: 'white',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: isClosing ? '0' : '1',
    transition: 'opacity 200ms cubic-bezier(.42, 0, .58, 1)',
  });

export const SvgLoader = ({
  isClosing,
  onClose,
}: {
  isClosing?: boolean;
  onClose?: () => void;
}) => (
  <div className={loaderWrapperStyles(isClosing)} onTransitionEnd={onClose}>
    <LoaderFallback isClosing={isClosing} />
    <SvgAnimatedLoader />
  </div>
);
