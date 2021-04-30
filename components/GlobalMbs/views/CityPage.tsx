import { RichText } from 'prismic-reactjs';

import Banner from '../Banner';
import CollectionTabs from '../collectionTabs';

const CityPage = (props) => {
  const type = 'full-width';
  const breadcrumbs = [];

  // Banner
  const bannerSlice = props?.body?.length
    ? props?.body
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

  const bannerSubText = bannerSlice?.primary?.banner_sub_text
    ? RichText?.asText(bannerSlice?.primary?.banner_sub_text)
    : '';

  // Cards

  const cityCollections = props?.cityCollections;

  return (
    <div>
      <Banner
        title={bannerSlice?.primary?.banner_title}
        images={bannerImages}
        subText={bannerSubText}
        cardType={type}
        breadcrumbs={breadcrumbs}
      />
      <CollectionTabs
        collections={cityCollections}
        title={bannerSlice?.primary?.banner_title}
      />
    </div>
  );
};

export default CityPage;
