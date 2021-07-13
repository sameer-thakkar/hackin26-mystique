import { RichText } from 'prismic-reactjs';
import Banner, { BannerLayout } from 'components/GlobalMbs/Banners/Banner';
import CollectionTabs from 'components/GlobalMbs/collectionTabs';
import Conditional from 'components/common/Conditional';

const CityPage = (props) => {
  const breadcrumbs = [];
  const { cityCollections, currencies, body: slices } = props || {};
  // Banner
  const bannerSlice = slices?.length
    ? slices
        ?.filter((slice) => slice?.slice_type === 'banner')
        ?.reduce((acc, curr) => acc + curr)
    : [];
  const bannerImages = cityCollections?.slice(0, 5)?.map((item) => {
    return {
      url: item?.data?.images?.[0]?.image_url,
      altText: item?.data?.images?.[0]?.alt_text,
    };
  });

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
        cardType={BannerLayout.fullWidth}
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
