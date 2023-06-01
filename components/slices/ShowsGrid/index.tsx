import Product from 'components/MicrositeV2/Product';
import { Container } from 'components/slices/ShowsGrid/styles';
import { ShowsGridProps } from 'components/slices/ShowsGrid/interface';

const ShowsGrid = (props: ShowsGridProps) => {
  const { data, isMobile, heading } = props;

  return (
    <Container>
      <h2>{heading}</h2>
      <div className="wrapper">
        {data?.map((show: Record<string, string>, index: number) => {
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
