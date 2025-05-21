import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { docCookies } from 'utils/helper';
import { experimentsAtom } from 'store/atoms/experiments';

const EXPERIMENT_GROUP_COOKIE_KEY_PREFIX = 'statsig_';

export const useGetAndSetExperiments = () => {
  const set = useSetRecoilState(experimentsAtom);

  useEffect(() => {
    try {
      // get all cookies starting with EXPERIMENT_GROUP_COOKIE_KEY_PREFIX
      const expGroupCookies = docCookies
        .keys()
        .filter((key) => key.startsWith(EXPERIMENT_GROUP_COOKIE_KEY_PREFIX));
      const expGroup = expGroupCookies.reduce(
        (acc: Record<string, string>, key) => {
          acc[key.replace(EXPERIMENT_GROUP_COOKIE_KEY_PREFIX, '')] =
            docCookies.getItem(key) || '';
          return acc;
        },
        {}
      );

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
