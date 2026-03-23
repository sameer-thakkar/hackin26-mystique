import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { trackEvent } from 'utils/analytics';
import { appAtom } from 'store/atoms/app';
import { metaAtom } from 'store/atoms/meta';
import { EXPERIMENT_NAMES } from 'const/experiments';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PLATFORM,
  ANALYTICS_PROPERTIES,
} from 'const/index';

const UKExtraChargeExperimentTracker = ({ variant }: { variant: string }) => {
  const pageMetaData = useRecoilValue(metaAtom);
  const { host, isMobile } = useRecoilValue(appAtom);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIMENT_VIEWED,
      [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]:
        EXPERIMENT_NAMES.UK_EXTRA_CHARGE_EXPERIMENT,
      [ANALYTICS_PROPERTIES.EXPERIMENT_VARIANT]: variant,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.MB_NAME]: host,
      [ANALYTICS_PROPERTIES.PLATFORM_NAME]: isMobile
        ? ANALYTICS_PLATFORM.MOBILE
        : ANALYTICS_PLATFORM.DESKTOP,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default UKExtraChargeExperimentTracker;
