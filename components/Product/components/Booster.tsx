import { useEffect, useRef, useState } from 'react';
import Conditional from 'components/common/Conditional';
import useOnScreen from 'hooks/useOnScreen';
import { useRive } from 'hooks/useRive';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, BOOSTER_RIVE_LOCATION } from 'const/index';
import { strings } from 'const/strings';
import { Diamond, Spark } from 'assets/boosters';
import { BoosterType, TBoosterProps } from '../interface';
import { BoosterContainer, BoosterText, RiveContainer } from '../styles';

const BOOSTER_INFO = {
  [BoosterType.BESTSELLER]: {
    title: strings.HOHO.BESTSELLER,
    icon: <Diamond />,
    theme: '#6321AE',
    transform: 'translate(-70%,-10%)',
    borderTheme:
      'linear-gradient(90deg, #B283E7 -3.09%, rgba(178, 131, 231, 0.7) 100%)',
    iconHeight: 32,
    mobileLeft: 32,
    artboard: 'bestSellers',
  },
  [BoosterType.SELLING_OUT_FAST]: {
    title: strings.SHOW_PAGE_V2.SELLING_OUT_FAST,
    icon: <Spark />,
    theme: '#CE007C',
    transform: 'translate(-64%,-12%)',
    borderTheme:
      'linear-gradient(90deg, #fdb0d5 0%, rgba(253, 176, 213, 0.7) 100%)',
    iconHeight: 33.6,
    mobileLeft: 28,
    artboard: 'sellingFast',
  },
};

const Booster = ({ type, rank, isOverlay = false }: TBoosterProps) => {
  const {
    icon,
    title,
    theme,
    transform,
    borderTheme,
    iconHeight,
    mobileLeft,
    artboard,
  } = BOOSTER_INFO[type];

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

  const { RiveComponent, isLoading, isError } = useRive({
    src: BOOSTER_RIVE_LOCATION,
    stateMachines: 'stateMachine',
    artboard,
    autoplay: true,
    animations: 'Timeline 1',
  });

  const useFallbackLogo = isLoading || isError;

  return (
    <BoosterContainer $mobileLeft={mobileLeft} $isOverlay={isOverlay} ref={ref}>
      <BoosterText
        className="block"
        $theme={theme}
        $transform={transform}
        $borderTheme={borderTheme}
        $iconHeight={iconHeight}
      >
        <RiveContainer $transform={transform} $iconWidth={iconHeight}>
          <RiveComponent width={'100%'} height={'100%'} />
        </RiveContainer>
        <Conditional if={useFallbackLogo}>{icon}</Conditional>
        {title}
      </BoosterText>
    </BoosterContainer>
  );
};

export default Booster;
