import { useRef } from 'react';
import { Transition } from 'react-transition-group';

const defaultAnimationDuration = 300;

const transitionStyles = {
  entering: {
    transform: 'translateX(0%)',
    opacity: 1,
  },
  entered: { transform: 'translateX(0%)', opacity: 1 },
  exiting: { opacity: 1, transform: 'translateX(100%)' },
  exited: { opacity: 1, transform: 'translateX(100%)' },
};

interface SlideInAnimateProps {
  in: boolean;
  children: React.ReactNode;
  WrapperComponent?: React.ElementType;
  animateDurationInMS?: number;
  noAnimateOnExit?: boolean;
  wrapperQAMarker?: string;
  additionalStyles?: React.CSSProperties;
  enterTransitionDelayString?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function SlideInAnimate({
  in: inProp,
  children,
  WrapperComponent = 'div',
  animateDurationInMS = defaultAnimationDuration,
  noAnimateOnExit = false,
  wrapperQAMarker,
  additionalStyles,
  className,
}: SlideInAnimateProps) {
  const nodeRef = useRef(null);

  return (
    <Transition
      nodeRef={nodeRef}
      in={inProp}
      timeout={animateDurationInMS}
      exit={false}
      unmountOnExit
    >
      {(state) => (
        <WrapperComponent
          data-qa-marker={wrapperQAMarker}
          ref={nodeRef}
          className={className}
          style={{
            ...additionalStyles,
            transitionDelay: '100ms',
            transition: noAnimateOnExit
              ? ''
              : `transform 300ms cubic-bezier(0.3, 1, 0.7, 1), opacity 300ms cubic-bezier(0.3, 1, 0.7, 1)`,
            ...transitionStyles[state as keyof typeof transitionStyles],
          }}
        >
          {children}
        </WrapperComponent>
      )}
    </Transition>
  );
}
