import React, { useEffect, useRef } from 'react';
import { SystemStyleObject } from '@headout/pixie/types';
import { WhyWithHOSection } from 'components/Espeon/WhyWithHOSection';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  COLLECTION_PAGE,
} from 'const/index';
import { strings } from 'constants/strings';
import {
  getWhyDayTripsWithHoItems,
  WHY_DAY_TRIPS_WITH_HO_SECTION_ID,
} from './constants';
import { itemsContainerStyles } from './styles';

const WhyDayTripsWithHoSection = ({
  isDesktop = true,
}: {
  isDesktop?: boolean;
}) => {
  const whyWithHoSectionRef = useRef<HTMLDivElement>(null);

  const isWhyWithHoSectionVisible = useOnScreen({
    ref: whyWithHoSectionRef,
    unobserve: true,
  });

  useEffect(() => {
    if (!isWhyWithHoSectionVisible) return;

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
      [ANALYTICS_PROPERTIES.SECTION]: COLLECTION_PAGE.WHY_DAY_TRIPS_WITH_HO,
    });
  }, [isDesktop, isWhyWithHoSectionVisible]);

  return (
    <div id={WHY_DAY_TRIPS_WITH_HO_SECTION_ID} ref={whyWithHoSectionRef}>
      <WhyWithHOSection
        title={strings.DAY_TRIPS.WHY_WITH_HO.TITLE}
        isDesktop={isDesktop}
        overrideStyles={{
          itemsContainer: itemsContainerStyles.raw({
            isDesktop,
          }) as SystemStyleObject,
        }}
        items={getWhyDayTripsWithHoItems(strings)}
      />
    </div>
  );
};

export default WhyDayTripsWithHoSection;
