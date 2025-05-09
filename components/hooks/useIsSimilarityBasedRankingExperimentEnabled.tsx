import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { trackEvent } from 'utils/analytics';
import { experimentsAtom } from 'store/atoms/experiments';
import { EXPERIMENT_NAMES } from 'const/experiments';
import { ANALYTICS_EVENTS, RANKING_EXPERIMENT_UUIDS } from 'const/index';

type TUseIsSimilarityBasedRankingExperimentEnabledProps = {
  noTrack?: boolean;
  eventProperties?: Record<string, any>;
  uid?: string;
};

const OVERRIDE_VARIANT_QUERY_PARAM = 'ranking';

export const useIsSimilarityBasedRankingExperimentEnabled = ({
  noTrack = false,
  eventProperties = {},
  uid = '',
}: TUseIsSimilarityBasedRankingExperimentEnabledProps = {}) => {
  const { expGroup, isExpGroupLoading } = useRecoilValue(experimentsAtom);
  const shouldTrack = useRef(!noTrack);
  const isEligible = RANKING_EXPERIMENT_UUIDS.includes(uid);
  const { query } = useRouter();

  const overrideVariant = query[OVERRIDE_VARIANT_QUERY_PARAM];

  const experimentVariant =
    overrideVariant ??
    expGroup[EXPERIMENT_NAMES.SIMILARITY_BASED_RANKING_EXPERIMENT_V2];

  useEffect(() => {
    if (
      shouldTrack.current &&
      !isExpGroupLoading &&
      Object.keys(expGroup).length &&
      isEligible &&
      experimentVariant
    ) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.EXPERIMENT_VIEWED,
        'Experiment Name':
          EXPERIMENT_NAMES.SIMILARITY_BASED_RANKING_EXPERIMENT_V2,
        'Experiment Variant': experimentVariant,
        ...eventProperties,
      });
      shouldTrack.current = false;
    }
  }, [
    eventProperties,
    experimentVariant,
    noTrack,
    isExpGroupLoading,
    isEligible,
    expGroup,
  ]);

  return {
    isEligible,
    isExpGroupLoading,
    variant: experimentVariant,
  };
};
