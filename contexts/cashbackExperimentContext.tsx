import { createContext, useEffect, useState } from 'react';
import { EXPERIMENT_NAMES } from 'const/experiments';
import { getABTestingVariant } from 'utils/experiments/experimentUtils';
import { hsidAtom } from 'store/atoms/hsid';
import { useRecoilState } from 'recoil';

export const CashbackExperimentContext = createContext({
  variant: '',
  triggerExperiment: () => {},
});

interface CashbackExperimentContextProviderProps {
  children: any;
}

const CashbackExperimentContextProvider = ({
  children,
}: CashbackExperimentContextProviderProps) => {
  const [variant, setVariant] = useState<string>('');
  const [track, setTrack] = useState<boolean>(false);
  const hsid = useRecoilState(hsidAtom);

  useEffect(() => {
    if (track) {
      setVariant(
        getABTestingVariant(EXPERIMENT_NAMES.REVAMPED_CASHBACK_EXPERIMENT, hsid)
      );
    }
  }, [track]);

  const triggerExperiment = () => {
    setTrack(true);
  };
  return (
    <CashbackExperimentContext.Provider value={{ variant, triggerExperiment }}>
      {children}
    </CashbackExperimentContext.Provider>
  );
};

export default CashbackExperimentContextProvider;
