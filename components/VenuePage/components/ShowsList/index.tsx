import { memo, useContext } from 'react';
import Conditional from 'components/common/Conditional';
import Product from 'components/MicrositeV2/Product';
import PinnedCard from 'components/PinnedCard/pinnedCard';
import { Container } from 'components/VenuePage/components/ShowsList/styles';
import { MBContext } from 'contexts/MBContext';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { IShowsListProps } from './interface';

const ShowsList = (props: IShowsListProps) => {
  const { host } = useContext(MBContext);
  const { isMobile, heading, data, uid, allShowPageUids } = props;

  const findUid = (tgid: string) => {
    return allShowPageUids?.reduce((acc: any, curr: any) => {
      const result = curr[tgid] || '';
      return (acc = acc + result);
    }, '');
  };

  return (
    <Conditional if={data?.length > 0}>
      <Container>
        <h2>{heading}</h2>
        <div className="wrapper">
          {data?.map((show: any, index: number) => {
            const allTours: any = {};
            const tgid = show.id;
            allTours[tgid] = show;
            allTours[tgid].productImage = show.imageUrl;
            allTours[tgid].secondaryDescriptors = show.descriptors ?? [];

            const showPageUid = findUid(tgid);

            return data?.length === 1 && !isMobile ? (
              <PinnedCard
                key={index}
                productInfo={show}
                uid={uid}
                showPageUid={showPageUid}
              />
            ) : (
              <div className="product-card" key={index}>
                <Product
                  tgid={tgid}
                  allTours={allTours}
                  isMobile={isMobile}
                  host={host}
                  isEntertainmentMb
                  isV3Design={false}
                  imageId={tgid}
                  showPriceBlock
                  showSecondaryDescriptors={!isMobile}
                  productCardStyles={{
                    singleCard: true,
                    categoryFontSize: expandFontToken(FONTS.SUBHEADING_XS),
                    productCardHeight: isMobile ? '204' : '176',
                  }}
                  showPageUid={showPageUid}
                  isVenuePage
                />
              </div>
            );
          })}
        </div>
      </Container>
    </Conditional>
  );
};
export default memo(ShowsList);
