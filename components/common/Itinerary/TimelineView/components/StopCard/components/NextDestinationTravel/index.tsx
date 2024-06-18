import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ModeOfTravelOptions } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { getDurationInHHMM } from 'utils/dateUtils';
import { motIcons } from 'const/itinerary';
import { strings } from 'const/strings';
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

  useEffect(() => {
    if (!modeOfTravel) return;

    const icon = dynamic(motIcons[modeOfTravel as ModeOfTravelOptions]);

    setTransferIcon(icon);
  }, [modeOfTravel]);

  const durationObject = timeForNextSection
    ? getDurationInHHMM(timeForNextSection)
    : null;
  const hasHours = durationObject?.hours !== 0;
  const formattedDuration = durationObject
    ? (strings.formatString(
        hasHours
          ? strings.ITINERARY.DESCRIPTORS.DURATION.WITH_HOURS
          : strings.ITINERARY.DESCRIPTORS.DURATION.WITHOUT_HOURS,
        ...(hasHours
          ? [durationObject?.hours, durationObject?.minutes]
          : [durationObject?.minutes])
      ) as string)
    : '';

  return (
    <NextDestinationTravelDividerContainer>
      <NextDestinationTravelContainer>
        {TransferIcon && <TransferIcon />}
        <div className="duration-and-distance-container">
          <Conditional if={distanceForNextSection}>
            <p className="distance">{distanceForNextSection} kms</p>
          </Conditional>
          <Conditional if={formattedDuration}>
            <p className="duration">{formattedDuration}</p>
          </Conditional>
        </div>
      </NextDestinationTravelContainer>
    </NextDestinationTravelDividerContainer>
  );
};

export default NextDestinationTravel;
