import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import Carousel from 'components/GlobalMbs/Carousels/Carousel';
import Image from 'UI/Image';
import TitleTextCombo from 'UI/TitleTextCombo';
import { MBContext } from 'contexts/MBContext';
import { convertUidToUrl } from 'utils/urlUtils';
import COLORS from 'const/colors';
import { FALLBACK_IMAGES } from 'const/index';

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
    width: 180px !important;
    height: 180px !important;
    object-fit: cover;
    border-radius: 4px;
  }
  .image-wrap > span,
  img {
    position: relative !important;
  }
  @media (max-width: 768px) {
    img {
      width: 100%;
    }
  }
`;
const TextWrapper = styled.div`
  display: grid;
  grid-template-rows: repeat(2, max-content);
  row-gap: 4px;
  .city {
    font-size: 17px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 0.5px;
  }
  .country {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${COLORS.GRAY.G3};
  }
`;

interface TopDestinationsCarouselProps {
  destinations: any[];
  showTitle?: boolean;
}

const TopDestinationsCarousel: FunctionComponent<
  React.PropsWithChildren<TopDestinationsCarouselProps>
> = ({ destinations, showTitle = true }) => {
  const { isDev, host } = useContext(MBContext);
  const finalCities = destinations?.filter(
    (destination) =>
      destination?.data?.city_name && destination?.data?.body?.length
  );
  const entrySection = (
    <Conditional if={showTitle}>
      <TitleTextCombo>
        <h2>Top Destinations</h2>
      </TitleTextCombo>
    </Conditional>
  );

  const cardMarkup = finalCities?.map((city, index) => {
    const { data, uid } = city || {};
    const { city_name, country_name, body: slices } = data || {};
    const images = slices
      ?.filter((slice: any) => slice?.slice_type === 'banner')
      ?.reduce((acc: any, curr: any) => acc + curr);
    const image = images?.items[0]?.banner_image;
    const altText = images?.items[0]?.alt_text;

    return (
      <StyledCard
        key={index}
        href={convertUidToUrl({ uid, isDev, hostname: host })}
        target="_blank"
        rel="noopener"
      >
        <Image url={image || FALLBACK_IMAGES.THEMEPARKS} alt={altText} />
        <TextWrapper>
          <div className="city">{city_name}</div>
          <div className="country">{country_name}</div>
        </TextWrapper>
      </StyledCard>
    );
  });
  return (
    <Wrapper>
      <Carousel cardsInARow={6} entrySection={entrySection}>
        {cardMarkup}
      </Carousel>
    </Wrapper>
  );
};
export default TopDestinationsCarousel;
