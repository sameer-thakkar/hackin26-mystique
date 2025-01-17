import { FunctionComponent, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  ASPECT_RATIO,
  FALLBACK_IMAGE,
  FALLBACK_IMAGES,
  PAGE_TYPES,
} from 'const/index';
import { HALYARD } from 'const/ui-constants';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 32px auto 96px auto;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    margin: 0 auto 48px auto;
  }
`;

const SwiperWrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: max-content;
  max-height: 400px;
  img {
    object-fit: cover;
    border-radius: 8px;
    width: 100%;
  }
  .image-wrap > span {
    display: block !important;
  }

  @media (max-width: 768px) {
    img {
      border-radius: unset;
      height: 235px;
    }
  }
`;

const TextWrapper = styled.div`
  max-width: 1200px;
  width: calc(100vw - (5.6vw * 2));
  margin: 0 auto 40px auto;
  display: grid;
  grid-template-rows: repeat(2, max-content);
  grid-gap: 16px;
  font-family: ${HALYARD.FONT_STACK};
  h1,
  p {
    margin: 0;
  }
  h1 {
    font-size: 48px;
    font-style: normal;
    font-weight: 700;
    line-height: 61px;
    letter-spacing: -0.2px;
  }
  p {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }

  @media (max-width: 768px) {
    margin: 24px auto 0 auto;
    h1 {
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: 32px;
    }
    p {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }
  }
`;

interface BannerProps {
  title: string;
  subText?: string;
  images: any[];
  mbType: string;
}

const Banner: FunctionComponent<React.PropsWithChildren<BannerProps>> = ({
  title,
  subText = '',
  images,
  mbType,
}) => {
  const [swiper, updateSwiper] = useState(null);
  const { lang } = useContext(MBContext);
  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    [ANALYTICS_PROPERTIES.TGIDS]: [],
    [ANALYTICS_PROPERTIES.MB_NAME]: title,
  };

  const isSwiperSet = swiper !== null && !(swiper as any)?.destroyed;

  useEffect(() => {
    if (!isSwiperSet) {
      return;
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_BANNER.VISIBLE,
      ...analyticsParams,
    });
    (swiper as any)?.on('touchEnd', () => {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_BANNER.BANNER_SCROLL,
        ...analyticsParams,
      });
    });
  }, [isSwiperSet]);

  const swiperParams: SwiperProps = {
    slidesPerView: 1.196065,
    spaceBetween: 24,
    breakpoints: {
      // when window width is >= 320px
      280: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      800: {
        slidesPerView: 1.196065,
        spaceBetween: 24,
      },
    },
    speed: 600,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    shouldSwiperUpdate: true,
    loop: true,
    initialSlide: 1,
    freeMode: true,
    // @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message
    onSwiper: updateSwiper,
  };

  let imageView;

  const { GLOBAL_MB: globalMbAR } = ASPECT_RATIO;
  const IMAGE_HEIGHT = 400;
  const fallbackImage =
    mbType === 'Themeparks' ? FALLBACK_IMAGES.THEMEPARKS : FALLBACK_IMAGE;
  switch (images?.length) {
    case 0:
      imageView = (
        <Image
          className="swiper-slide"
          url={fallbackImage}
          attribution=""
          alt="Placeholder Image"
          priority
          height={IMAGE_HEIGHT}
          aspectRatio={globalMbAR}
          autoCrop={false}
        />
      );
      break;
    case 1:
      imageView = (
        <Image
          className="swiper-slide"
          url={images[0]?.url || fallbackImage}
          alt={images[0]?.altText}
          priority
          height={IMAGE_HEIGHT}
          aspectRatio={globalMbAR}
          autoCrop={false}
        />
      );
      break;
    default:
      imageView = (
        <SwiperWrapper>
          <Swiper {...swiperParams}>
            {images?.map((image, index) => {
              return (
                <Image
                  className="swiper-slide"
                  key={index}
                  url={image?.url || fallbackImage}
                  alt={image?.altText}
                  height={IMAGE_HEIGHT}
                  aspectRatio={globalMbAR}
                  autoCrop={false}
                />
              );
            })}
          </Swiper>
        </SwiperWrapper>
      );
      break;
  }

  return (
    <Wrapper>
      <TextWrapper>
        <h1>{title}</h1>
        <Conditional if={subText}>
          <p>{subText}</p>
        </Conditional>
      </TextWrapper>
      {imageView}
    </Wrapper>
  );
};

export default Banner;
