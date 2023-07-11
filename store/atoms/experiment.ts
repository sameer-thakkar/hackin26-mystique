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
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        experimentName: EXPERIMENT_NAMES[key],
        activeVariant: null,
        ready: false,
      },
    }),
    {}
  ) as Experiments,
});
