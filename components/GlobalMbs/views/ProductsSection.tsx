import { useState, useEffect } from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import PopulateProducts from 'components/PopulateProducts';
import { getLangObject } from 'utils/helper';

const ProductsSection = (props) => {
  const {
    host,
    currency,
    lang,
    isAmp,
    toursList: uncategorizedToursList,
    tgidToScroll,
    bookNowText,
    readMoreText,
    showLessText,
    disableAMP,
    categoryTourListData,
    uid,
  } = props;

  const {
    scorpioData: scorpioDataCategorised,
    orderedTours: categorizedToursList,
  } = categoryTourListData || {};

  const isCategorisedTours = Object.keys(categoryTourListData)?.length > 0;

  const sortTours = (tgidToScroll, toursArray, isCategorisedTours) => {
    if (!tgidToScroll) return toursArray;
    if (tgidToScroll) {
      return toursArray?.reduce((accum = [], item) => {
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
    setIsMobile(windowWidth < 768);
  }, [windowWidth]);

  const currentLanguage = getLangObject(lang).short;
  const onTogglePopup = () => {
    toggleFreeTourPopup(!freeTourPopupOpen);
  };

  return (
    <PopulateProducts
      currency={currency}
      uncategorizedTours={orderedTours}
      scorpioData={scorpioDataCategorised}
      uid={uid}
      isAmp={isAmp}
      currentLanguage={currentLanguage}
      bookNowText={bookNowText}
      readMoreText={readMoreText}
      showLessText={showLessText}
      togglePopup={onTogglePopup}
      isMobile={isAmp || isMobile}
      host={host}
      disable_amp={disableAMP}
      pageType={'global_experience'}
    />
  );
};

export default ProductsSection;
