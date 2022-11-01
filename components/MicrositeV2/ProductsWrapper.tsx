import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import CategoryBar from 'components/MicrositeV2/CategoryBar';
import InteractionContext from 'contexts/Interaction';
import { DONT_AUTO_SCROLL } from 'const/index';
import Conditional from 'components/common/Conditional';
import { checkLTT } from 'utils/helper';

const PopulateProducts = dynamic(() => import('./PopulateProducts'));
const CategorisedPopulateProducts = dynamic(() =>
  import('./CategorisedPopulateProducts')
);

const StyledProductWrapper = styled.div`
  margin-bottom: ${({ isEntertainmentMb }) =>
    isEntertainmentMb ? '64px' : '0'};

  &.relative-position {
    position: relative;
  }
  @media (max-width: 768px) {
    margin-bottom: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '48px' : '0'};
  }
`;

export const ProductsWrapper = (props) => {
  const interactionContext = useContext(InteractionContext);
  const { activeCategoryTgids, changeCategory, clickTour } =
    interactionContext || {};
  const {
    isMobile,
    isEntertainmentMb,
    categoryProps,
    activeCategory,
    directTgid,
    changePage,
    allTours,
    hasCategoryTourList,
    currentLanguage,
    host,
    uid,
    isListicle,
    isDev,
    isDiscountedPage,
    showLtdCategoryHomepage,
  } = props;

  const { categories } = categoryProps;

  useEffect(() => {
    const tgidArray =
      categoryProps.categories[activeCategory || 0].ranking.popularity;
    changeCategory(tgidArray, activeCategory || 0);
    setTimeout(() => {
      if (directTgid) {
        const isLTT = checkLTT(uid);
        const section = isMobile || isLTT ? null : 'main';

        clickTour(directTgid, true, section, DONT_AUTO_SCROLL);
      }
    }, 1000);
  }, []);

  if (!activeCategoryTgids?.length) return null;
  return (
    <StyledProductWrapper
      className="main-wrapper relative-position"
      isEntertainmentMb={isEntertainmentMb}
    >
      <Conditional if={!isListicle}>
        <CategoryBar
          {...categoryProps}
          allTours={allTours}
          isMobile={isMobile}
          isEntertainmentMb={isEntertainmentMb}
          isListicle={isListicle}
          showLtdCategoryHomepage={showLtdCategoryHomepage}
        />
      </Conditional>
      <Conditional if={showLtdCategoryHomepage === false}>
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
          isListicle={isListicle}
          categoryProps={categoryProps}
          isDev={isDev}
          isDiscountedPage={isDiscountedPage}
        />
      </Conditional>
      <Conditional if={showLtdCategoryHomepage}>
        <CategorisedPopulateProducts
          categories={categories}
          allTours={allTours}
          hasCategoryTourList={hasCategoryTourList}
          host={host}
          sectionId={'main'}
          isMobile={isMobile}
          uid={uid}
          directTgid={directTgid}
        />
      </Conditional>
    </StyledProductWrapper>
  );
};
