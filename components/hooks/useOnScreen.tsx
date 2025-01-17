import React, { useEffect } from 'react';

export interface OptionsTypes {
  root?: Element;
  rootMargin?: string;
  threshold: number;
}

export default function useOnScreen({
  ref,
  unobserve,
  options,
}: {
  ref: React.MutableRefObject<any>;
  unobserve?: boolean;
  options?: OptionsTypes;
}) {
  const [isIntersecting, setIntersecting] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && unobserve) {
        observer?.disconnect();
      }
    }, options);
    if (ref?.current && observer) observer.observe(ref.current);

    return () => {
      observer?.disconnect();
    };
  }, [unobserve, options, ref]);

  return isIntersecting;
}
