import { useEffect, useRef, useState } from 'react';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { TBoosterProps } from '../../interface';
import { BoosterContainer, BoosterText } from '../../styles';
import { getBoosterInfo } from './constants';

const Booster = ({
  type,
  rank,
  isOverlay = false,
  shouldAnimateBooster,
}: TBoosterProps) => {
  const {
    icon,
    title,
    theme,
    transform,
    borderTheme,
    iconHeight,
    mobileStyles,
    textColor = '#fff',
    rotateDeg,
    iconStyles,
    boosterStyles,
    lineHeight,
    padding,
  } = getBoosterInfo(type, shouldAnimateBooster);

  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen({ ref, unobserve: true });
  const [eventRecorded, setEventRecorded] = useState(false);

  useEffect(() => {
    if (eventRecorded || !isOnScreen) return;
    trackEvent({
      eventName: ANALYTICS_EVENTS.BOOSTERS.VIEWED,
      [ANALYTICS_PROPERTIES.TYPE]: type,
      ...(rank && { [ANALYTICS_PROPERTIES.RANK]: rank }),
    });
    setEventRecorded(true);
  }, [isOnScreen, eventRecorded]);

  return (
    <BoosterContainer
      $rotateDeg={rotateDeg}
      $mobileStyles={mobileStyles}
      $isOverlay={isOverlay}
      $boosterStyles={boosterStyles}
      ref={ref}
    >
      <BoosterText
        className="block"
        $theme={theme}
        $transform={transform}
        $borderTheme={borderTheme}
        $iconHeight={iconHeight}
        $textColor={textColor}
        $iconStyles={iconStyles}
        $lineHeight={lineHeight || 20}
        $padding={padding}
      >
        {icon}
        {title}
      </BoosterText>
    </BoosterContainer>
  );
};

export default Booster;
