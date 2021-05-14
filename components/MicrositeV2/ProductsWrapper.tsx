import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import CategoryBar from 'components/MicrositeV2/CategoryBar';
import InteractionContext from 'contexts/Interaction';
import { DONT_AUTO_SCROLL } from 'const/index';

const PopulateProducts = dynamic(() => import('./PopulateProducts'));

const StyledProductWrapper = styled.div`
  &.relative-position {
    position: relative;
  }
`;

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
    isEntertainmentMb,
    categoryProps,
    changePage,
    allTours,
    currentLanguage,
    host,
    uid,
  } = props;

  const { activeCategoryTgids } = interactionContext;

  if (!activeCategoryTgids?.length) return null;
  return (
    <StyledProductWrapper className="main-wrapper relative-position">
      <CategoryBar
        {...categoryProps}
        availableTGIDs={Object.keys(allTours)}
        isMobile={isMobile}
      />
      <PopulateProducts
        tgids={activeCategoryTgids}
        allTours={allTours}
        isMobile={isMobile}
        isEntertainmentMb={isEntertainmentMb}
        changePage={changePage}
        currentLanguage={currentLanguage}
        host={host}
        uid={uid}
        sectionId={'main'}
      />
    </StyledProductWrapper>
  );
};
