import { FunctionComponent, useState } from 'react';
import dynamic from 'next/dynamic';
import { RichText } from 'prismic-reactjs';
import styled from 'styled-components';
import Image from 'UI/Image';
import Conditional from 'components/common/Conditional';
import { FALLBACK_IMAGES } from 'const/index';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';
import { CHEVRON_DOWN } from 'assets/SvgIcons';
import { shortCodeSerializer } from 'utils/shortCodes';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });
const Breadcrumb = dynamic(() => import('components/GlobalMbs/Breadcrumb'));

const variantStyles = {
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

const SwiperWrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: max-content;
`;

const StyledBanner = styled.div((props) => {
  const styles = props.isMobile
    ? variantStyles.small
    : variantStyles[props.cardType];
  return `
  display: grid;
  align-content: start;
  background: ${COLORS.WHITE};
  grid-template-columns: ${styles.gridTemplateColumns};
  column-gap: 80px;
  height: calc(100% - 2px);
  max-width: 1200px;
  margin: 0 auto 72px auto;
  text-decoration: none;
  font-family: ${SOLEIL.FONT_STACK};
  font-size: 16px;
  line-height: 150%;
  font-weight: 400;
  ${props.link && `cursor: pointer;`};
  margin-top: 16px;

  img {
    height: ${styles.img.height}px;
    object-fit: cover;
    width: 100%;
    border-radius: 8px;
  }
  .card-content-section {
    * {
      margin-top: 0;
    }
    .title {
      font-size: 48px;
      line-height: 38px;
      font-weight: 700;
      letter-spacing: -0.2px;
      margin-bottom: 16px;
    }

    .subtext {
      margin-top: 32px;
      font-feature-settings: "ss04";
    }

    .rank-wrapper {
      display: grid;
      grid-template-rows: repeat(2, max-content);
      margin-bottom: 24px;
    }

    .rank {
      font-size: 17px;
      line-height: 29px;
      margin-bottom: 8px;
    }
    .tag {
      padding: 4px 8px;
      width: max-content;
      background-color: ${COLORS.GREY_FO};
      color: ${COLORS.GREY_G3};
      font-size: 12px;
      line-height: 12px;
      border-radius: 2px;
    }
    .info {
      margin-bottom: 34px;
    }
    .tickets {
      display: flex;
      justify-content: space-between;
      .cta {
        display: flex;
        align-items: center;
        padding: 8px 70px;
        border-radius: 2px;
        background-color: ${COLORS.RHAPSODY};
        color: ${COLORS.WHITE};
        font-size: 16px;
        line-height: 24px;
      }
      .price-wrapper {
        display: grid;
        grid-template-rows: repeat(2, max-content);
        row-gap: 12px;
        .starting-from {
          font-size: 14px;
          line-height: 16px;
          color: ${COLORS.GREY_G4}
        }
        .price {
          font-size: 24px;
          line-height: 16px;
          font-weight: 600;
        }
      }
    }
    .bold {
      font-weight: 600;
    }
    .toggle-timings {
      cursor: pointer;
      svg {
        width: 12px;
        height: 12px;
      }
    }
    p {
      margin-bottom: 16px;
    }
    a {
      color: ${COLORS.MED_SLATE_BLUE};
      word-wrap: break-word;
    }
  }
  .swiper-pagination.swiper-pagination-bullets {
    top: unset;
    display: block;
  }
  @media (max-width: 1024px) {
    grid-template-columns: unset;
    column-gap: unset;
    grid-template-rows: repeat(2, max-content);
    row-gap: 24px;
    font-size: 14px;
    line-height: 143%;
    margin: 0 auto 48px auto;
    img {
      height: 382px;
      border-radius: 0;
      width: 100%;
      object-fit: cover;
    }

    .card-content-section {
      padding: 0;
      width: calc(100vw - (5.6vw * 2));
      box-sizing: border-box;
      grid-row: 2;
      margin: 0 auto;
      .title {
        font-size: 32px;
        margin-bottom: 8px;
      }
      .rank-wrapper {
        margin-bottom: 16px;
      }
      .rank {
        font-size: 16px;
      }
      .info {
        margin-bottom: 24px;
      }
      .tickets {
        flex-direction: column;
        .price-wrapper {
          margin-bottom: 24px;
        }
        .cta {
          padding: 8px 0;
          width: 100%;
          justify-content: center;
        }
      }
    }
  }
  @media(max-width: 500px) {
    img {
      height: 235px;
    }
  }
`;
});

export enum BannerLayout {
  fullWidth = 'full-width',
  large = 'large',
  small = 'small',
}

interface BannerProps {
  title: string;
  subText?: string;
  images: any[];
  cardType: BannerLayout;
  breadcrumbs?: Array<{ url: string; text: string }>;
  collection?: any;
  startingPrice?: string;
}

const Banner: FunctionComponent<BannerProps> = ({
  title,
  subText = '',
  images,
  cardType,
  breadcrumbs,
  collection = {},
  startingPrice = null,
}) => {
  const {
    categoryID,
    ticketsPageLink,
    supply,
    officialWebsite,
    totalCityCollections,
    primaryCategory,
    rank,
    location,
    duration,
    timings,
    city,
  } = collection;
  const hasTicketPage = categoryID && supply === 'Direct';
  const ticketLink = hasTicketPage
    ? ticketsPageLink
      ? convertUidToUrl(ticketsPageLink)
      : getValidUrl(officialWebsite?.trim())
    : getValidUrl(officialWebsite?.trim());
  const swiperParams = {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    shouldSwiperUpdate: true,
  };

  let imageView;

  switch (images?.length) {
    case 0:
      imageView = (
        <Image
          className="swiper-slide"
          url={FALLBACK_IMAGES.THEMEPARKS}
          attribution=""
          alt="Placeholder Image"
          width="650"
          height={variantStyles[cardType].img.height}
        />
      );
      break;
    case 1:
      imageView = (
        <Image
          className="swiper-slide"
          url={images[0]?.url || FALLBACK_IMAGES.THEMEPARKS}
          attribution={images[0]?.copyright}
          alt={images[0]?.altText}
          width="650"
          height={variantStyles[cardType].img.height}
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
                  url={image?.url || FALLBACK_IMAGES.THEMEPARKS}
                  attribution={image?.copyright}
                  alt={image?.altText}
                  width="650"
                  height={variantStyles[cardType]?.img?.height}
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
    <StyledBanner cardType={cardType}>
      <div className="card-content-section">
        <Conditional if={breadcrumbs?.length}>
          <Breadcrumb links={breadcrumbs} />
        </Conditional>
        <div className="wrapper">
          <div className="title">{title}</div>
          <Conditional if={subText}>
            <div className="subtext">{subText}</div>
          </Conditional>
          <Conditional if={Object.keys(collection)?.length}>
            <div className="rank-wrapper">
              <Conditional if={totalCityCollections > 2}>
                <div className="rank">
                  {`#${rank}`} of {totalCityCollections} things to do in {city}
                </div>
              </Conditional>
              <div className="tag-wrapper">
                <div className="tag">{primaryCategory}</div>
              </div>
            </div>
            <div className="info">
              <div>
                <span className="bold">Address: </span>
                {location && RichText.asText(location)}
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
                  <RichText
                    render={timings}
                    htmlserialize={shortCodeSerializer}
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
                  Check Tickets
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
