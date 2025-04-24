import { css } from '@headout/pixie/css';
import LoaderFallback from 'assets/loaderFallback';
import SvgAnimatedLoader from 'assets/svgAnimatedLoader';

const loaderWrapperStyles = (isClosing?: boolean) =>
  css({
    width: '100vw',
    height: '100dvh',
    textAlign: 'center',
    position: 'fixed',
    zIndex: '1001',
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'core.primary.white',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: isClosing ? '0' : '1',
    transition: 'opacity 200ms cubic-bezier(.42, 0, .58, 1)',
  });

export const rotateSvgPageLoaderGroup = {
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
};

export const rotateSvgPageLoaderDashOffset = {
  '0%': {
    strokeDashoffset: '270',
  },
  '100%': {
    strokeDashoffset: '-210',
  },
};

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
