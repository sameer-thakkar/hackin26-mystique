import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { ModeOfTravelOptions } from 'types/itinerary.type';
import { getDurationInHmNotation } from '@headout/espeon/utils/time';
import { getIntlUnit } from '@headout/espeon/utils/units';
import Conditional from 'components/common/Conditional';
import { appAtom } from 'store/atoms/app';
import { motIcons } from 'const/itinerary';
import {
  NextDestinationTravelContainer,
  NextDestinationTravelDividerContainer,
} from './styles';
import { NextDestinationTravelProps } from './types';

const NextDestinationTravel = ({
  distanceForNextSection = 0,
  timeForNextSection = 0,
  modeOfTravel,
}: NextDestinationTravelProps) => {
  const [TransferIcon, setTransferIcon] =
    useState<React.ComponentType<{}> | null>(null);

  const { language } = useRecoilValue(appAtom);

  useEffect(() => {
    if (
      !modeOfTravel ||
      !Object.values(ModeOfTravelOptions).includes(modeOfTravel.label)
    )
      return;

    const icon = dynamic(motIcons[modeOfTravel.label as ModeOfTravelOptions]);

    setTransferIcon(icon);
  }, [modeOfTravel]);

  const formattedDuration = timeForNextSection
    ? getDurationInHmNotation({
        durationInMinutes: timeForNextSection,
        lang: language,
      })
    : '';

  const hasContent = !!(
    distanceForNextSection ||
    formattedDuration ||
    modeOfTravel?.localisedLabel
  );

  return (
    <NextDestinationTravelDividerContainer>
      <NextDestinationTravelContainer>
        {TransferIcon && <TransferIcon />}
        <Conditional if={hasContent}>
          <div className="duration-and-distance-container">
            <Conditional if={distanceForNextSection}>
              <p className="distance">
                {getIntlUnit({
                  lang: language,
                  number: distanceForNextSection,
                  options: {
                    unit: 'kilometer',
                  },
                })}
              </p>
            </Conditional>
            <Conditional if={formattedDuration}>
              <p className="duration">{formattedDuration}</p>
            </Conditional>
            <Conditional
              if={
                !distanceForNextSection &&
                !formattedDuration &&
                modeOfTravel?.localisedLabel
              }
            >
              <p className="mode-of-transfer">{modeOfTravel?.localisedLabel}</p>
            </Conditional>
          </div>
        </Conditional>
      </NextDestinationTravelContainer>
    </NextDestinationTravelDividerContainer>
  );
};

export default NextDestinationTravel;
