import React, { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { IListicleTypeProps } from 'components/slices/ListicleV2/interfaces';
import LargeListicle from 'components/slices/ListicleV2/LargeListicle/index';
import MediumListicle from 'components/slices/ListicleV2/MediumListicle/index';
import SmallListicle from 'components/slices/ListicleV2/SmallListicle/index';
import { MBContext } from 'contexts/MBContext';
import { getLocalisedPrice } from 'utils/currency';
import { getLangObject } from 'utils/helper';
import { getExperienceType } from 'utils/listicle';
import { LISTICLE_TAB_FIELDS } from 'utils/listicle/constants';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import { EXPERIENCES, LISTICLE_TYPE, SETTINGS_TYPE } from 'const/index';
import { strings } from 'const/strings';

const ListicleV2 = ({
  type = LISTICLE_TYPE.SMALL,
  items,
  index,
  settings = SETTINGS_TYPE.SETTINGS_ONE,
  listicleSectionTitle,
}: IListicleTypeProps) => {
  const { lang } = useContext(MBContext);
  const currencyList = useRecoilValue(currencyListAtom);
  const currentLanguage = getLangObject(lang).code;
  const currency = useRecoilValue(currencyAtom);

  const getPracticalInfo = (data: Record<any, any>): PracticalInfo => {
    if (type === LISTICLE_TYPE.SMALL) return {} as PracticalInfo;
    const {
      practical_info_location: location,
      practical_info_opening_hours: openingHours,
      practical_info_distance: distance,
      practical_info_duration: duration,
      practical_info_season: season,
      practical_info_calendar: calendar,
      practical_info_find_it_on_map_link,
    } = data;
    const { url: findItOnMap } = practical_info_find_it_on_map_link;
    return {
      location,
      findItOnMap,
      openingHours,
      distance,
      duration,
      season,
      calendar,
    };
  };

  const getCTAText = (ctaText: string) => {
    if (ctaText === strings.VIEW_DETAILS || !ctaText)
      return strings.VIEW_DETAILS;

    if (isNaN(parseInt(ctaText))) return ctaText;

    return `${strings.FROM} ${getLocalisedPrice({
      price: Number(ctaText),
      currencyCode: currency || 'USD',
      lang: currentLanguage,
      currencyList,
    })}`;
  };

  const getTabData = (data: Record<any, any>) => {
    const tabData = Object.entries(data)
      .filter((item) => LISTICLE_TAB_FIELDS.includes(item[0]))
      .map((item) => item[1]);

    return tabData
      .map((item, index) => {
        if (index % 2 === 0) return { title: item, text: tabData[index + 1] };
      })
      .filter((item) => item?.title || item?.text);
  };

  const getListicleData = (listicleData: Array<any>): Experience[] => {
    return listicleData?.map((data: Record<any, any>): Experience => {
      const {
        collection_id,
        card_heading,
        cta_text,
        descriptor_tag_one,
        descriptor_tag_two,
        descriptor_tag_three,
        rich_text,
        category,
        subcategory,
        cta_link,
        card_image,
        card_image_alt_text,
      } = data || {};

      const { url } = card_image || {};
      const { url: ctaUrl } = cta_link || {};

      const experienceType = getExperienceType(data) as string;
      return {
        experienceId: collection_id,
        experienceType,
        heading: card_heading,
        imageUrl: url?.split('//')[1] || '',
        imageAlt: card_image_alt_text,
        ctaText: getCTAText(cta_text),
        ctaUrl,
        categoryTags: [
          descriptor_tag_one,
          descriptor_tag_two,
          descriptor_tag_three,
        ],
        richTextData: rich_text,
        experienceName:
          experienceType === EXPERIENCES.SUBCATEGORY ? subcategory : category,
        practicalInfo: getPracticalInfo(data),
        tabData: getTabData(data) as Array<LargeListicleTabData>,
      };
    });
  };

  switch (type) {
    case LISTICLE_TYPE.LARGE:
      return (
        <LargeListicle
          items={getListicleData(items) || []}
          listicleSectionTitle={listicleSectionTitle}
          index={index}
        />
      );
    case LISTICLE_TYPE.MEDIUM:
      return (
        <MediumListicle
          items={getListicleData(items) || []}
          settings={settings}
          listicleSectionTitle={listicleSectionTitle}
          index={index}
        />
      );
    case LISTICLE_TYPE.SMALL:
      return (
        <SmallListicle
          items={getListicleData(items) || []}
          listicleSectionTitle={listicleSectionTitle}
          index={index}
        />
      );
    default:
      break;
  }

  return null;
};
export default ListicleV2;
