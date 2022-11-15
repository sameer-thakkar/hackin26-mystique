import React, { useContext, useEffect } from 'react';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import InteractionContext from 'contexts/Interaction';
import { PAGETYPE } from 'const/index';
import Conditional from 'components/common/Conditional';
import { NO_OF_CARDS_IN_ROW } from 'components/MicrositeV2/PopulateProducts';
import Product from 'components/MicrositeV2/Product';

const DetailedProductCard = dynamic(() => import('./DetailedProductCard'));

const ProductsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 24px;
  grid-row-gap: 24px;
  max-width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 16px;
  }
`;

export const RowComponent = (props) => {
  const {
    isMobile,
    tgidsSubArr,
    allTours,
    hasCategoryTourList,
    isEntertainmentMb,
    currentLanguage,
    host,
    uid,
    sectionId,
    isListicle,
    isDev,
    sectionIndex,
  } = props;
  const { activeCategoryId, activeTour, clickTour, closeTour } =
    useContext(InteractionContext) || {};
  const { tgid: activeTgid, section: activeSection, autoScroll } =
    activeTour || {};

  const totalPreviousCardRendered =
    sectionIndex *
    (isMobile ? NO_OF_CARDS_IN_ROW.MOBILE : NO_OF_CARDS_IN_ROW.DESKTOP);

  const handleProductClicked = (productTgid, event) => {
    if (event.type === 'keydown') {
      event.target.blur();
      return;
    }
    if (isMobile) {
      props.changePage({
        name: PAGETYPE.MOBILE_PRODUCT_PAGE,
        tgid: productTgid,
      });
    } else {
      clickTour(productTgid, false, sectionId);
    }
  };

  const closeDescription = () => {
    closeTour();
  };

  useEffect(() => {
    if (!window) return;
    if (activeTgid && autoScroll)
      scroller.scrollTo(`${activeSection}-${activeTgid}`, {
        duration: 750,
        delay: 80,
        smooth: 'easeInQuad',
        offset: 45,
      });
  }, [activeTgid]);

  return (
    <ProductsRow>
      {tgidsSubArr.map((tgid, index) => (
        <Product
          tgid={tgid}
          productClick={handleProductClicked}
          isEntertainmentMb={isEntertainmentMb}
          allTours={allTours}
          isMobile={isMobile}
          key={index}
          cardIdPrefix={sectionId}
          activeCategoryId={activeCategoryId}
          host={host}
          uid={uid}
        />
      ))}
      <Conditional if={!isEntertainmentMb}>
        {tgidsSubArr.map((tgid, index) => (
          <DetailedProductCard
            showDescCard={tgid === activeTgid}
            tgidClicked={tgid}
            allTours={allTours}
            hasCategoryTourList={hasCategoryTourList}
            isEntertainmentMb={isEntertainmentMb}
            currentLanguage={currentLanguage}
            host={host}
            uid={uid}
            key={tgid}
            cardPosition={index + 1}
            closeDescription={closeDescription}
            isListicle={isListicle}
            isDev={isDev}
            cardRanking={totalPreviousCardRendered + (index + 1)}
          />
        ))}
      </Conditional>
    </ProductsRow>
  );
};
