import { memo, useContext } from 'react';
import Conditional from 'components/common/Conditional';
import Product from 'components/MicrositeV2/Product';
import { ShowsGridProps } from 'components/VenuePage/components/ShowsGrid/interface';
import { Container } from 'components/VenuePage/components/ShowsGrid/styles';
import { MBContext } from 'contexts/MBContext';
import { LANGUAGE_MAP, LanguagesUnion } from 'const/index';
import { strings } from 'const/strings';

const ShowsGrid = (props: ShowsGridProps) => {
  const { data, isMobile, allShowPageUids } = props;
  const { host, lang } = useContext(MBContext);
  const currentLang = LANGUAGE_MAP[lang as LanguagesUnion].locale;

  const findUid = (tgid: string) => {
    const showPage = allShowPageUids?.find(
      (element) => Object.keys(element || {})?.[0] == tgid
    );
    const { alternateLanguages, uid } = showPage?.[tgid] || {};
    if (
      currentLang === LANGUAGE_MAP.en.locale ||
      alternateLanguages?.includes(currentLang)
    ) {
      return uid;
    }
  };

  return (
    <Conditional if={data?.length > 0}>
      <Container>
        <h2>{strings.THEATRE_PAGE.PAST_SHOWS}</h2>
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
                  isMobile={isMobile}
                  imageId={tgid}
                  isEntertainmentMb={true}
                  host={host}
                  isV3Design={false}
                  showPriceBlock={false}
                  productCardStyles={{
                    singleCard: true,
                    productCardHeight: isMobile ? 168 : 204,
                  }}
                  isVenuePage
                  showPageUid={findUid(tgid)}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </Conditional>
  );
};
export default memo(ShowsGrid);
