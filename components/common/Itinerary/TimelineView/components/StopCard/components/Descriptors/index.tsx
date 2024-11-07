import React from 'react';
import { INCLUSION, SUB_TYPES } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { Container } from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/styles';
import {
  DescriptorSize,
  type Props,
} from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/types';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import { getDurationInHMNotation } from 'utils/dateUtils';
import { generateGoogleMapPlacesUrl } from 'utils/itinerary';
import COLORS from 'const/colors';
import { ClockSvg } from 'const/descriptorIcons';
import { strings } from 'const/strings';
import Activities from 'assets/activities';
import Attraction from 'assets/attractions';
import Beverage from 'assets/beverage';
import CheckCircle from 'assets/checkCircle';
import CrossCircle from 'assets/crossCircle';
import FoodAndDrink from 'assets/foodAndDrink';
import LocationPin from 'assets/locationPin';
import Ticket from 'assets/ticket';
import Descriptor from './components/Descriptor';

const Descriptors = ({
  inclusion,
  duration = 0,
  attractionsCount = 0,
  activitiesCount = 0,
  foodTypes,
  variant = TimelineViewComponentVariant.DEFAULT,
  descriptorSize = DescriptorSize.LARGE,
  location,
  showLocationDescriptor = true,
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
    !foodTypes &&
    !location
  )
    return null;

  const walkDuration = duration ? getDurationInHMNotation(duration) : '';
  const locationUrl = location ? generateGoogleMapPlacesUrl(location) : '';

  return (
    <Container className="descriptors-container" $variant={variant}>
      <Conditional if={!!locationUrl && showLocationDescriptor}>
        <Descriptor
          icon={<LocationPin height={12} width={12} />}
          text={strings.ITINERARY.GET_DIRECTION}
          color={COLORS.TEXT.CANDY_1}
          bold
          url={locationUrl}
          size={descriptorSize}
        />
      </Conditional>
      <Conditional if={walkDuration}>
        <Descriptor
          icon={<ClockSvg />}
          text={walkDuration}
          size={descriptorSize}
        />
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
          size={descriptorSize}
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
          size={descriptorSize}
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
          size={descriptorSize}
        />
      </Conditional>
      <Conditional if={inclusion}>
        <Descriptor
          icon={getInclusionIcon(inclusion?.label)}
          text={inclusion?.localisedLabel}
          size={descriptorSize}
        />
      </Conditional>
    </Container>
  );
};

export default Descriptors;
