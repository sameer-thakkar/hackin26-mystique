import React, {
  Component,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

export const InteractionContext = createContext(null);

export const InteractionContextProvider = props => {
  const { categories } = props;
  const defaultCategory =
    (categories[0] && categories[0].ranking.popularity) || [];
  // const defaultCategory = []
  useEffect(() => {
    changeCategory(defaultCategory);
  }, []);

  const [activeTour, setActiveTour] = useState({
    tgid: null,
    hoist: false,
    section: null,
  });

  const [activeCategoryTgids, setActiveCategory] = useState([
    ...defaultCategory,
  ]);

  const clickTour = (tgid, hoist, section) => {
    if (activeTour.tgid != tgid) {
      if (hoist) {
        setActiveCategory(uniqueTgids([tgid, ...activeCategoryTgids]));
      }
      setActiveTour({
        tgid,
        hoist,
        section,
      });
    } else
      setActiveTour({
        tgid: null,
        hoist: null,
        section: null,
      });
  };

  const closeTour = () => {
    setActiveTour({
      tgid: null,
      hoist: null,
      section: null,
    });
  };

  const uniqueTgids = tgidArray =>
    tgidArray.filter((tgid, index, self) => {
      return self.indexOf(tgid) === index;
    });

  const changeCategory = tgidArray => {
    setActiveTour({
      tgid: null,
      hoist: null,
      section: null,
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
