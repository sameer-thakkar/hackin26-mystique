import { useEffect, useState } from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import PopulateProducts from 'components/PopulateProducts';
import { getLangObject } from 'utils/helper';

const ProductsSection = (props: any) => {
  const {
    host,
    currency,
    lang,
    toursList: uncategorizedToursList,
    tgidToScroll,
    bookNowText,
    readMoreText,
    showLessText,
    categoryTourListData,
    uid,
  } = props;

  const {
    scorpioData: scorpioDataCategorised,
    orderedTours: categorizedToursList,
  } = categoryTourListData || {};

  const isCategorisedTours = Object.keys(categoryTourListData)?.length > 0;

  const sortTours = (
    tgidToScroll: any,
    toursArray: any,
    isCategorisedTours: boolean
  ) => {
    if (!tgidToScroll) return toursArray;
    if (tgidToScroll) {
      return toursArray?.reduce((accum = [], item: any) => {
        const tgid = isCategorisedTours ? +tgidToScroll : tgidToScroll;
        if (item.tgid === tgid) {
          return [item, ...accum];
        } else {
          return [...accum, item];
        }
      }, []);
    }
  };

  const orderedUncategorizedTours = isCategorisedTours
    ? sortTours(tgidToScroll, categorizedToursList, isCategorisedTours)
    : sortTours(tgidToScroll, uncategorizedToursList, isCategorisedTours);

  const orderedTours = orderedUncategorizedTours;

  const [freeTourPopupOpen, toggleFreeTourPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(props?.isMobile);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    const currentIsMobile = windowWidth < 768;
    if (isMobile !== currentIsMobile) {
      setIsMobile(currentIsMobile);
    }
  }, [windowWidth]);

  const currentLanguage = getLangObject(lang).code;
  const onTogglePopup = () => {
    toggleFreeTourPopup(!freeTourPopupOpen);
  };

  return (
    <PopulateProducts
      currency={currency}
      uncategorizedTours={orderedTours}
      scorpioData={scorpioDataCategorised}
      uid={uid}
      currentLanguage={currentLanguage}
      bookNowText={bookNowText}
      readMoreText={readMoreText}
      showLessText={showLessText}
      togglePopup={onTogglePopup}
      isMobile={isMobile}
      host={host}
      pageType={'global_experience'}
    />
  );
};

export default ProductsSection;
