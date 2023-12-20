import { asText } from '@prismicio/helpers';
import Conditional from 'components/common/Conditional';
import Banner from 'components/GlobalMbs/Banners/Banner/index';
import { BannerLayout } from 'components/GlobalMbs/Banners/Banner/interface';
import CollectionTabs from 'components/GlobalMbs/collectionTabs';
import type { ILink } from '../Breadcrumb/interface';

const CityPage = (props: any) => {
  const breadcrumbs: ILink[] = [];
  const { cityCollections, body: slices, ticketPages } = props || {};
  // Banner
  const bannerSlice = slices?.length
    ? slices
        ?.filter((slice: any) => slice?.slice_type === 'banner')
        ?.reduce((acc: any, curr: any) => acc + curr)
    : [];

  const { primary, items: bannerImagesArray } = bannerSlice || {};
  const { banner_sub_text: subText, banner_title: title } = primary || {};
  const bannerImages =
    bannerImagesArray?.map(
      (item: { banner_image?: string; alt_text?: string }) => ({
        url: item?.banner_image,
        altText: item?.alt_text,
      })
    ) || [];

  const bannerSubText = asText(subText) || '';

  const cityName = cityCollections?.[0]?.data?.city_name;
  const collectionTabTitle = cityName ? `Themeparks in ${cityName}` : title;
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
          title={collectionTabTitle}
          ticketPages={ticketPages}
          city={cityName}
        />
      </Conditional>
    </div>
  );
};

export default CityPage;
