import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import { getHeadoutLanguagecode } from 'utils';
import { fetchCollectionTop } from 'utils/apiUtils';
import { sendLog } from 'utils/logger';
import {
  CUSTOM_TYPES,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
} from 'const/index';
import getRankedDocuments from './getRankedDocuments';
import shouldIncludeinQueries from './shouldIncludeInQueries';
import { getMenuName, getMenuUrl } from '.';

const generateCityAttractionsMenu = async ({
  categorisationMetadata,
  lang,
}: {
  categorisationMetadata: TCategorisationMetadata;
  lang: string;
}) => {
  try {
    const {
      tagged_city: mbCity,
      tagged_collection: mbCollection,
      tagged_mb_type: mbType,
    } = categorisationMetadata;
    const menuName = getMenuName({ mbType });

    if (!mbCity) return { [menuName]: {} };

    const { pageData: topCollectionsData } =
      (await fetchCollectionTop({
        city: mbCity || '',
        limit: 20,
        language: getHeadoutLanguagecode(lang),
      })) || {};

    const topCollectionsIds = topCollectionsData?.items?.map(
      (collection: Record<string, any>) => collection.id.toString()
    );

    if (!topCollectionsIds) return { [menuName]: {} };

    const predicatesArray = [
      predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
      predicate.at(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_PAGE_TYPE}`,
        MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE
      ),
      predicate.any(
        `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_COLLECTION}`,
        topCollectionsIds || []
      ),
    ];

    if (mbCollection) {
      predicatesArray.push(
        predicate.not(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_COLLECTION}`,
          mbCollection
        )
      );
    }

    if (mbCity) {
      predicatesArray.push(
        predicate.at(
          `my.${CUSTOM_TYPES.MICROSITE}.${PRISMIC_FIELD_ID.TAGGED_CITY}`,
          mbCity
        )
      );
    }

    const prismicClient = createClient();
    const filteredMicrosites = await prismicClient.getAllByType('microsite', {
      predicates: predicatesArray,
      pageSize: 100,
    });

    const docsStore = getRankedDocuments({ docs: filteredMicrosites });

    const menu = topCollectionsData?.items?.reduce(
      (
        acc: Record<string, any>,
        collection: Record<string, any>,
        index: number
      ) => {
        const docFound = docsStore?.find(
          (doc) =>
            collection?.id?.toString() === doc?.data?.tagged_collection &&
            shouldIncludeinQueries(doc)
        );

        if (docFound) {
          const url = getMenuUrl({ docFound, lang });
          if (collection.displayName && url) {
            return {
              ...acc,
              [`COLLECTION_${index + 1}`]: {
                label: collection.displayName,
                url,
                collectionId: collection?.id,
                collectionData: collection,
              },
            };
          }
        }
        return acc;
      },
      {}
    );

    return { [menuName]: menu };
  } catch (error) {
    sendLog({
      err: error,
      message: `generateCityAttractionsMenu failed`,
    });
  }
};

export default generateCityAttractionsMenu;
