import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { asLink } from '@prismicio/helpers';
import { AlternateLanguage } from '@prismicio/types';
import { getCatSubCatMedia } from 'components/CityPageContainer/utils';
import { TourGroupDataType } from 'components/NewsPage/interface';
import { getShowsBasedOnTimestamp } from 'components/VenuePage/utils';
import { getHeadoutLanguagecode, handleSettledPromiseResults } from 'utils';
import {
  fetchBulkPoisInfo,
  fetchCategory,
  fetchMediaResource,
  fetchTourGroupMedia,
  fetchTourGroupsByCollection,
  fetchTourGroupSlots,
  fetchTourListV6,
} from 'utils/apiUtils';
import { findImageUrlFromMediaData, getSubCategoryIconUrl } from 'utils/helper';
import { getShowPageCollectionsByTgid } from 'utils/prismicUtils/getShowPageCollections';
import getVenuePageDocumentsByPoiId from 'utils/prismicUtils/getVenuePageDocumentsByPoiId';
import { filterArticlesBasedOnEntMb as filterSubCategoriesBasedOnEntMb } from 'utils/prismicUtils/NewsPage';
import { addLanguageParamToUrl, convertUidToUrl } from 'utils/urlUtils';
import {
  CUSTOM_TYPES,
  MB_CATEGORISATION,
  PRISMIC_FIELD_ID,
  TLANGUAGELOCALE,
  TOUR_GROUP_MEDIA_RESOURCE_TYPE,
} from 'const/index';

type TGetAllShowsDataPromiseProps = {
  poiId: number;
  cookies: any;
  language: TLANGUAGELOCALE;
  hostname: string;
};

export const getEntertainmentSubCategories = (
  categories: Record<string, any>[]
) => {
  const subCategoriesName: string[] = [];
  const localisedSubCategoriesName: Record<string, string> = {};
  const entertainmentCategory = categories.find(
    (c: Record<string, any>) => c.name === 'Entertainment'
  );
  const entertainmentSubcategories = entertainmentCategory?.subCategories;

  entertainmentSubcategories.forEach((sc: Record<string, any>) => {
    subCategoriesName.push(sc.name);
    localisedSubCategoriesName[sc.name] = sc.displayName;
  });

  return {
    subCategoriesName,
    localisedSubCategoriesName,
    subCategoriesData: entertainmentSubcategories,
  };
};

export const getAllTgidsInsidePoiData = (poiData: any) => {
  return poiData?.reduce((acc: any, curr: any) => {
    if (curr?.linkedTourGroups) {
      return [...curr?.linkedTourGroups, ...acc];
    }
    return acc;
  }, []);
};

export const getAllShowsData = async ({
  poiId,
  cookies,
  language,
  hostname,
}: TGetAllShowsDataPromiseProps) => {
  const poiData = await fetchBulkPoisInfo({
    poiIds: [String(poiId)],
    language,
    cookies,
  });

  const { linkedTourGroups } = poiData?.pois[0] ?? {};

  const showPageDocuments =
    linkedTourGroups?.length > 0
      ? await getShowPageCollectionsByTgid({
          tgids: linkedTourGroups,
          pageSize: 100,
        })
      : [];
  const allShowPageUids = showPageDocuments?.map((document: any) => {
    const tgid = document.data?.tgid;
    return {
      [tgid]: {
        uid: document.uid,
        alternateLanguages: document.alternate_languages.map(
          (langObj: AlternateLanguage) => langObj.lang
        ),
      },
    };
  });
  const showsData = await fetchTourListV6({
    tgids: linkedTourGroups,
    hostname,
    language: getHeadoutLanguagecode(language),
    cookies,
  });

  const availableShowsData = showsData?.tourGroups;
  const tgidForFirstShow = availableShowsData[0];

  const inventorySlotData = tgidForFirstShow
    ? await fetchTourGroupSlots({
        tgid: tgidForFirstShow?.id,
        hostname,
        forDays: 20,
        cookies,
      })
    : {};

  return {
    allShowPageUids,
    availableShowsData: showsData?.tourGroups,
    inventorySlotData,
  };
};

