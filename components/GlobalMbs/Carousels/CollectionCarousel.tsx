import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import Carousel from 'components/GlobalMbs/Carousels/Carousel';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { filterByCategory, filterByContinent } from 'utils/globalMBUtils';
import { shortCodeSerializer } from 'utils/shortCodes';
import { convertUidToUrl } from 'utils/urlUtils';
import COLORS from 'const/colors';
import { ASPECT_RATIO, FALLBACK_IMAGE, FALLBACK_IMAGES } from 'const/index';
import { HALYARD } from 'const/ui-constants';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto 96px auto;
  width: calc(100vw - (5.6vw * 2));
  @media (max-width: 768px) {
    margin: 0 auto 48px auto;
  }
`;

const StyledCard = styled.a`
  display: grid;
  grid-template-rows: repeat(2, max-content);
  row-gap: 12px;
  img {
    width: 282px;
    height: 180px;
    object-fit: cover;
    border-radius: 4px;
  }
  @media (max-width: 768px) {
    img {
      width: 100%;
    }
  }
  .card-info,
  .info {
    display: grid;
    grid-template-rows: repeat(2, max-content);
  }
  .card-info {
    row-gap: 8px;
  }
  .info {
    row-gap: 1.5px;
  }
  .city {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${COLORS.GRAY.G3};
  }
  .collection-name {
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
  }
`;

const HeaderWrapper = styled.div`
  display: grid;
  grid-template-rows: repeat(2, max-content);
  row-gap: 12px;
  font-family: ${HALYARD.FONT_STACK};
  @media (max-width: 500px) {
    margin-bottom: 24px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  h2 {
    font-size: 24px;
    font-weight: 600;
    line-height: 28px;
    color: ${COLORS.GRAY.G2};
    margin: 0;
  }
  a {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.2px;
    color: ${COLORS.GRAY.G2};
  }
  p {
    margin: 0;
  }
  svg {
    height: 10px;
    transform: rotate(180deg);
  }
`;

interface CollectionCarouselProps {
  title: string;
  subtext: any[];
  carouselType: string;
  showSeeAll?: boolean;
  collections: any[];
}

const CollectionCarousel: FunctionComponent<CollectionCarouselProps> = ({
  title,
  subtext,
  carouselType,
  collections,
}) => {
  const { isDev, host } = useContext(MBContext);
  const FILTER_TYPE = {
    ALL: 'All',
    ASIA: 'Asia',
    AFRICA: 'Africa',
    EUROPE: 'Europe',
    NA: 'North America',
    SA: 'South America',
    OCEANIA: 'Oceania',
    WATERPARK: 'Waterpark',
  };

  let topCollections;
  switch (carouselType) {
    case 'top-10-world':
      topCollections = filterByContinent(collections, FILTER_TYPE.ALL);
      break;
    case 'top-10-asia':
      topCollections = filterByContinent(collections, FILTER_TYPE.ASIA);
      break;
    case 'top-10-africa':
      topCollections = filterByContinent(collections, FILTER_TYPE.AFRICA);
      break;
    case 'top-10-europe':
      topCollections = filterByContinent(collections, FILTER_TYPE.EUROPE);
      break;
    case 'top-10-na':
      topCollections = filterByContinent(collections, FILTER_TYPE.NA);
      break;
    case 'top-10-sa':
      topCollections = filterByContinent(collections, FILTER_TYPE.SA);
      break;
    case 'top-10-oceania':
      topCollections = filterByContinent(collections, FILTER_TYPE.OCEANIA);
      break;
    case 'waterparks':
      topCollections = filterByCategory(collections, FILTER_TYPE.WATERPARK);
      break;
  }
  const { GLOBAL_MB: globalMbAR } = ASPECT_RATIO;
  const collectionCards = topCollections
    ?.slice(0, 9)
    ?.map((collection, index) => {
      const { data, uid } = collection || {};
      const { collection_name, city_name, images, mb_type } = data || {};
      const fallbackImage =
        mb_type === 'Themeparks' ? FALLBACK_IMAGES.THEMEPARKS : FALLBACK_IMAGE;
      const imageUrl = images?.length
        ? images[0]?.image_url
          ? images[0]?.image_url
          : fallbackImage
        : fallbackImage;
      const altText = images?.length ? images[0]?.alt_text : '';
      return (
        <StyledCard
          href={convertUidToUrl({ uid, isDev, hostname: host })}
          key={index}
        >
          <Image
            url={imageUrl}
            alt={altText}
            aspectRatio={globalMbAR}
            autoCrop={false}
          />
          <div className="card-info">
            <div className="info">
              <div className="boosters">
                <div className="city">{city_name}</div>
              </div>
              <div className="collection-name">{collection_name}</div>
            </div>
          </div>
        </StyledCard>
      );
    });

  const entrySection = (
    <HeaderWrapper>
      <div className="header">
        <h2>{title}</h2>
      </div>
      <Conditional if={subtext?.length}>
        <PrismicRichText field={subtext} components={shortCodeSerializer} />
      </Conditional>
    </HeaderWrapper>
  );
  return (
    <>
      <Conditional if={collectionCards?.length}>
        <Wrapper>
          <Carousel cardsInARow={4} entrySection={entrySection}>
            {collectionCards}
          </Carousel>
        </Wrapper>
      </Conditional>
    </>
  );
};

export default CollectionCarousel;
