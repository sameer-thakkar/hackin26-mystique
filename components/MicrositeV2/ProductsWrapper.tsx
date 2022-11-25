import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import CategoryBar from 'components/MicrositeV2/CategoryBar';
import InteractionContext from 'contexts/Interaction';
import { DONT_AUTO_SCROLL } from 'const/index';
import Conditional from 'components/common/Conditional';
import { checkLTT } from 'utils/helper';

const PopulateProducts = dynamic(() => import('./PopulateProducts'));

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
  } = props;

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
        />
      </Conditional>
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
    </StyledProductWrapper>
  );
};
