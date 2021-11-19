import { ANALYTICS_PROPERTIES } from 'const/index';
import { ANALYTICS_EVENTS } from 'const/index';
import React, { createContext, useState, useEffect } from 'react';
import { trackEvent } from 'utils/analytics';

const InteractionContext = createContext(null);
export default InteractionContext;

export const InteractionContextProvider = (props) => {
  const { categories } = props;
  const { sliceData: currentSlice } = categories || {};
  const defaultCategory =
    (categories[0] && categories[0].ranking.popularity) || [];
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [sliceData, setSliceData] = useState(null);

  useEffect(() => {
    const categoryId = categories?.[activeCategoryIndex]?.id;
    setActiveCategoryId(categoryId);
    changeCategory(defaultCategory, activeCategoryIndex);
    setSliceData(currentSlice);
  }, []);

  const [activeTour, setActiveTour] = useState({
    tgid: null,
    hoist: false,
    section: null,
    autoScroll: true,
  });

  const [activeCategoryTgids, setActiveCategory] = useState([
    ...defaultCategory,
  ]);

  const clickTour = (tgid, hoist, section = 'main', autoScroll = true) => {
    let expand = false;
    if (activeTour.tgid != tgid) {
      if (hoist) {
        setActiveCategory(uniqueTgids([tgid, ...activeCategoryTgids]));
      }
      expand = true;
      setActiveTour({
        tgid,
        hoist,
        section,
        autoScroll,
      });
    } else {
      closeTour();
      expand = false;
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_MORE_DETAILS_VIEWED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.ACTION]: expand ? 'Expand' : 'Contract',
    });
  };

  const closeTour = () => {
    setActiveTour({
      tgid: null,
      hoist: null,
      section: null,
      autoScroll: false,
    });
  };

  const uniqueTgids = (tgidArray) =>
    tgidArray.filter((tgid, index, self) => {
      return self.indexOf(tgid) === index;
    });

  const changeCategory = (tgidArray: any[], categoryIndex: number) => {
    const categoryId = categories?.[categoryIndex]?.id;
    const sliceData = categories?.[categoryIndex]?.sliceData;
    setActiveCategoryId(categoryId);
    setActiveTour({
      tgid: null,
      hoist: null,
      section: null,
      autoScroll: true,
    });
    setActiveCategoryIndex(categoryIndex);
    setActiveCategory(uniqueTgids(tgidArray));
    setSliceData(sliceData);
  };

  return (
    <InteractionContext.Provider
      value={{
        activeTour,
        activeCategoryId,
        activeCategoryIndex,
        activeCategoryTgids,
        sliceData,
        clickTour,
        changeCategory,
        closeTour,
      }}
    >
      {props.children}
    </InteractionContext.Provider>
  );
};

InteractionContextProvider.defaultProps = {
  categories: [],
};
