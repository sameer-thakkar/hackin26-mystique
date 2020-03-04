import React, { Component, useState, useContext, useEffect } from 'react';
import { RowComponent } from './RowComponent';
import { InteractionContext } from '../../contexts/Interaction';
import { MBContext } from '../../contexts/MBContext';

const PopulateProducts = props => {
  const {
    isMobile,
    propTgids,
    allTours,
    changePage,
    currentLanguage,
    host,
    uid,
    showAll,
    rowsToShow,
    sectionId,
  } = props;

  const interactionContext = useContext(InteractionContext);
  const mbContext = useContext(MBContext);
  const firstView = rowsToShow || 4;

  const [rowsInView, setRowsInView] = useState(firstView);

  useEffect(() => {
    setRowsInView(firstView);
  }, [interactionContext.activeCategoryTgids]);

  const subArrays = tgidsArr => {
    const { isMobile } = props;
    const perChunk = isMobile ? 2 : 4;
    const result = tgidsArr.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / perChunk);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);
    return result;
  };

  const viewMore = () => {
    setRowsInView(rowsInView + (isMobile ? 2 : 4));
  };

  const tgids = propTgids || interactionContext.activeCategoryTgids;
  const tgidsSubArr = subArrays(tgids);

  return (
    <div className="product-wrapper">
      {tgidsSubArr.map((row, index) => {
        if (showAll || index < rowsInView)
          return (
            <RowComponent
              tgidsSubArr={row}
              allTours={allTours}
              isMobile={isMobile}
              changePage={changePage}
              host={host}
              currentLanguage={currentLanguage}
              uid={uid}
              rowsInView={rowsInView}
              key={index}
              sectionId={sectionId}
            />
          );
      })}

      {tgidsSubArr.length > rowsInView && !showAll ? (
        <div className="view-more" onClick={viewMore}>
          {mbContext.buttons.see_more_text || 'View more'}
        </div>
      ) : null}
      <style jsx>{`
        .product-wrapper {
          margin-top: 32px;
          display: grid;
          grid-row-gap: 32px;
        }
        .view-more {
          display: grid;
          font-family: Graphik;
          color: #ec1943;
          border: 1px solid;
          border-radius: 4px;
          margin: auto;
          width: max-content;
          padding: 16px 32px;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .view-more {
            width: calc(100% - 32px);
            padding: 16px;
            text-align: center;
          }
          .product-wrapper {
            margin-top: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default PopulateProducts;