export const getNearbyTheatresData = async (
  nearbyTheatreSliceData: Record<string, any>,
  cookies: any,
  language: TLANGUAGELOCALE,
  hostname: string
) => {
  const { items } = nearbyTheatreSliceData ?? {};

  const poiIds = items?.reduce((acc: [], curr: Record<string, any>) => {
    if (curr?.nearby_theatre_poi_id) {
      return [...acc, curr?.nearby_theatre_poi_id];
    }
  }, []);

  const bulkPoiData = await fetchBulkPoisInfo({
    poiIds,
    language,
    cookies,
  });

  const resultPromise = bulkPoiData?.pois?.map(
    async (poiData: Record<string, any>) => {
      const { linkedTourGroups } = poiData ?? {};
      const showsData = await fetchTourListV6({
        tgids: linkedTourGroups,
        hostname,
        language: getHeadoutLanguagecode(language),
        cookies,
      });
      const availableShowsData = showsData?.tourGroups;
      const { nowPlayingShows } = getShowsBasedOnTimestamp(availableShowsData);

      if (!nowPlayingShows?.length) return;

      const nearbyTheatreName = poiData?.name ?? '';
      const nearbyTheatreRunningShowName = nowPlayingShows?.[0]?.name ?? '';
      const nearbyTheatreShowId = nowPlayingShows?.[0]?.id;
      const nearbyTheatreRedirectUrl = items?.find(
        (item: Record<string, any>) =>
          item?.nearby_theatre_poi_id === poiData?.id
      )?.redirect_url?.url;

      const mediaData = nearbyTheatreShowId
        ? await fetchMediaResource({
            language: getHeadoutLanguagecode(language),
            resourceType: 'MB_EXPERIENCE',
            entityIds: String(nearbyTheatreShowId),
          })
        : undefined;

      const verticalImageUrl = mediaData
        ? findImageUrlFromMediaData(
            mediaData?.resourceEntityMedias[0]?.medias
          ) ?? ''
        : '';

      return {
        nearbyTheatreName,
        nearbyTheatreRunningShowName,
        verticalImageUrl,
        redirectUrl: addLanguageParamToUrl({
          url: nearbyTheatreRedirectUrl,
          lang: getHeadoutLanguagecode(language),
          isProd: true,
        }),
      };
    }
  );
  const allPromiseSettledResults = await Promise.allSettled(resultPromise);

  const [...result] = handleSettledPromiseResults(allPromiseSettledResults);

  return result;
};

export const getLandingPageGroups = async (
  landingPageGroups: Record<string, any>[],
  cookies: any,
  lang: TLANGUAGELOCALE,
  hostname: string
) => {
  const landingPagePromise = landingPageGroups.map(async (landingPageGroup) => {
    const { group_name, poi_ids: commaSeparatePoiIds } = landingPageGroup;
    const poiIds = commaSeparatePoiIds
      ?.split(',')
      .filter((id: string) => id.trim())
      .map((poiId: string) => Number(poiId));

    const poiData = await fetchBulkPoisInfo({
      poiIds,
      language: lang,
      cookies,
    });

    const venuePageDocs = await getVenuePageDocumentsByPoiId({
      poiIds,
      pageSize: 100,
    });

    const theatresDataPromise = poiIds?.map(async (poiId: string) => {
      const poiApiData = poiData?.pois?.find(
        (poi: Record<string, any>) => poi?.id == poiId
      );
      const venuePageDocData = venuePageDocs?.find(
        (venuePageDoc: Record<string, any>) => {
          return venuePageDoc?.data?.poi_id == poiId;
        }
      );
      const showsData = await fetchTourListV6({
        tgids: poiApiData?.linkedTourGroups,
        hostname,
        language: getHeadoutLanguagecode(lang),
        cookies,
      });
      const showPageDocuments = poiApiData?.linkedTourGroups?.length
        ? await getShowPageCollectionsByTgid({
            tgids: poiApiData?.linkedTourGroups,
            pageSize: 100,
          })
        : [];

      const mediaData = await fetchMediaResource({
        language: getHeadoutLanguagecode(lang),
        resourceType: 'MB_EXPERIENCE',
        entityIds: poiApiData?.linkedTourGroups?.join(','),
      });

      const availableShowsData = showsData?.tourGroups;
      const { nowPlayingShows } = getShowsBasedOnTimestamp(availableShowsData);

      const { name, seatingCapacity } = poiApiData ?? {};
      const { data, uid } = venuePageDocData ?? {};
      const {
        desktop_banner,
        seating_plan,
        theatre_location_cta,
        theatre_location_url,
      } = data ?? {};

      return {
        poiId,
        seatingCapacity,
        nowPlayingShows,
        uid,
        theatreName: name,
        mediaData,
        showPageDocuments,
        theatreLocation: theatre_location_cta,
        theatreImage: asLink(desktop_banner),
        seatingPageLink: asLink(seating_plan),
        theatreLocationCta: asLink(theatre_location_url),
      };
    });
    const allPromiseSettledResults = await Promise.allSettled(
      theatresDataPromise
    );
    const theatresData = handleSettledPromiseResults(allPromiseSettledResults);

    return {
      groupName: group_name,
      theatresData,
    };
  });
  const allPromiseSettledResults = await Promise.allSettled(landingPagePromise);
  const landingPageData = handleSettledPromiseResults(allPromiseSettledResults);

  return landingPageData;
};

