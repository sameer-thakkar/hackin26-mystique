import { SliceZone } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import Banner from 'components/GlobalMbs/Banners/HomePageBanner';
import TopDestinationsCarousel from 'components/GlobalMbs/Carousels/TopDestinationsCarousel';
import { sliceComponents } from 'components/slices/sliceManager';

const HomePage = (props: any) => {
  const {
    banner_images: bannerImages,
    banner_subtext: bannerSubText,
    banner_title: bannerTitle,
    cityCollections,
    collections,
    body: slices,
    mb_type,
    isDev,
  } = props || {};

  const images = bannerImages?.map((image: any) => ({
    url: image?.image_url?.url,
    altText: image?.alt_text,
  }));
  return (
    <>
      <Banner
        images={images}
        title={bannerTitle}
        subText={bannerSubText}
        mbType={mb_type}
      />
      <Conditional if={cityCollections?.length}>
        <TopDestinationsCarousel destinations={cityCollections} />
      </Conditional>
      <SliceZone
        slices={slices}
        components={sliceComponents()}
        context={{ collections, isDev, wrapperType: 'none' }}
        defaultComponent={() => null}
      />
    </>
  );
};

export default HomePage;
