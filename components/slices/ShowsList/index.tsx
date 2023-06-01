import Product from 'components/MicrositeV2/Product';
import PinnedCard from 'components/PinnedCard/pinnedCard';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { Container } from 'components/slices/ShowsList/styles';
import { ShowsListProps } from 'components/slices/ShowsList/interface';

const ShowsList = (props: ShowsListProps) => {
  const { isMobile, heading, data } = props;
  return (
    <Container>
      <h2>{heading}</h2>
      <div className="wrapper">
        {data?.map((show: any, index: number) => {
          const allTours: any = {};
          const tgid = show.id;
          allTours[tgid] = show;
          allTours[tgid].productImage = show.imageUrl;
          allTours[tgid].secondaryDescriptors = show.descriptors ?? [];

          return data.length === 1 && !isMobile ? (
            <PinnedCard key={index} productInfo={show} />
          ) : (
            <div className="product-card" key={index}>
              <Product
                tgid={tgid}
                allTours={allTours}
                isMobile={isMobile}
                isEntertainmentMb={true}
                isV3Design={false}
                imageId={tgid}
                showPriceBlock={true}
                showSecondaryDescriptors={!isMobile}
                productCardStyles={{
                  singleCard: true,
                  categoryFontSize: expandFontToken(FONTS.SUBHEADING_XS),
                  productCardHeight: isMobile ? '204' : '176',
                }}
              />
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default ShowsList;
