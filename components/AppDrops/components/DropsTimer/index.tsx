import React, { useEffect, useState } from 'react';
import { Text } from '@headout/eevee';
import { getNextDropCountdown } from 'components/AppDrops/utils';
import { strings } from 'const/strings';
import {
  digit,
  digitContainer,
  separator,
  timerContainer,
  timeUnit,
} from './styles';

type TDropsTimerProps = {
  cityCode: string;
};

interface AnimatedDigitProps {
  value: string;
}

const AnimatedDigit: React.FC<AnimatedDigitProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (value !== displayValue) {
      setDisplayValue(value);
      setAnimationKey((prev) => prev + 1);
    }
  }, [value, displayValue]);

  return (
    <div className={digitContainer}>
      <Text
        as="span"
        textStyle="ui.label.small.heavy"
        color="core.candy.800"
        className={digit}
        key={animationKey}
      >
        {displayValue}
      </Text>
    </div>
  );
};

const DROPS_TIMER_INTERVAL = 1000;

export const DropsTimer = ({ cityCode }: TDropsTimerProps) => {
  const [countdown, setCountdown] = useState(() =>
    getNextDropCountdown(cityCode)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getNextDropCountdown(cityCode));
    }, DROPS_TIMER_INTERVAL);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeString = countdown.replace(/\s/g, '');
  const [hours, minutes, seconds] = timeString.split(':');

  return (
    <div className={timerContainer}>
      <Text as="label" textStyle="ui.label.small.heavy" color="core.candy.800">
        {strings.formatString(
          strings.DROPS.NEXT_DROP_IN,
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <div className={timeUnit}>
              <AnimatedDigit value={hours[0]} />
              <AnimatedDigit value={hours[1]} />
            </div>
            <span className={separator}>:</span>
            <div className={timeUnit}>
              <AnimatedDigit value={minutes[0]} />
              <AnimatedDigit value={minutes[1]} />
            </div>
            <span className={separator}>:</span>
            <div className={timeUnit}>
              <AnimatedDigit value={seconds[0]} />
              <AnimatedDigit value={seconds[1]} />
            </div>
          </span>
        )}
      </Text>
    </div>
  );
};
