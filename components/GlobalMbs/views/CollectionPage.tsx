import Banner, { BannerLayout } from 'components/GlobalMbs/Banners/Banner';
import { convertUidToUrl } from 'utils/urlUtils';

const CollectionPage = (props) => {
  const bannerImages = props?.images
    ?.filter((image) => image?.image_url)
    .map((img) => {
      return {
        url: img?.image_url,
        altText: img?.alt_text,
      };
    });

  const {
    collection_name: collectionName,
    city: { uid: cityUID },
    city_name: city,
    country: { uid: countryUID },
    country_name: country,
    location,
    primary_category: primaryCategory,
    official_website: officialWebsite,
    timings,
    suggested_duration: duration,
    headout_category_id: categoryID,
    supply,
    tickets,
    isDev,
  } = props;

  const { startingPrice, currencySymbol } = tickets || {};

  const { localSymbol: currency } = currencySymbol || {};

  const price = startingPrice && currency ? `${currency} ${startingPrice}` : '';

  const rank =
    props?.cityCollectionRanks?.length > 2
      ? props?.cityCollectionRanks?.indexOf(props?.rank) + 1
      : null;
  const collectionInfo = {
    city,
    location,
    primaryCategory,
    officialWebsite,
    timings,
    duration,
    categoryID,
    supply,
    ticketsPageLink: props?.ticketsPage?.uid,
    ...(props?.cityCollectionRanks?.length && {
      rank: rank,
      totalCityCollections: props?.totalCityCollections,
    }),
  };
  const breadcrumbs = [
    { url: convertUidToUrl({ uid: countryUID, isDev }), text: country },
    { url: convertUidToUrl({ uid: cityUID, isDev }), text: city },
  ];

  return (
    <>
      <Banner
        title={collectionName}
        images={bannerImages}
        breadcrumbs={breadcrumbs}
        collection={collectionInfo}
        startingPrice={price}
        cardType={BannerLayout.fullWidth}
        isDev={isDev}
      />
    </>
  );
};

export default CollectionPage;
