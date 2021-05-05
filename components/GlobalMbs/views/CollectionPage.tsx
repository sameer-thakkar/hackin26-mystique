import Banner from 'components/GlobalMbs/Banner';
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
    tickets: {
      startingPrice,
      currencySymbol: { localSymbol: currencySymbol },
    },
  } = props;

  const price = `${currencySymbol} ${startingPrice}`;

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
    { url: convertUidToUrl(countryUID), text: country },
    { url: convertUidToUrl(cityUID), text: city },
  ];
  const type = 'full-width';

  return (
    <>
      <Banner
        title={collectionName}
        images={bannerImages}
        cardType={type}
        breadcrumbs={breadcrumbs}
        collection={collectionInfo}
        startingPrice={price}
      />
    </>
  );
};

export default CollectionPage;
