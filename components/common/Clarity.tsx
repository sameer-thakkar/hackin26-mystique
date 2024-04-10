import { useEffect } from 'react';
import jsCookie from 'js-cookie';
import { initClarity } from 'utils/clarityUtils';
import { isProduction } from 'utils/gen';
import { COOKIE } from 'const/index';

interface IClarityProps {
  host: string;
}

const CLARITY_PROJECT_ID_1 = 'bkr8q7wx0t'; // Headout Production 1
const CLARITY_PROJECT_ID_2 = 'bkra4tjmu8'; // Headout Production 2

const Clarity = ({ host }: IClarityProps) => {
  useEffect(() => {
    const fallbackProjectId =
      Math.random() < 0.5 ? CLARITY_PROJECT_ID_1 : CLARITY_PROJECT_ID_2;
    const projectId =
      jsCookie.get(COOKIE.CLARITY_PROJECT_ID) || fallbackProjectId;
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
  }, [host]);

  return null;
};

export default Clarity;
