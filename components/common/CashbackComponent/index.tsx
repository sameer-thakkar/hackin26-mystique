import dynamic from 'next/dynamic';
import { CashbackComponentPropTypes } from 'components/common/CashbackComponent/interface';
import {
  CashbackLabel,
  CashbackWrapper,
} from 'components/common/CashbackComponent/styles';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { CASHBACK_COIN, INFO_ICON_WRAPPED } from 'assets/SvgIcons';

const Tooltip = dynamic(() => import('components/common/Tooltip/index'), {
  ssr: false,
});

const CashbackComponent = ({
  cashbackAmount,
  isSportsExperiment,
  id,
}: CashbackComponentPropTypes) => {
  const trackHover = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.TOOLTIP_VIEWED,
      [ANALYTICS_PROPERTIES.TOOLTIP_TYPE]: 'cashback',
      [ANALYTICS_PROPERTIES.TGID]: id,
    });
  };

  if (!cashbackAmount) return null;

  return (
    <CashbackWrapper isSportsExperiment={isSportsExperiment}>
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
