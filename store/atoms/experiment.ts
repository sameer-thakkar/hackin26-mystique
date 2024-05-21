import { atom } from 'recoil';
import { EXPERIMENT_NAMES } from 'const/experiments';

type ExperimentKeys = keyof typeof EXPERIMENT_NAMES;

type Experiments = {
  [K in ExperimentKeys]: {
    activeVariant: string;
    experimentName: string;
    ready: boolean;
  };
};

export const experimentsAtom = atom({
  key: 'experiment',
  default: Object.keys(EXPERIMENT_NAMES ?? {}).reduce(
    (acc, key) => ({
      ...acc,
      [key]: {
        experimentName: EXPERIMENT_NAMES[key],
        activeVariant: null,
        ready: false,
      },
    }),
    {}
  ) as Experiments,
});
