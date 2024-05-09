import { PropsWithChildren, ReactNode, useState } from 'react';
import useTimeout from 'hooks/useTimeout';

const DeferredComponent = ({
  children,
  delay = 1_000,
  renderPlaceholder,
}: PropsWithChildren<{
  delay?: number;
  renderPlaceholder?: ReactNode;
}>) => {
  const [isReady, setReady] = useState(false);
  useTimeout(() => {
    setReady(true);
  }, delay);

  if (isReady) return <>{children}</>;
  return <>{renderPlaceholder || null}</>;
};

export default DeferredComponent;
