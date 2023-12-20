import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import CategoryBar from 'components/MicrositeV2/CategoryBar';
import InteractionContext, { uniqueTgids } from 'contexts/Interaction';

const PopulateProducts = dynamic(
  () => import(/* webpackChunkName: "PopulateProducts" */ './PopulateProducts')
);

const StyledProductWrapper = styled.div<{ isEntertainmentMb: boolean }>`
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

export const ProductsWrapper = (props: any) => {
  const interactionContext = useContext(InteractionContext);
  // @ts-expect-error TS(2339): Property 'activeCategoryTgids' does not exist on t... Remove this comment to see the full error message
  const { activeCategoryTgids, changeCategory } = interactionContext || {};

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
    if (directTgid) {
      const tgids = uniqueTgids([directTgid, ...tgidArray]);
      changeCategory(tgids, activeCategory || 0);
    } else {
      changeCategory(tgidArray, activeCategory || 0);
    }
  }, [directTgid]);

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