export const getPopularShows = async (
  collectionId: number,
  hostname: string,
  cookies: any,
  lang: string
) => {
  const showsTgid = new Set();
  const prismicClient = createClient();

  const collectionApiData = await fetchTourGroupsByCollection({
    collectionId,
    hostname,
    cookies,
    language: getHeadoutLanguagecode(lang),
  });

  const collectionData = collectionApiData?.pageData?.items;

  collectionData?.forEach((item: TourGroupDataType) => {
    showsTgid.add(item.id);
  });

  const mediaData = await fetchTourGroupMedia({
    hostname,
    tgids: Array.from(showsTgid) as number[],
    cookies,
    resourceType: TOUR_GROUP_MEDIA_RESOURCE_TYPE.MB_EXPERIENCE,
  });

  const showPageDocuments = await prismicClient.getAllByType('showpage', {
    predicates: [
      predicate.any(
        `my.${CUSTOM_TYPES.SHOW_PAGE}.tgid`,
        Array.from(showsTgid) as number[]
      ),
    ],
  });

  return {
    showPageDocuments,
    subCategoryData: collectionData,
    mediaData,
  };
};

export const getCategories = async (
  taggedCity: string,
  lang: string,
  cookies: any,
  uid: string
) => {
  const prismicClient = createClient();
  const categoryData = await fetchCategory({
    city: taggedCity,
    language: getHeadoutLanguagecode(lang),
    cookies,
  });

  const { subCategoriesName, localisedSubCategoriesName, subCategoriesData } =
    getEntertainmentSubCategories(categoryData?.categories);

  const subCategoriesPrismic = await prismicClient.getAllByType('microsite', {
    predicates: [
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
        taggedCity
      ),
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CATEGORY}`,
        MB_CATEGORISATION.CATEGORY.ENTERTAINMENT
      ),
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.IS_ENTERTAINMENT_MB}`,
        true
      ),
      predicate.any(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_SUB_CATEGORY}`,
        subCategoriesName
      ),
    ],
  });
  const filteredSubCategories = filterSubCategoriesBasedOnEntMb(
    subCategoriesPrismic,
    uid
  );
  const filteredSubCategoriesData = filteredSubCategories.map((sc) => {
    const subCategory = sc?.data?.tagged_sub_category;
    const localisedScName = localisedSubCategoriesName[subCategory];

    const subCategoryData = subCategoriesData?.find(
      (sub: any) => sub.name === subCategory
    );
    const subCategoryUrl = convertUidToUrl({
      uid: sc.uid,
      lang: getHeadoutLanguagecode(lang),
      isDev: false,
      hostname: '',
    });
    const imageUrl = getCatSubCatMedia(
      subCategoriesData?.find((sub: any) => sub.name === subCategory)
    )?.imageUrl;

    const svgIcon = getSubCategoryIconUrl(subCategoryData?.id);

    return {
      subCategoryUrl,
      imageUrl,
      svgIcon,
      localisedScName,
    };
  });

  return {
    subCategoriesData: filteredSubCategoriesData,
  };
};
