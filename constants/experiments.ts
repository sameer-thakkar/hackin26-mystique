import Experiment from 'utils/experiments/experiment';

export const VARIANTS = {
  HIDE_AUDIO_GUIDE: 'HIDE',
  SHOW_AUDIO_GUIDE: 'SHOW',
};

export const EXPERIMENT_NAMES = {
  AUDIO_GUIDE_EXPERIMENT: 'AUDIO_GUIDE_EXPERIMENT',
};

export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.AUDIO_GUIDE_EXPERIMENT]: new Experiment(
    'Vox Audioguide Experiment',
    [VARIANTS.HIDE_AUDIO_GUIDE, VARIANTS.SHOW_AUDIO_GUIDE],
    [50, 50]
  ),
};
