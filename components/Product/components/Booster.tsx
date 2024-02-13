import { useEffect, useRef, useState } from 'react';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS } from 'const/index';
import { strings } from 'const/strings';
import { Diamond, Spark } from 'assets/boosters';
import { BoosterType, TBoosterProps } from '../interface';
import { BoosterContainer, BoosterText } from '../styles';

const BOOSTER_INFO = {
  [BoosterType.BESTSELLER]: {
    title: strings.HOHO.BESTSELLER,
    icon: <Diamond />,
    theme: '#6321AE',
    transform: 'translate(-68%,-10%)',
    borderTheme:
      'linear-gradient(90deg, #B283E7 -3.09%, rgba(178, 131, 231, 0.7) 100%)',
    iconHeight: 32,
    mobileLeft: 32,
  },
  [BoosterType.SELLING_OUT_FAST]: {
    title: strings.LTT_SHOW_PAGE.SELLING_OUT_FAST,
    icon: <Spark />,
    theme: '#CE007C',
    transform: 'translate(-64%,-11%)',
    borderTheme:
      'linear-gradient(90deg, #fdb0d5 0%, rgba(253, 176, 213, 0.7) 100%)',
    iconHeight: 35,
    mobileLeft: 28,
  },
};

const Booster = ({ type, rank, isOverlay = false }: TBoosterProps) => {
  const { icon, title, theme, transform, borderTheme, iconHeight, mobileLeft } =
    BOOSTER_INFO[type];

  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen({ ref, unobserve: true });
  const [eventRecorded, setEventRecorded] = useState(false);

  useEffect(() => {
    if (eventRecorded || !isOnScreen) return;
    trackEvent({
      eventName: ANALYTICS_EVENTS.BOOSTERS.VIEWED,
      Type: type,
      ...(rank && { Rank: rank }),
    });
    setEventRecorded(true);
  }, [isOnScreen, eventRecorded]);

  return (
    <BoosterContainer $mobileLeft={mobileLeft} $isOverlay={isOverlay} ref={ref}>
      <BoosterText
        className="block"
        $theme={theme}
        $transform={transform}
        $borderTheme={borderTheme}
        $iconHeight={iconHeight}
      >
        {icon}
        {title}
      </BoosterText>
    </BoosterContainer>
  );
};

export default Booster;
