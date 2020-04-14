import React, { createContext, useState, useEffect } from 'react';

const InteractionContext = createContext(null);
export default InteractionContext;

export const InteractionContextProvider = (props) => {
  const { categories } = props;
  const defaultCategory =
    (categories[0] && categories[0].ranking.popularity) || [];
  useEffect(() => {
    changeCategory(defaultCategory);
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
    if (activeTour.tgid != tgid) {
      if (hoist) {
        setActiveCategory(uniqueTgids([tgid, ...activeCategoryTgids]));
      }
      setActiveTour({
        tgid,
        hoist,
        section,
        autoScroll,
      });
    } else
      setActiveTour({
        tgid: null,
        hoist: null,
        section: null,
        autoScroll,
      });
  };

  const closeTour = () => {
    setActiveTour({
      tgid: null,
      hoist: null,
      section: null,
      autoScroll: true,
    });
  };

  const uniqueTgids = (tgidArray) =>
    tgidArray.filter((tgid, index, self) => {
      return self.indexOf(tgid) === index;
    });

  const changeCategory = (tgidArray) => {
    setActiveTour({
      tgid: null,
      hoist: null,
      section: null,
      autoScroll: true,
    });
    setActiveCategory(uniqueTgids(tgidArray));
  };

  return (
    <InteractionContext.Provider
      value={{
        activeTour,
        activeCategoryTgids: activeCategoryTgids,
        clickTour: clickTour,
        changeCategory: changeCategory,
        closeTour: closeTour,
      }}
    >
      {props.children}
    </InteractionContext.Provider>
  );
};

InteractionContextProvider.defaultProps = {
  categories: [],
};
