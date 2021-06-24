import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import CategoryBar from 'components/MicrositeV2/CategoryBar';
import InteractionContext from 'contexts/Interaction';
import { DONT_AUTO_SCROLL } from 'const/index';

const PopulateProducts = dynamic(() => import('./PopulateProducts'));

const StyledProductWrapper = styled.div`
  margin-bottom: ${({ isEntertainmentMb }) =>
    isEntertainmentMb ? '64px' : '0'};
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
    hasCategoryTourList,
    currentLanguage,
    host,
    uid,
  } = props;

  const { activeCategoryTgids } = interactionContext;

  if (!activeCategoryTgids?.length) return null;
  return (
    <StyledProductWrapper
      className="main-wrapper relative-position"
      isEntertainmentMb={isEntertainmentMb}
    >
      <CategoryBar
        {...categoryProps}
        availableTGIDs={allTours}
        isMobile={isMobile}
        isEntertainmentMb={isEntertainmentMb}
      />
      <PopulateProducts
        tgids={activeCategoryTgids}
        allTours={allTours}
        hasCategoryTourList={hasCategoryTourList}
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
