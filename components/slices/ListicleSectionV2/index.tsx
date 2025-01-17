import React, { useContext, useEffect, useMemo, useState } from 'react';
import { SliceZone } from '@prismicio/react';
import cloneDeep from 'lodash.clonedeep';
import { IListicleSectionProps } from 'components/slices/ListicleSectionV2/interfaces';
import {
  ListicleSectionWrapper,
  Title,
} from 'components/slices/ListicleSectionV2/styles';
import { MBContext } from 'contexts/MBContext';
import { getAlternateLanguageDocUid, getHeadoutLanguagelocale } from 'utils';
import { generateSidenavId } from 'utils/helper';
import { getExperienceType } from 'utils/listicle';
import { convertUidToUrl } from 'utils/urlUtils';
import { EXPERIENCES, LANGUAGE_MAP, MB_TYPES } from 'const/index';
import { sliceComponents } from '../sliceManager';

const ListicleSectionV2: React.FC<
  React.PropsWithChildren<IListicleSectionProps>
> = ({
  type,
  settings,
  title,
  prismicDocsForListicle,
  collectionsInListicles,
  childSlices: slices = [],
}) => {
  const { lang } = useContext(MBContext);
  const langCode = getHeadoutLanguagelocale(lang);
  const [newSlices, setNewSlices] = useState<Array<any>>([]);

  const getExperienceId = (
    experience: Record<string, any>,
    experienceType: string | null
  ) => {
    switch (experienceType) {
      case EXPERIENCES.COLLECTION:
        return experience?.collection_id;
      case EXPERIENCES.CATEGORY:
        return experience?.category;
      case EXPERIENCES.SUBCATEGORY:
        return experience?.subcategory;
      default:
        return '';
    }
  };

  const getValidMBTypes = (experienceType: string | null) => {
    switch (experienceType) {
      case EXPERIENCES.COLLECTION:
        return [
          MB_TYPES.C1_COLLECTION,
          MB_TYPES.B1_GLOBAL,
          MB_TYPES.A2_CATEGORY,
          MB_TYPES.A2_SUB_CATEGORY,
          MB_TYPES.A1_COLLECTION,
          MB_TYPES.A1_CATEGORY,
          MB_TYPES.A1_SUB_CATEGORY,
        ];
      case EXPERIENCES.CATEGORY:
        return [MB_TYPES.A1_CATEGORY, MB_TYPES.A2_CATEGORY];
      case EXPERIENCES.SUBCATEGORY:
        return [MB_TYPES.A1_SUB_CATEGORY, MB_TYPES.A2_SUB_CATEGORY];
      default:
        return [];
    }
  };

  const isRequiredPrismicDoc = (
    doc: Record<any, any>,
    experience: Record<any, any>
  ) => {
    const experienceType = getExperienceType(experience);
    const experienceId = getExperienceId(experience, experienceType);

    if (!experienceId) return false;

    const { city } = experience;
    const { data } = doc || {};
    const {
      tagged_mb_type,
      tagged_category,
      tagged_sub_category,
      tagged_collection,
      tagged_city,
    } = data || {};

    let validMBTypes = getValidMBTypes(experienceType);

    switch (experienceType) {
      case EXPERIENCES.COLLECTION: {
        return (
          tagged_collection === experienceId &&
          validMBTypes.includes(tagged_mb_type) &&
          city === tagged_city
        );
      }
      case EXPERIENCES.CATEGORY: {
        return (
          tagged_category === experienceId &&
          validMBTypes.includes(tagged_mb_type) &&
          city === tagged_city
        );
      }
      case EXPERIENCES.SUBCATEGORY: {
        return (
          tagged_sub_category === experienceId &&
          validMBTypes.includes(tagged_mb_type) &&
          city === tagged_city
        );
      }
      default:
        return false;
    }
  };

  useEffect(() => {
    if (slices[0]?.length === 0) return;

    let finalSliceItems = [];
    let finalSlices = cloneDeep(slices);
    finalSliceItems = cloneDeep(slices[0].items);

    if (prismicDocsForListicle && prismicDocsForListicle?.length > 0) {
      finalSliceItems.forEach((item: Record<any, any>) => {
        let result: Array<any> = [];
        result = prismicDocsForListicle.filter((doc: Record<any, any>) =>
          isRequiredPrismicDoc(doc, item)
        );
        if (result?.length > 0) {
          const { cta_link } = item || {};
          const { url } = cta_link || {};
          const { uid } = result[0] || {};

          let secondaryUrl = '';

          if (lang !== LANGUAGE_MAP.en.code) {
            const altLanguageDocUid = getAlternateLanguageDocUid({
              doc: result[0],
              lang: langCode,
            });
            secondaryUrl = convertUidToUrl({
              uid: altLanguageDocUid || uid,
              lang: altLanguageDocUid ? lang : LANGUAGE_MAP.en.code,
            });
          } else {
            secondaryUrl = convertUidToUrl({
              uid,
              lang,
            });
          }
          item.cta_link.url = url || secondaryUrl;
        }
      });
    }

    if (collectionsInListicles && collectionsInListicles?.length > 0) {
      const map = new Map();
      collectionsInListicles.forEach((item: Record<any, any>) => {
        const { id, cardImageUrl, heroImageUrl, heading, startingPrice } =
          item || {};
        const { listingPrice } = startingPrice || {};

        map.set(id, {
          image: cardImageUrl || heroImageUrl,
          heading,
          minPrice: listingPrice || null,
        });
      });

      finalSliceItems.forEach((item: Record<any, any>) => {
        const { collection_id, cta_text, card_heading, card_image } =
          item || {};
        const { url } = card_image || {};
        if (map.has(parseInt(collection_id))) {
          const data = map.get(parseInt(collection_id));
          const { image, heading, minPrice } = data || {};
          item.card_image.url = url || image;
          item.card_heading = card_heading || heading;
          item.cta_text = cta_text || minPrice;
        }
      });
    }
    if (finalSlices?.length > 0) {
      finalSlices[0].items = finalSliceItems;
      setNewSlices(finalSlices);
    }
  }, []);

  const components = useMemo(() => {
    return sliceComponents();
  }, []);

  return (
    <ListicleSectionWrapper>
      <Title id={generateSidenavId(title)}>{title}</Title>
      {newSlices?.length > 0 && (
        <SliceZone
          slices={newSlices}
          components={components}
          context={{ type, settings, title, wrapperType: 'none' }}
          defaultComponent={() => null}
        />
      )}
    </ListicleSectionWrapper>
  );
};

export default ListicleSectionV2;
