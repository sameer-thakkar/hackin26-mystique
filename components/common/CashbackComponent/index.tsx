import {
  CashbackLabel,
  CashbackWrapper,
} from 'components/common/CashbackComponent/styles';
import { CashbackComponentPropTypes } from 'components/common/CashbackComponent/interface';
import { CASHBACK_COIN, INFO_ICON_WRAPPED } from 'assets/SvgIcons';
import { EXPERIMENT_NAMES } from 'const/experiments';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import useOnScreen from 'hooks/useOnScreen';
import { useEffect, useRef, useState } from 'react';
import { trackEvent } from 'utils/analytics';
import { strings } from 'const/strings';
import Tooltip from 'components/common/Tooltip/index';

const CashbackComponent = ({
  cashbackAmount,
  isSportsExperiment,
  id,
}: CashbackComponentPropTypes) => {
  const cashbackRef = useRef(null);

  const [isVisibilityTracked, setIsVisibilityTracked] = useState(false);

  const isOnScreen = useOnScreen({
    ref: cashbackRef,
  });

  const trackHover = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.TOOLTIP_VIEWED,
      [ANALYTICS_PROPERTIES.TOOLTIP_TYPE]: 'cashback',
      [ANALYTICS_PROPERTIES.TGID]: id,
    });
  };

  useEffect(() => {
    if (!isSportsExperiment && !isVisibilityTracked && isOnScreen) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.EXP_COMPONENT_LOADED,
        [ANALYTICS_PROPERTIES.EXPERIMENT_NAME]:
          EXPERIMENT_NAMES.REVAMPED_CASHBACK_EXPERIMENT,
        [ANALYTICS_PROPERTIES.COMPONENT_NAME]: 'Cashback Element',
      });
      setIsVisibilityTracked(true);
    }
  }, [isOnScreen]);

  if (!cashbackAmount) return null;

  return (
    <CashbackWrapper ref={cashbackRef} isSportsExperiment={isSportsExperiment}>
      <CASHBACK_COIN />
      <CashbackLabel>
        {strings.formatString(strings.GET_CASHBACK, `${cashbackAmount}`)}
        {!isSportsExperiment && (
          <Tooltip
            trigger={INFO_ICON_WRAPPED}
            onHover={trackHover}
            content={`${strings.formatString(
              strings.CASHBACK_INFO,
              cashbackAmount
            )}`}
          />
        )}
      </CashbackLabel>
    </CashbackWrapper>
  );
};

export default CashbackComponent;
