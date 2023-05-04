// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import Banner, { BannerLayout } from 'components/GlobalMbs/Banners/Banner';
import CollectionTabs from 'components/GlobalMbs/collectionTabs';
import Conditional from 'components/common/Conditional';

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

  const bannerSubText = subText ? RichText?.asText(subText) : '';

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
