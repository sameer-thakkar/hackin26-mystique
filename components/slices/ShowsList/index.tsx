import Product from 'components/MicrositeV2/Product';
import PinnedCard from 'components/PinnedCard/pinnedCard';
import { ShowsListProps } from 'components/slices/ShowsList/interface';
import { Container } from 'components/slices/ShowsList/styles';
import { getTgidsFromShow } from 'utils';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

const ShowsList = (props: ShowsListProps) => {
  const { isMobile, heading, data, sliceData } = props;

  const tgidsSet = new Set(getTgidsFromShow(sliceData));

  const idMap = new Map();

  /* The "data" can have repeating elements(same tgids). Therefore, removing it to prevent showing same product cards */
  const finalData = data.filter((obj: any) => {
    if (idMap.has(obj.id)) {
      return false;
    } else {
      idMap.set(obj.id, true);
      return true;
    }
  });

  const showData = finalData.reduce((acc: any, curr: any) => {
    return (acc = tgidsSet.has(curr.id) ? [...acc, curr] : [...acc]);
  }, []);

  return (
    <Container>
      <h2>{heading}</h2>
      <div className="wrapper">
        {showData?.map((show: any, index: number) => {
          const allTours: any = {};
          const tgid = show.id;
          allTours[tgid] = show;
          allTours[tgid].productImage = show.imageUrl;
          allTours[tgid].secondaryDescriptors = show.descriptors ?? [];

          return showData.length === 1 && !isMobile ? (
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
