import Banner from 'components/GlobalMbs/Banners/Banner/index';
import { BannerLayout } from 'components/GlobalMbs/Banners/Banner/interface';
import { convertUidToUrl } from 'utils/urlUtils';

const CollectionPage = (props: any) => {
  const bannerImages = props?.images
    ?.filter((image: any) => image?.image_url)
    .map((img: any) => {
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
    secondary_categories: secondaryCategories,
    official_website: officialWebsite,
    timings,
    suggested_duration: duration,
    headout_category_id: categoryID,
    headout_collection_id: collectionID,
    headout_tgid: tgid,
    supply,
    tickets,
    isDev,
    host,
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
    secondaryCategories,
    officialWebsite,
    timings,
    duration,
    categoryID,
    collectionID,
    tgid,
    supply,
    ticketsPageLink: props?.ticketsPage?.uid,
    ...(props?.cityCollectionRanks?.length && {
      rank: rank,
      totalCityCollections: props?.totalCityCollections,
    }),
  };
  const breadcrumbs = [
    {
      url: convertUidToUrl({ uid: countryUID, isDev, hostname: host }),
      text: country,
    },
    {
      url: convertUidToUrl({ uid: cityUID, isDev, hostname: host }),
      text: city,
    },
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
      />
    </>
  );
};

export default CollectionPage;
