import Head from 'next/head';
import { ProductJsonLd } from 'next-seo';
import { useRecoilValue } from 'recoil';
import PopulateMeta from 'components/common/NextSeoMeta';
import { TShowPageV2Props } from 'components/MicrositeV2/ShowPageV2/ShowPageSeoComponents/interface';
import { parseShowPageData } from 'components/ShowPages/parseShowPage';
import { getAlternateLanguages, getHeadoutLanguagecode } from 'utils';
import { getUniqueArrayItemsBy } from 'utils/arrayUtils';
import { getDurationISO } from 'utils/dateUtils';
import { getProductSchema } from 'utils/schemaUtils';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';
import { currencyAtom } from 'store/atoms/currency';
import { strings } from 'const/strings';

const ShowPageSeoComponents = ({
  CMSContent,
  tourGroupData,
  inventorySlotData,
  isDev,
  isMobile,
  host,
  serverRequestStartTimestamp,
  domainConfig,
}: TShowPageV2Props) => {
  const currency = useRecoilValue(currencyAtom);
  const {
    uid,
    first_publication_date: datePublished,
    last_publication_date: dateModified,
    data: CMSData,
    alternate_languages,
    lang,
    commonHeader,
  } = CMSContent;

  const { canonical_link } = CMSData;
  const {
    name,
    listingPrice,
    microBrandsHighlight,
    imageUploads,
    topReviews,
    reviewsDetails,
    city,
    startLocation,
    endLocation,
  } = tourGroupData || {};
  const currentLanguage = getHeadoutLanguagecode(lang);
  const selfCanonicalLink = convertUidToUrl({ uid, lang: currentLanguage });
  const alternateLanguages = getAlternateLanguages(
    alternate_languages,
    isDev,
    host,
    uid
  );
  const { slots }: SimplifiedSlotsData = inventorySlotData || {};
  const [bannerImageOne, bannerImageTwo] = imageUploads || [];
  const bannerImages = [
    {
      url: getValidUrl(bannerImageTwo?.url) || getValidUrl(bannerImageOne?.url),
      alt: name,
    },
  ];
  const { faviconUrl, logo: { logoUrl = '' } = {} } = domainConfig || {};
  const productSchema = getProductSchema({
    productName: name,
    price: listingPrice?.finalPrice,
    currencySymbol: currency || '',
    images: imageUploads,
    topReviews,
    reviewsDetails,
  });
  const uniqueDateTimeSlots = getUniqueArrayItemsBy(slots, [
    'startDate',
    'startTime',
  ]);
  const { tabSchemaHighlight, detailsObjects, aboutTheatreSection } =
    parseShowPageData(microBrandsHighlight);
  const productImages = imageUploads?.map((image: any) => image?.url);
  const showDescription = tabSchemaHighlight?.[0]?.tab_content?.[0]?.text;
  const showDuration = detailsObjects?.[strings.SHOW_PAGE.DURATION];
  const showDurationISO = getDurationISO(showDuration);
  const theatreSeatingCapacity = (
    aboutTheatreSection as any
  )?.tab_content[1]?.text?.split(' ')[2];
  const pageUrl = convertUidToUrl({
    uid,
    lang: currentLanguage,
    isDev,
    hostname: host,
  });
  const { addressLine1, addressLine2, postalCode, cityName, state } =
    startLocation || endLocation || {};
  let offerSchema: any = [];

  const eventSchemaMarkup = uniqueDateTimeSlots
    ?.slice(0, 30)
    ?.map((slot) => {
      const { endTime, startTime, startDate } = slot || {};
      return `
    {
      "@context": "https://schema.org",
      "@type": "TheaterEvent",
      "name": "${name}",
      "description": "${showDescription}",
      "inLanguage": "English",
      "image": [${productImages?.map((image: any) => `"${image}"`)}],
      "startDate": "${startDate}T${startTime}",
      "duration": "${showDurationISO}",
      "endDate": "${startDate}T${endTime}",
      "maximumAttendeeCapacity": "${theatreSeatingCapacity}",
      "typicalAgeRange": "${detailsObjects?.[strings.SHOW_PAGE.AGE_LIMIT]}",
      "url": "${pageUrl}",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": "${addressLine1}",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "${addressLine1}",
          "addressLocality": "${addressLine2}",
          "postalCode": "${postalCode}",
          "addressRegion": "${state ?? cityName}",
          "addressCountry": "${city?.country?.code}"
        }
      },
      "performer": {
        "@type": "TheaterGroup",
        "name": "${name} Cast"
      },
      "offers": [${offerSchema?.map(
        (
          // @ts-expect-error TS(7006): Parameter 'variant' implicitly has an 'any' type.
          variant
        ) => JSON.stringify(variant)
      )}]
    }`;
    })
    ?.join(',');

  return (
    <>
      <PopulateMeta
        {...{
          prismicData: {
            ...CMSData,
            ...commonHeader?.data,
            ...{
              canonical_link: canonical_link || selfCanonicalLink,
            },
          },
          datePublished,
          dateModified,
          serverRequestStartTimestamp,
          languages: alternateLanguages,
          isMobile,
          bannerImages,
          faviconUrl,
          logoUrl: logoUrl,
        }}
      />
      {/* @ts-expect-error TS(2322): Type '{ reviews?: { author: { type: string; name: ... Remove this comment to see the full error message */}
      <ProductJsonLd {...productSchema} />
      <Head>
        <script
          dangerouslySetInnerHTML={{ __html: `[${eventSchemaMarkup}]` }}
          type="application/ld+json"
        />
      </Head>
    </>
  );
};

export default ShowPageSeoComponents;
