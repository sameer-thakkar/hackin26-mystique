import Conditional from 'components/common/Conditional';
import Banner from 'components/GlobalMbs/Banners/HomePageBanner';
import TopDestinationsCarousel from 'components/GlobalMbs/Carousels/TopDestinationsCarousel';
import sliceHandler from 'components/Slices';

const HomePage = (props) => {
  const {
    banner_images: bannerImages,
    banner_subtext: bannerSubText,
    banner_title: bannerTitle,
    cityCollections,
    collections,
    body: slices,
    mb_type,
  } = props || {};

  const images = bannerImages?.map((image) => ({
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
      {slices?.map((slice) => sliceHandler(slice, { collections }))}
    </>
  );
};

export default HomePage;
