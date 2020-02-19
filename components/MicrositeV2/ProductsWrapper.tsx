import React, { useContext, useEffect, useState } from 'react';
import PopulateProducts from './PopulateProducts';
import CategoryBar from './CategoryBar';
import { InteractionContext } from '../../contexts/Interaction';

export const ProductsWrapper = props => {
  const interactionContext = useContext(InteractionContext);
  const [productTgids, setProductTgids] = useState(
    props.categoryProps.categories[props.activeCategory || 0].ranking.popularity
  );
  const [activeCategory, setActiveCategory] = useState(props.activeCategory);

  const changeCategory = category => {
    setProductTgids(category.tgidArray);
    setActiveCategory(category.index);
  };

  useEffect(() => {
    const { categoryProps, activeCategory, directTgid } = props;
    const tgidArray =
      categoryProps.categories[activeCategory || 0].ranking.popularity;
    interactionContext.changeCategory(tgidArray);
    setTimeout(() => {
      if (directTgid) {
        interactionContext.clickTour(directTgid, true, 'main');
      }
    }, 1000);
  }, []);

  const {
    isMobile,
    categoryProps,
    changePage,
    allTours,
    currentLanguage,
    host,
    uid,
    propsTgids,
  } = props;

  const { activeCategoryTgids, activeTour } = interactionContext;

  return (
    <div className="main-wrapper relative-position">
      <CategoryBar
        {...categoryProps}
        availableTGIDs={Object.keys(allTours)}
        changeCategory={changeCategory}
        isMobile={isMobile}
      />
      <PopulateProducts
        tgids={activeCategoryTgids}
        allTours={allTours}
        isMobile={isMobile}
        changePage={changePage}
        currentLanguage={currentLanguage}
        host={host}
        uid={uid}
        sectionId={'main'}
      />
      <style jsx>{`
        .relative-position {
          position: relative;
        }
      `}</style>
    </div>
  );
};
