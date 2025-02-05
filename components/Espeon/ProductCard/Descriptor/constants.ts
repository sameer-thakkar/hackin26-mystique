import Clock from 'components/Espeon/Assets/Clock';
import Food from 'components/Espeon/Assets/Food';
import GuidedTour from 'components/Espeon/Assets/GuidedTour';
import Headphone from 'components/Espeon/Assets/Headphone';
import Hotel from 'components/Espeon/Assets/Hotel';
import Phone from 'components/Espeon/Assets/Phone';
import Quick from 'components/Espeon/Assets/Quick';
import Shield from 'components/Espeon/Assets/Shield';
import Skip from 'components/Espeon/Assets/Skip';
import Transfer from 'components/Espeon/Assets/Transfer';
import Validity from 'components/Espeon/Assets/Validity';
import type { EDescriptorCode } from './types';

export const descriptorIcons: Partial<
  Record<EDescriptorCode, React.ComponentType<any>>
> = {
  TRANSFERS: Transfer,
  FREE_CANCELLATION: Shield,
  DURATION: Clock,
  INSTANT_CONFIRMATION: Quick,
  MOBILE_TICKET: Phone,
  SKIP_THE_LINE: Skip,
  HOTEL_PICKUP: Hotel,
  MEALS_INCLUDED: Food,
  AUDIO_GUIDE: Headphone,
  GUIDED_TOUR: GuidedTour,
  EXTENDED_VALIDITY: Validity,
};
