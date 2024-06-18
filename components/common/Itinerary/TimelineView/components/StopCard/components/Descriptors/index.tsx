import React from 'react';
import { INCLUSION, SUB_TYPES } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { getDurationInHHMM } from 'utils/dateUtils';
import { ClockSvg } from 'const/descriptorIcons';
import { strings } from 'const/strings';
import Activities from 'assets/activities';
import Attraction from 'assets/attractions';
import Beverage from 'assets/beverage';
import CheckCircle from 'assets/checkCircle';
import CrossCircle from 'assets/crossCircle';
import FoodAndDrink from 'assets/foodAndDrink';
import Ticket from 'assets/ticket';
import { Container, DescriptorContainer } from './styles';
import type { DescriptorProps, Props } from './types';

const Descriptor = ({ icon, text }: DescriptorProps) => {
  return (
    <DescriptorContainer>
      {icon}
      <p className="descriptor-text">{text}</p>
    </DescriptorContainer>
  );
};

const Descriptors = ({
  inclusion,
  duration = 0,
  attractionsCount = 0,
  activitiesCount = 0,
  foodTypes,
}: Props) => {
  const getInclusionIcon = (label?: INCLUSION) => {
    if (!label) return null;

    switch (label) {
      case INCLUSION.FREE_ADMISSION:
        return <Ticket />;
      case INCLUSION.ADMISSION_TICKET_INCLUDED:
        return <CheckCircle />;
      case INCLUSION.ADMISSION_TICKET_NOT_INCLUDED:
        return <CrossCircle />;
      default:
        return <Ticket />;
    }
  };

  if (
    !inclusion &&
    !duration &&
    !activitiesCount &&
    !attractionsCount &&
    !foodTypes
  )
    return null;

  const durationObject = duration ? getDurationInHHMM(duration) : null;
  const hasHours = durationObject?.hours !== 0;
  const walkDuration = durationObject
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
    <Container>
      <Conditional if={walkDuration}>
        <Descriptor icon={<ClockSvg />} text={walkDuration} />
      </Conditional>
      <Conditional if={attractionsCount}>
        <Descriptor
          icon={<Attraction />}
          text={
            strings.formatString(
              strings.ITINERARY.DESCRIPTORS.ATTRACTIONS_COUNT,
              attractionsCount.toString()
            ) as string
          }
        />
      </Conditional>
      <Conditional if={activitiesCount}>
        <Descriptor
          icon={<Activities />}
          text={
            strings.formatString(
              strings.ITINERARY.DESCRIPTORS.ACTIVITIES_COUNT,
              activitiesCount.toString()
            ) as string
          }
        />
      </Conditional>
      <Conditional if={foodTypes}>
        <Descriptor
          icon={
            foodTypes?.label === SUB_TYPES.DRINKS ? (
              <Beverage />
            ) : (
              <FoodAndDrink />
            )
          }
          text={foodTypes?.localisedLabel}
        />
      </Conditional>
      <Conditional if={inclusion}>
        <Descriptor
          icon={getInclusionIcon(inclusion?.label)}
          text={inclusion?.localisedLabel}
        />
      </Conditional>
    </Container>
  );
};

export default Descriptors;
