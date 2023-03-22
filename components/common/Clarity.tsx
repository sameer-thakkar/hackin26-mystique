import { useEffect } from 'react';
import { initClarity, isClarityRequired } from 'utils/clarityUtils';
interface IClarityProps {
  host: string;
}

const Clarity = ({ host }: IClarityProps) => {
  useEffect(() => {
    if (isClarityRequired(host)) {
      setTimeout(() => {
        initClarity(host);
      }, 2000);
    }
  }, [host]);

  return null;
};

export default Clarity;
