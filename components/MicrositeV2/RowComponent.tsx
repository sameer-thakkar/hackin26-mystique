import React, { useContext, useEffect } from 'react';
import Product from './Product';
import DetailedProductCard from './DetailedProductCard';
import { PAGETYPE } from '../../constants';
import InteractionContext from '../../contexts/Interaction';
import { scroller } from 'react-scroll';

export const RowComponent = (props) => {
  const interactionContext = useContext(InteractionContext);

  const handleProductClicked = (productTgid, section) => {
    const { isMobile } = props;
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

  const {
    tgidsSubArr,
    allTours,
    isMobile,
    currentLanguage,
    host,
    uid,
    sectionId,
  } = props;
  const { activeTour } = interactionContext;
  const tgidClicked = activeTour.tgid;
  const cardPosition = tgidsSubArr.indexOf(activeTour.tgid);
  const showDescription = cardPosition > -1 && sectionId === activeTour.section;
  return (
    <div className="products-row">
      {tgidsSubArr.map((tgid, index) => {
        return (
          <Product
            tgid={tgid}
            productClick={handleProductClicked}
            allTours={allTours}
            isMobile={isMobile}
            key={index}
            cardIdPrefix={sectionId}
          />
        );
      })}
      <React.Fragment>
        {showDescription ? (
          <DetailedProductCard
            tgidClicked={tgidClicked}
            allTours={allTours}
            isMobile={isMobile}
            currentLanguage={currentLanguage}
            host={host}
            uid={uid}
            key={tgidClicked}
            cardPosition={cardPosition + 1}
            closeDescription={closeDescription}
          />
        ) : null}
      </React.Fragment>
      <style jsx>{`
        .products-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-column-gap: 24px;
          grid-row-gap: 24px;
          max-width: 100%;
        }

        @media (max-width: 768px) {
          .products-row {
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};
