import { CategoryCarouselSwiper } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/CategoryCarouselsSection';
import { getShowPageUid, getVerticalImageUrl } from 'components/NewsPage/utils';
import { strings } from 'const/strings';
import { TVerticalProductCardSlideProps } from './interface';

const VerticalProductCardSlide = ({
  cards = [],
  isMobile,
  mediaData,
  showPageDocuments,
  seeAllUrl,
}: TVerticalProductCardSlideProps) => {
  const productData = JSON.parse(JSON.stringify(cards));
  const { NEWS_PAGE } = strings;
  const category = {
    ranking: {
      popularity: Object.keys(cards),
    },
    ctaUrl: {
      link_type: 'Web',
      url: seeAllUrl,
    },
    name: NEWS_PAGE.POPULAR_SHOWS,
  };

  productData.forEach((card: Record<string, any>) => {
    card.verticalImage = {
      url: getVerticalImageUrl(mediaData, card.id),
    };
    card.showPageUid = getShowPageUid(showPageDocuments, card.id);
  });

  return (
    <CategoryCarouselSwiper
      category={category}
      allTours={productData}
      isMobile={isMobile}
      index={0}
    />
  );
};

export default VerticalProductCardSlide;
