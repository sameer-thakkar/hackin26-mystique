import { useEffect } from 'react';
import { initClarity } from 'utils/clarityUtils';
import { isProduction } from 'utils/gen';

interface IClarityProps {
  host: string;
  projectId: string;
}

const Clarity = ({ host, projectId }: IClarityProps) => {
  useEffect(() => {
    try {
      if (!isProduction()) return;
      const timer = setTimeout(() => {
        initClarity({ host, projectId });
      }, 2000);

      return () => {
        if (!isProduction()) return;
        clearTimeout(timer);
      };
    } catch (e) {
      //
    }
  }, [host, projectId]);

  return null;
};

export default Clarity;
