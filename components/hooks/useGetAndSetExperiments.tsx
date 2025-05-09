import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { docCookies } from 'utils/helper';
import { experimentsAtom } from 'store/atoms/experiments';
import { EXPERIMENT_GROUP_COOKIE_KEY } from 'const/index';

export const useGetAndSetExperiments = () => {
  const set = useSetRecoilState(experimentsAtom);

  useEffect(() => {
    try {
      const expGroupCookies = docCookies.getItem(EXPERIMENT_GROUP_COOKIE_KEY);
      const expGroup = JSON.parse(expGroupCookies || '{}');

      set({
        expGroup,
        isExpGroupLoading: false,
      });
    } catch (e: unknown) {
      set({
        expGroup: {},
        isExpGroupLoading: false,
      });
    }
  }, [set]);
};
