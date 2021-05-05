import { RichText } from 'prismic-reactjs';
import Banner from 'components/GlobalMbs/Banner';
import CollectionTabs from 'components/GlobalMbs/collectionTabs';
import Conditional from 'components/common/Conditional';

const CityPage = (props) => {
  const CARD_TYPE = 'full-width';
  const breadcrumbs = [];
  const { cityCollections, currencies, body: slices } = props || {};
  // Banner
  const bannerSlice = slices?.length
    ? slices
        ?.filter((slice) => slice?.slice_type === 'banner')
        ?.reduce((acc, curr) => acc + curr)
    : [];
  const bannerImages = Object.keys(bannerSlice)
    ? bannerSlice?.items?.map((item) => {
        return {
          url: item?.banner_image,
          altText: item?.alt_text,
        };
      })
    : [];

  const { primary } = bannerSlice || {};
  const { banner_sub_text: subText, banner_title: title } = primary || {};

  const bannerSubText = subText ? RichText?.asText(subText) : '';

  // Cards

  return (
    <div>
      <Banner
        title={title}
        images={bannerImages}
        subText={bannerSubText}
        cardType={CARD_TYPE}
        breadcrumbs={breadcrumbs}
      />
      <Conditional if={cityCollections?.length}>
        <CollectionTabs
          collections={cityCollections}
          title={title}
          currencies={currencies}
        />
      </Conditional>
    </div>
  );
};

export default CityPage;
