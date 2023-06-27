import Product from 'components/MicrositeV2/Product';
import { Container } from 'components/slices/ShowsGrid/styles';
import { ShowsGridProps } from 'components/slices/ShowsGrid/interface';
import { getTgidsFromShow } from 'utils';

const ShowsGrid = (props: ShowsGridProps) => {
  const { data, isMobile, heading, sliceData } = props;

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
        {showData?.map((show: Record<string, string>, index: number) => {
          const allTours: any = {};
          const tgid = show.id;
          allTours[tgid] = show;
          allTours[tgid].productImage = show.imageUrl;
          return (
            <div className="show-image" key={index}>
              <Product
                tgid={tgid}
                allTours={allTours}
                isMobile={false}
                imageId={tgid}
                isEntertainmentMb={true}
                isV3Design={false}
                showPriceBlock={false}
                productCardStyles={{
                  singleCard: true,
                  productCardHeight: isMobile ? 168 : 204,
                }}
              />
            </div>
          );
        })}
      </div>
    </Container>
  );
};
export default ShowsGrid;
