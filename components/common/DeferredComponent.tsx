import { PropsWithChildren, useState } from 'react';
import useTimeout from 'hooks/useTimeout';

const DeferredComponent = ({
  children,
  delay = 1_000,
}: PropsWithChildren<{
  delay?: number;
}>) => {
  const [isReady, setReady] = useState(false);
  useTimeout(() => {
    setReady(true);
  }, delay);

  if (isReady) return <>{children}</>;
  return null;
};

export default DeferredComponent;
