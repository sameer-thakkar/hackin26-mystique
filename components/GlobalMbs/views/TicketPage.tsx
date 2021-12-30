import Banner, { BannerLayout } from 'components/GlobalMbs/Banners/Banner';
import { strings } from 'const/strings';
import { convertUidToUrl } from 'utils/urlUtils';
import ProductsSection from 'components/GlobalMbs/views/ProductsSection';

const TicketPage = (props) => {
  const {
    global_collection: globalCollection,
    categoryTourListData,
    banner_subtext: bannerSubtext,
    city: { uid: cityUID },
    country: { uid: countryUID },
    isDev,
    host,
  } = props;

  let bannerImages = [];
  Object.values(categoryTourListData?.scorpioData).forEach((element: any) => {
    if (element?.images) {
      bannerImages.push(element?.images?.[0]);
    }
  });

  const {
    data: {
      collection_name: collectionName,
      city_name: city,
      country_name: country,
    },
  } = globalCollection;

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
        title={collectionName + ' ' + strings.TICKETS}
        images={bannerImages}
        breadcrumbs={breadcrumbs}
        cardType={BannerLayout.fullWidth}
        isTicketPage={true}
        subHeading={city + ', ' + country}
        subText={bannerSubtext}
      />
      <ProductsSection {...props} />
    </>
  );
};

export default TicketPage;
