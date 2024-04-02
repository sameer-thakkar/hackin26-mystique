import { getShowsBasedOnTimestamp } from 'components/VenuePage/utils';
import { getHeadoutLanguagecode, handleSettledPromiseResults } from 'utils';
import {
  fetchBulkPoisInfo,
  fetchMediaResource,
  fetchTourGroupSlots,
  fetchTourListV6,
} from 'utils/apiUtils';
import { findImageUrlFromMediaData } from 'utils/helper';
import { getShowPageCollectionsByTgid } from 'utils/prismicUtils/getShowPageCollections';
import { TLANGUAGELOCALE } from 'const/index';

type TGetAllShowsDataPromiseProps = {
  poiId: number;
  cookies: any;
  language: TLANGUAGELOCALE;
  hostname: string;
};

export const getAllShowsDataPromise = async ({
  poiId,
  cookies,
  language,
  hostname,
}: TGetAllShowsDataPromiseProps) => {
  let filteredTgids;
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
          lang: language,
        })
      : [];

  filteredTgids = showPageDocuments?.reduce((acc: any, curr: any) => {
    if (curr?.data?.tgid) {
      return [curr?.data?.tgid, ...acc];
    }
  }, []);

  const allShowPageUids = showPageDocuments?.map((document: any) => {
    const tgid = document.data?.tgid;
    return {
      [tgid]: document.uid,
    };
  });

  const showsData = await fetchTourListV6({
    tgids: filteredTgids as number[],
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
    availableShowsData,
    inventorySlotData,
  };
};

export const getNearbyTheatresDataPromise = async (
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
    return acc;
  }, []);

  const bulkPoiData = await fetchBulkPoisInfo({
    poiIds,
    language,
    cookies,
  });

  const resultPromise = bulkPoiData?.pois?.map(
    async (poiData: Record<string, any>) => {
      const { linkedTourGroups } = poiData ?? {};

      const showsData =
        linkedTourGroups?.length > 0
          ? await fetchTourListV6({
              tgids: linkedTourGroups,
              hostname,
              language: getHeadoutLanguagecode(language),
              cookies,
            })
          : [];
      const availableShowsData = showsData?.tourGroups;
      const { nowPlayingShows } = getShowsBasedOnTimestamp(availableShowsData);

      if (nowPlayingShows?.length == 0) {
        return;
      }

      const nearbyTheatreName = poiData?.name ?? '';
      const nearbyTheatreRunningShowName = nowPlayingShows[0]?.name ?? '';
      const nearbyTheatreShowId = nowPlayingShows[0]?.id;
      const nearbyTheatreRedirectUrl = items?.find(
        (item: Record<string, any>) =>
          item?.nearby_theatre_poi_id === poiData?.id
      )?.redirect_url?.url;

      const mediaData = nearbyTheatreShowId
        ? await fetchMediaResource({
            language: getHeadoutLanguagecode(language),
            resourceType: 'MB_EXPERIENCE',
            entityIds: nearbyTheatreShowId,
          })
        : undefined;

      const verticalImageUrl = mediaData?.resourceEntityMedias[0]?.medias
        ? findImageUrlFromMediaData(
            mediaData?.resourceEntityMedias[0]?.medias
          ) ?? ''
        : '';

      return {
        nearbyTheatreName,
        nearbyTheatreRunningShowName,
        verticalImageUrl,
        redirectUrl: nearbyTheatreRedirectUrl,
      };
    }
  );
  const allPromiseSettledResults = await Promise.allSettled(resultPromise);

  const [...result] = handleSettledPromiseResults(allPromiseSettledResults);

  return result;
};
