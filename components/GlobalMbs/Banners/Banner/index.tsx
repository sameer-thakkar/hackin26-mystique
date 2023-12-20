import { FunctionComponent, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PrismicRichText, PrismicText } from '@prismicio/react';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import {
  IBannerProps,
  IGlobalBannerImage,
} from 'components/GlobalMbs/Banners/Banner/interface';
import {
  StyledBanner,
  SwiperWrapper,
} from 'components/GlobalMbs/Banners/Banner/styles';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { getBuyTicketsUrl } from 'utils/helper';
import { shortCodeSerializer } from 'utils/shortCodes';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  ASPECT_RATIO,
  FALLBACK_IMAGES,
  PAGE_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import { CHEVRON_DOWN } from 'assets/SvgIcons';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });
const Breadcrumb = dynamic(() => import('components/GlobalMbs/Breadcrumb'));

export const variantStyles = {
  'full-width': {
    gridTemplateColumns: '1fr 634px',
    img: {
      height: '396',
    },
  },
  large: {
    gridTemplateColumns: '100%',
    img: {
      height: '382',
    },
  },
  small: {
    gridTemplateColumns: '100%',
    img: {
      height: '235',
    },
  },
};

const Banner: FunctionComponent<IBannerProps> = ({
  title,
  subText = '',
  images,
  cardType,
  breadcrumbs,
  collection = {},
  startingPrice = null,
  isTicketPage = false,
  subHeading = '',
  availableTours,
}) => {
  const {
    categoryID,
    collectionID,
    tgid,
    ticketsPageLink,
    supply,
    officialWebsite,
    totalCityCollections,
    primaryCategory,
    secondaryCategories,
    rank,
    location,
    duration,
    timings,
    city,
  } = collection;
  const finalSecondaryCategory = secondaryCategories?.map(
    (item: any) => item.category
  );

  const [swiper, updateSwiper] = useState(null);
  const { host, isDev, lang } = useContext(MBContext);
  const { GLOBAL_MB: globalMbAR } = ASPECT_RATIO;
  const ticketLink = getBuyTicketsUrl(
    supply,
    categoryID || collectionID,
    tgid,
    ticketsPageLink,
    isDev,
    host,
    officialWebsite
  );
  const swiperParams: SwiperProps = {
    pagination: {
      type: 'bullets',
      clickable: true,
    },
    slidesPerView: 1,
    speed: 600,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: true,
    initialSlide: 1,
    freeMode: true,
    // @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message
    onSwiper: updateSwiper,
  };
  const analyticsParams = {
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    [ANALYTICS_PROPERTIES.TGIDS]: availableTours || [],
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
    (swiper as any)?.on('click', (e: any) => {
      const isPaginationBullet = e.target.matches('.swiper-pagination-bullet');
      if (isPaginationBullet) {
        trackEvent({
          eventName: ANALYTICS_EVENTS.MB_BANNER.BANNER_SCROLL,
          ...analyticsParams,
        });
      }
    });
    (swiper as any)?.on('touchEnd', () => {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_BANNER.BANNER_SCROLL,
        ...analyticsParams,
      });
    });
  }, [isSwiperSet]);

  let imageView;

  switch (images?.length) {
    case 0:
      imageView = (
        <Image
          className="swiper-slide"
          url={FALLBACK_IMAGES.THEMEPARKS}
          attribution=""
          alt="Placeholder Image"
          height={variantStyles[cardType].img.height}
          aspectRatio={globalMbAR}
          priority
          autoCrop={false}
        />
      );
      break;
    case 1:
      imageView = (
        <Image
          className="swiper-slide"
          url={images[0]?.url || FALLBACK_IMAGES.THEMEPARKS}
          attribution={images[0]?.copyright}
          alt={images[0]?.altText || ''}
          width="650"
          height={variantStyles[cardType].img.height}
          aspectRatio={globalMbAR}
          priority
          autoCrop={false}
        />
      );
      break;
    default:
      imageView = (
        <SwiperWrapper>
          <Swiper {...swiperParams}>
            {images?.map((image: IGlobalBannerImage, index) => {
              return (
                <Image
                  className="swiper-slide"
                  key={index}
                  url={image?.url || FALLBACK_IMAGES.THEMEPARKS}
                  attribution={image?.copyright}
                  alt={image?.altText || ''}
                  width="650"
                  height={variantStyles[cardType]?.img?.height}
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

  const [toggleTimings, setToggleTimings] = useState(false);

  const showTimingsHandler = () => {
    setToggleTimings((prevState) => !prevState);
  };

  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <StyledBanner cardType={cardType} isTicketPage={isTicketPage}>
      <div className="card-content-section">
        <Conditional if={breadcrumbs?.length}>
          <Breadcrumb links={breadcrumbs} />
        </Conditional>
        <div className="wrapper">
          <h1 className="title">{title}</h1>
          <Conditional if={subHeading}>
            <div className="subheading">{subHeading}</div>
          </Conditional>
          <Conditional if={subText}>
            <div className="subtext">{subText}</div>
          </Conditional>
          <Conditional if={Object.keys(collection)?.length && !isTicketPage}>
            <div className="rank-wrapper">
              <Conditional if={totalCityCollections > 2}>
                <div className="rank">
                  {`#${rank}`} of {totalCityCollections} things to do in {city}
                </div>
              </Conditional>
              <div className="tag-wrapper">
                <div className="tag">{primaryCategory}</div>
                {finalSecondaryCategory?.map((item: any, idx: number) => (
                  <div className="tag" key={idx}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="info">
              <div>
                <span className="bold">Address: </span>
                {location && <PrismicText field={location} />}
              </div>
              <div className="">
                <span className="bold">Duration: </span>
                {duration}
              </div>
              <div className="">
                <span className="bold">Timings: </span>{' '}
                <span
                  className="toggle-timings"
                  onClick={showTimingsHandler}
                  role="button"
                  tabIndex={0}
                >
                  See all hours {CHEVRON_DOWN}
                </span>
                <Conditional if={toggleTimings}>
                  <PrismicRichText
                    field={timings}
                    components={shortCodeSerializer}
                  />
                </Conditional>
              </div>
            </div>
            <div className="tickets">
              <Conditional if={startingPrice}>
                <div className="price-wrapper">
                  <div className="starting-from">Tickets starts from</div>
                  <div className="price">{startingPrice}</div>
                </div>
              </Conditional>
              <Conditional if={ticketLink}>
                <a href={ticketLink} className="cta">
                  {strings.BANNER_CTA}
                </a>
              </Conditional>
            </div>
          </Conditional>
        </div>
      </div>
      {imageView}
    </StyledBanner>
  );
};

export default Banner;
