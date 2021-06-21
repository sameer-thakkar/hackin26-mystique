import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { scroller } from 'react-scroll';
import styled from 'styled-components';
import InteractionContext from 'contexts/Interaction';
import { PAGETYPE } from 'const/index';
import Conditional from 'components/common/Conditional';

const DetailedProductCard = dynamic(() => import('./DetailedProductCard'), {
  ssr: false,
});
const Product = dynamic(() => import('components/MicrositeV2/Product'));

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
    categoryTourList,
    isEntertainmentMb,
    currentLanguage,
    host,
    uid,
    sectionId,
  } = props;
  const interactionContext = useContext(InteractionContext);

  const handleProductClicked = (productTgid, section) => {
    if (isMobile) {
      props.changePage({
        name: PAGETYPE.MOBILE_PRODUCT_PAGE,
        tgid: productTgid,
      });
    } else {
      interactionContext.clickTour(productTgid, false, section);
    }
  };

  const closeDescription = () => {
    interactionContext.closeTour();
  };

  useEffect(() => {
    if (!window) return;
    const {
      activeTour: { tgid, section: activeSection, autoScroll },
    } = interactionContext;
    if (tgid && autoScroll)
      scroller.scrollTo(`${activeSection}-${tgid}`, {
        duration: 750,
        delay: 100,
        smooth: 'easeInQuad',
        offset: 45,
      });
  }, [interactionContext]);

  const { activeTour } = interactionContext;
  const tgidClicked = activeTour.tgid;
  const cardPosition = tgidsSubArr.indexOf(activeTour.tgid);
  const showDescription = cardPosition > -1 && sectionId === activeTour.section;
  return (
    <ProductsRow>
      {tgidsSubArr.map((tgid, index) => {
        return (
          <Product
            tgid={tgid}
            productClick={handleProductClicked}
            isEntertainmentMb={isEntertainmentMb}
            allTours={allTours}
            hasCategoryTourList={hasCategoryTourList}
            categoryTourList={categoryTourList}
            isMobile={isMobile}
            key={index}
            cardIdPrefix={sectionId}
          />
        );
      })}
      <React.Fragment>
        <Conditional if={showDescription}>
          <DetailedProductCard
            tgidClicked={tgidClicked}
            allTours={allTours}
            hasCategoryTourList={hasCategoryTourList}
            categoryTourList={categoryTourList}
            isMobile={isMobile}
            isEntertainmentMb={isEntertainmentMb}
            currentLanguage={currentLanguage}
            host={host}
            uid={uid}
            key={tgidClicked}
            cardPosition={cardPosition + 1}
            closeDescription={closeDescription}
          />
        </Conditional>
      </React.Fragment>
    </ProductsRow>
  );
};
