import { Button } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import Slider from 'UI/Slider';
import { useTrackElementView } from 'hooks/useTrackElementView';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { ChevronLeftCircleFlat } from 'assets/airportTransfers/privateAirportTransfers';
import RightTailHeadArrow from 'assets/rightTailHeadArrow';
import { CARS_DATA } from '../constants';
import {
  containerStyle,
  fromTextStyle,
  headingStyle,
  leftColumnStyle,
  paragraphStyle,
  priceStyle,
  sliderContainerStyle,
} from './style';
import { CarCard } from './VehicleCard';

export const VehiclesSection = ({ isMobile }: { isMobile: boolean }) => {
  const ref = useTrackElementView({
    eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
    properties: {
      [ANALYTICS_PROPERTIES.SECTION]: 'Vehicle Carousel',
      [ANALYTICS_PROPERTIES.RANKING]: 5,
    },
  });

  const handleScroll = () => {
    trackEvent({
      eventName: 'Carousel Scrolled',
      [ANALYTICS_PROPERTIES.SECTION]: 'Vehicle Carousel',
    });
  };

  const handleCTAClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.LABEL]: 'Book Your Ride',
    });
  };

  return (
    <div ref={ref} className={containerStyle}>
      <div className={leftColumnStyle}>
        <h2 className={headingStyle}>
          {strings.PRIVATE_AT_LANDING_PAGE.FIND_YOUR_RIDE}
        </h2>

        <p className={paragraphStyle}>
          {strings.PRIVATE_AT_LANDING_PAGE.FIND_YOUR_RIDE_SUBTEXT}
        </p>

        <Conditional if={!isMobile}>
          <span className={fromTextStyle}>from</span>

          <div className={priceStyle}>$52.24</div>

          <Button
            as="button"
            overrideStyles={{
              icon: css.raw({
                transform: 'translateY(1px)',
              }),
            }}
            icon={RightTailHeadArrow}
            iconPosition="trailing"
            primaryText="Book your ride"
            onClick={handleCTAClick}
            size="medium"
          />
        </Conditional>
      </div>

      <div className={sliderContainerStyle}>
        <Slider
          nextButton={isMobile ? undefined : <ChevronLeftCircleFlat />}
          prevButton={isMobile ? undefined : <ChevronLeftCircleFlat />}
          sliderOptions={{
            slidesPerView: isMobile ? 1.5 : 3,
            spaceBetween: isMobile ? 16 : 24,
            freeMode: isMobile,
          }}
          onSlideChange={handleScroll}
        >
          {CARS_DATA.map(({ title, guests, luggage, carList, imageUrl }) => (
            <CarCard
              isMobile={isMobile}
              key={title}
              title={title}
              guests={guests}
              luggage={luggage}
              carList={carList}
              imageUrl={imageUrl}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};
