import { useContext } from 'react';
import { Box, Text } from '@headout/eevee';
import { getIntlTime } from '@headout/espeon/utils/time';
import { css } from '@headout/pixie/css';
import { MBContext } from 'contexts/MBContext';
import { strings } from 'const/strings';
import { Sandclock } from 'assets/lttShowPage/assets';
import { formatTimeSuffix } from '../utils';
import { TwoPartTimeSlot } from './style';

export const hpPartTwoTime = (startTime: string) =>
  startTime === '14:00:00' ? '19:00:00' : '18:00:00';

interface HpccShowTimingsSectionProps {
  startTime: string;
}

export const HpccShowTimingsSection = ({
  startTime,
}: HpccShowTimingsSectionProps) => {
  const { lang } = useContext(MBContext);
  const interval = `${2}${strings.BOOKING_PAGE_TIME.HOUR} ${20}${
    strings.BOOKING_PAGE_TIME.MINUTE
  }`;

  return (
    <Box
      className={css({
        margin: 'space.16',
        marginBottom: 'space.20',
        marginTop: '0',
      })}
    >
      <Text textStyle="Semantics/Heading/Small" color="core.grey.800">
        {strings.SHOW_PAGE_V2.TWO_PART_SHOW}
      </Text>
      <TwoPartTimeSlot>
        <div className="time">
          <div className="time-index">1</div>
          <div className="show-details">
            {formatTimeSuffix(getIntlTime({ time: startTime, lang }))}
            <div className="duration">
              <Sandclock />
              <p>
                {strings.DURATION}:{' '}
                {`2${strings.BOOKING_PAGE_TIME.HOUR} 40${strings.BOOKING_PAGE_TIME.MINUTE}`}
              </p>
            </div>
          </div>
        </div>
        <div className="gap">
          <div className="spacer" />
          {strings.SHOW_PAGE_V2.INTERVAL}: {interval}
        </div>
        <div className="time">
          <div className="time-index">2</div>
          <div className="show-details">
            {formatTimeSuffix(
              getIntlTime({ time: partTwoTime(startTime, lang), lang })
            )}
            <div className="duration">
              <Sandclock />
              <p>
                {strings.DURATION}:{' '}
                {`2${strings.BOOKING_PAGE_TIME.HOUR} 35${strings.BOOKING_PAGE_TIME.MINUTE}`}
              </p>
            </div>
          </div>
        </div>
      </TwoPartTimeSlot>
    </Box>
  );
};

const partTwoTime = (startTime: string, lang: string): string => {
  return startTime === '14:00:00'
    ? (formatTimeSuffix(getIntlTime({ time: '19:00:00', lang })) as string)
    : (formatTimeSuffix(getIntlTime({ time: '18:00:00', lang })) as string);
};
