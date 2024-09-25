import { css, cx } from '@headout/pixie/css';

export const GradientCircle = ({ className = '' }) => (
  <div
    className={cx(
      css({
        position: 'absolute',
        zIndex: -1,
        transition: 'transform 0.3s',
        width: '5rem',
        height: '5rem',
        filter: 'blur(40px)',
        opacity: 0.15,

        borderRadius: '50%',

        '@media (max-width: 768px)': {
          width: '4rem',
          height: '4rem',
        },
      }),
      className
    )}
  ></div>
);
