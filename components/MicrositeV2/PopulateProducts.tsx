import React, { useState, useContext, useEffect, ComponentType } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import InteractionContext from 'contexts/Interaction';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';

const RowComponent: ComponentType<any> = dynamic(() =>
  import('./RowComponent').then((mod) => mod.RowComponent)
);

const StyledProductWrapper = styled.div`
  margin-top: 32px;
  display: grid;
  grid-row-gap: 32px;
  .view-more {
    display: grid;
    font-family: SOLEIL;
    color: #ec1943;
    border: 1px solid;
    border-radius: 4px;
    margin: auto;
    width: max-content;
    padding: 16px 32px;
    line-height: 1;
    cursor: pointer;
  }
  @media (max-width: 768px) {
    margin-top: 24px;
    .view-more {
      width: calc(100% - 32px);
      padding: 16px;
      text-align: center;
    }
  }
`;

const PopulateProducts = (props) => {
  const {
    isMobile,
    isEntertainmentMb,
    propTgids,
    allTours,
    hasCategoryTourList,
    categoryTourList,
    changePage,
    host,
    uid,
    showAll,
    rowsToShow,
    sectionId,
  } = props;

  const interactionContext = useContext(InteractionContext);
  const mbContext = useContext(MBContext);
  const { lang: currentLanguage } = mbContext;
  const firstView = rowsToShow || 4;

  const [rowsInView, setRowsInView] = useState(firstView);

  useEffect(() => {
    setRowsInView(firstView);
  }, [interactionContext.activeCategoryTgids, firstView]);

  const subArrays = (tgidsArr) => {
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
    <StyledProductWrapper>
      {tgidsSubArr.map((row, index) => {
        if (showAll || index < rowsInView)
          return (
            <RowComponent
              tgidsSubArr={row}
              allTours={allTours}
              isMobile={isMobile}
              hasCategoryTourList={hasCategoryTourList}
              categoryTourList={categoryTourList}
              isEntertainmentMb={isEntertainmentMb}
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

      <Conditional if={tgidsSubArr.length > rowsInView && !showAll}>
        <div
          className="view-more"
          onClick={viewMore}
          role="button"
          tabIndex={0}
        >
          {mbContext.buttons.see_more_text || strings.VIEW_MORE}
        </div>
      </Conditional>
    </StyledProductWrapper>
  );
};

export default PopulateProducts;
