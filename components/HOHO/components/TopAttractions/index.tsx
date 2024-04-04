import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import { trackPageSection } from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import { TopAttractionsCarouselProps } from 'components/HOHO/components/TopAttractions/interface';
import {
  CarouselContainer,
  HeadingSection,
  StyledSlide,
  SwiperWrapper,
} from 'components/HOHO/components/TopAttractions/styles';
import { SECTION_NAMES } from 'components/HOHO/constants';
import Image from 'UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import { genUniqueId } from 'utils';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  BUS,
  CTA_TYPE,
} from 'const/index';
import { strings } from 'const/strings';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);
const TopAttractionsCarousel: React.FC<TopAttractionsCarouselProps> = (
  props
) => {
  const { attraction_list, section_heading, see_all_link, isMobile } = props;
  const swiperParams: SwiperProps = {
    loop: true,
    freeMode: true,
    spaceBetween: isMobile ? 12 : 24,
    grabCursor: true,
    slidesPerView: 'auto',
    autoplay: {
      delay: 1,
      disableOnInteraction: false,
    },
    speed: 8000,
    onTouchEnd: () => {},
  };

  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });
  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({ section: SECTION_NAMES.TOP_ATTRACTIONS });
    }
  }, [isIntersecting]);

  return (
    <div ref={containerRef}>
      <HeadingSection>
        <h2>{section_heading}</h2>
        <Conditional if={see_all_link?.url}>
          <a
            href={see_all_link?.url}
            target="_blank"
            onClick={() =>
              trackEvent({
                eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
                [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.SEE_ALL,
                [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAMES.TOP_ATTRACTIONS,
              })
            }
          >
            {strings.HOHO.SEE_ALL}
          </a>
        </Conditional>
      </HeadingSection>
      <CarouselContainer>
        <SwiperWrapper>
          <Swiper {...swiperParams}>
            {attraction_list?.map((item) => {
              const { attraction_name, attraction_image } = item || {};
              const { url: imageURL } = attraction_image || {};
              return (
                <StyledSlide key={genUniqueId()}>
                  <Image
                    fill
                    url={imageURL}
                    alt={attraction_name}
                    format="jpg"
                  />
                  <div className="attraction-name"> {attraction_name}</div>
                </StyledSlide>
              );
            })}
          </Swiper>
        </SwiperWrapper>
        <Conditional if={!isMobile}>
          <HeadingSection>
            <Image
              url={BUS}
              alt="hoho_bus"
              format="jpg"
              height={114}
              width={225}
              className="hoho-bus"
            />
          </HeadingSection>
        </Conditional>
        <Conditional if={isMobile}>
          <Image url={BUS} alt="hoho_bus" format="jpg" className="hoho-bus" />
        </Conditional>
      </CarouselContainer>
    </div>
  );
};
export default TopAttractionsCarousel;
