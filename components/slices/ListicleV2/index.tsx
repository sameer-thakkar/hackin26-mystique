import React, { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { IListicleTypeProps } from 'components/slices/ListicleV2/interfaces';
import SmallListicle from 'components/slices/ListicleV2/SmallListicle/index';
import { MBContext } from 'contexts/MBContext';
import { getLocalisedPrice } from 'utils/currency';
import { getLangObject } from 'utils/helper';
import { getExperienceType } from 'utils/listicle';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import { EXPERIENCES, LISTICLE_TYPE } from 'const/index';
import { strings } from 'const/strings';

const ListicleV2 = ({
  type = LISTICLE_TYPE.SMALL,
  items,
  listicleSectionTitle,
}: IListicleTypeProps) => {
  const { lang } = useContext(MBContext);
  const currencyList = useRecoilValue(currencyListAtom);
  const currentLanguage = getLangObject(lang).code;
  const currency = useRecoilValue(currencyAtom);

  const getCTAText = (ctaText: string) => {
    if (ctaText === strings.VIEW_DETAILS || !ctaText)
      return strings.VIEW_DETAILS;

    if (isNaN(parseInt(ctaText))) return ctaText;

    return `${strings.FROM} ${getLocalisedPrice({
      price: Number(ctaText),
      currencyCode: currency || 'USD',
      lang: currentLanguage,
      currencyList,
      precision: 2,
    })}`;
  };

  const getListicleData = (listicleData: Array<any>): Experience[] => {
    return listicleData?.map(
      (data: Record<any, any>): Experience => {
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
        };
      }
    );
  };

  switch (type) {
    case LISTICLE_TYPE.SMALL:
      return (
        <SmallListicle
          items={getListicleData(items) || []}
          listicleSectionTitle={listicleSectionTitle}
        />
      );
    default:
      break;
  }

  return <></>;
};
export default ListicleV2;
