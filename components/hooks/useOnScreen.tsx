import React, { useEffect } from 'react';

interface OptionsTypes {
  root?: Element;
  rootMargin?: string;
  threshold: number;
}

export default function useOnScreen({
  ref,
  options,
}: {
  ref: React.MutableRefObject<any>;
  options?: OptionsTypes;
}) {
  const [isIntersecting, setIntersecting] = React.useState(false);
  let observer: IntersectionObserver;

  if (typeof window !== 'undefined') {
    observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);
  }

  useEffect(() => {
    if (ref?.current && observer) observer.observe(ref.current);

    return () => {
      observer?.disconnect();
    };
  // @ts-expect-error TS(2454): Variable 'observer' is used before being assigned.
  }, [observer, ref]);

  return isIntersecting;
}
