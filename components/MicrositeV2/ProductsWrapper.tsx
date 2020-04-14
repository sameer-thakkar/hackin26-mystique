import React, { useContext, useEffect } from 'react';
import PopulateProducts from './PopulateProducts';
import CategoryBar from './CategoryBar';
import InteractionContext from '../../contexts/Interaction';
import { DONT_AUTO_SCROLL } from '../../constants';

export const ProductsWrapper = (props) => {
  const interactionContext = useContext(InteractionContext);

  useEffect(() => {
    const { categoryProps, activeCategory, directTgid } = props;
    const tgidArray =
      categoryProps.categories[activeCategory || 0].ranking.popularity;
    interactionContext.changeCategory(tgidArray);
    setTimeout(() => {
      if (directTgid) {
        interactionContext.clickTour(
          directTgid,
          true,
          'main',
          DONT_AUTO_SCROLL
        );
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
  } = props;

  const { activeCategoryTgids } = interactionContext;

  return (
    <div className="main-wrapper relative-position">
      <CategoryBar
        {...categoryProps}
        availableTGIDs={Object.keys(allTours)}
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
