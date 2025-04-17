import { useRecoilValue } from 'recoil';
import { experimentsAtom } from 'store/atoms/experiments';
import { EXPERIMENT_NAMES, VARIANTS } from 'const/experiments';

export const useIsMBAaTestEnabled = () => {
  const { expGroup, isExpGroupLoading } = useRecoilValue(experimentsAtom);
  return {
    isEnabled: expGroup[EXPERIMENT_NAMES.MB_AA_TEST] === VARIANTS.TREATMENT,
    isExpGroupLoading,
  };
};
