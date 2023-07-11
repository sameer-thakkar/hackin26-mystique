import Banner from 'components/GlobalMbs/Banners/Banner/index';
import { BannerLayout } from 'components/GlobalMbs/Banners/Banner/interface';
import ProductsSection from 'components/GlobalMbs/views/ProductsSection';
import { convertUidToUrl } from 'utils/urlUtils';
import { strings } from 'const/strings';

const TicketPage = (props: any) => {
  const {
    global_collection: globalCollection,
    categoryTourListData,
    banner_subtext: bannerSubtext,
    city: { uid: cityUID },
    country: { uid: countryUID },
    isDev,
    host,
  } = props;

  const availableTours = categoryTourListData?.orderedTours?.map(
    (tour: any) => tour.tgid
  );
  let bannerImages: any = [];
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
        availableTours={availableTours}
      />
      <ProductsSection {...props} />
    </>
  );
};

export default TicketPage;
