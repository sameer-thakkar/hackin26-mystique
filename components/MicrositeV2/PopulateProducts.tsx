import React, { useState, useContext, useEffect, ComponentType } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import InteractionContext from 'contexts/Interaction';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import LinkResolver from 'components/LinkResolver';
import { useRouter } from 'next/router';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CTA_TYPE,
  QUERY_PARAMS,
} from 'const/index';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import { trackEvent } from 'utils/analytics';

const RowComponent: ComponentType<any> = dynamic(() =>
  import('./RowComponent').then((mod) => mod.RowComponent)
);

const StyledProductWrapper = styled.div`
  margin-top: 32px;
  display: grid;
  grid-row-gap: 32px;
  .view-more {
    display: grid;
    ${({ isEntertainmentMbListicle }) =>
      isEntertainmentMbListicle
        ? expandFontToken('Button/Big')
        : expandFontToken('Button/Medium')};
    color: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? COLORS.GRAY.G2 : COLORS.BRAND.PURPS};
    border: 1px solid;
    border-radius: 4px;
    margin: auto;
    width: max-content;
    padding: ${({ isEntertainmentMbListicle }) =>
      isEntertainmentMbListicle ? '12px 24px' : '16px 32px'};
    cursor: pointer;
    ${({ isEntertainmentMb }) => isEntertainmentMb && 'letter-spacing: 0.6px;'}
  }
  @media (max-width: 768px) {
    margin-top: 24px;
    ${({ isEntertainmentMb }) => isEntertainmentMb && 'grid-row-gap: 24px;'}
    .view-more {
      width: calc(100% - 32px);
      padding: 16px;
      text-align: center;
    }
  }
`;

export const NO_OF_CARDS_IN_ROW = {
  DESKTOP: 4,
  MOBILE: 2,
};

const NO_OF_ROWS_TO_SHOW = {
  DESKTOP: 4,
  MOBILE: 8,
};

const PopulateProducts = (props) => {
  const {
    isMobile,
    isEntertainmentMb,
    propTgids,
    allTours,
    hasCategoryTourList,
    changePage,
    host,
    uid,
    showAll,
    rowsToShow,
    sectionId,
    isListicle,
    categoryProps,
    isDev,
    isDiscountedPage,
  } = props;
  const { activeCategoryTgids, activeCategoryIndex, closeTour } =
    useContext(InteractionContext) || {};
  const mbContext = useContext(MBContext);
  const { lang } = mbContext;
  const { query, asPath, push: routerPush, pathname } = useRouter();
  const {
    limit = String((rowsToShow || 8) * NO_OF_CARDS_IN_ROW.DESKTOP),
    offset = '0',
  }: { limit?: string; offset?: string } = query || {};
  const queryRowsToShow =
    parseInt(limit) /
    (isMobile ? NO_OF_CARDS_IN_ROW.MOBILE : NO_OF_CARDS_IN_ROW.DESKTOP);
  const firstView = queryRowsToShow || rowsToShow || 4;

  const [rowsInView, setRowsInView] = useState(firstView);

  useEffect(() => {
    setRowsInView(firstView);
  }, [activeCategoryTgids, firstView]);

  const isEntertainmentMbListicle = isListicle && isEntertainmentMb;

  const subArrays = (tgidsArr, offset = 0) => {
    const { isMobile } = props;
    const perChunk = isMobile
      ? NO_OF_CARDS_IN_ROW.MOBILE
      : NO_OF_CARDS_IN_ROW.DESKTOP;
    const result = tgidsArr
      .filter((tgid) => {
        if (isEntertainmentMbListicle) {
          return (
            allTours?.[tgid]?.listicleShowSummary &&
            allTours?.[tgid]?.listicleWhyWatch
          );
        } else if (isEntertainmentMb) {
          return (
            allTours?.[tgid]?.listingPrice?.finalPrice &&
            Object.keys(allTours[tgid].microBrandsHighlight).length > 0
          );
        } else {
          return allTours?.[tgid]?.listingPrice?.finalPrice;
        }
      })
      .slice(offset)
      .reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk);
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      }, []);
    return result;
  };

  const getUpdatedQuery = () => {
    const url = typeof window === 'undefined' ? asPath : location?.href;
    const query = new URLSearchParams(url?.split('?')?.[1]);
    const queryLimit = query.get(QUERY_PARAMS.LIMIT) || limit;

    query.set(
      QUERY_PARAMS.LIMIT,
      String(
        Number(queryLimit) +
          (isMobile
            ? NO_OF_CARDS_IN_ROW.MOBILE * NO_OF_ROWS_TO_SHOW.MOBILE
            : NO_OF_CARDS_IN_ROW.DESKTOP * NO_OF_ROWS_TO_SHOW.DESKTOP)
      )
    );
    query.set(QUERY_PARAMS.OFFSET, '0');
    query.set(
      QUERY_PARAMS.CATEGORY,
      categoryProps?.categories[activeCategoryIndex].name.toLowerCase()
    );
    return query;
  };

  const viewMore = (e) => {
    e.preventDefault();
    closeTour();
    setRowsInView(
      rowsInView +
        (isMobile ? NO_OF_ROWS_TO_SHOW.MOBILE : NO_OF_ROWS_TO_SHOW.DESKTOP)
    );
    routerPush(`${pathname}?${getUpdatedQuery()?.toString()}`, null, {
      shallow: true,
    });

    let nextItemsCardCount = isMobile
      ? NO_OF_CARDS_IN_ROW.MOBILE * NO_OF_ROWS_TO_SHOW.MOBILE
      : NO_OF_CARDS_IN_ROW.DESKTOP * NO_OF_ROWS_TO_SHOW.DESKTOP;

    const cardsAlreadyVisible = Number(limit);
    const totalCards = finalTgidListToShow.length;

    if (cardsAlreadyVisible + nextItemsCardCount > totalCards) {
      nextItemsCardCount = totalCards - cardsAlreadyVisible;
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.PAGINATION_CLICKED,
      [ANALYTICS_PROPERTIES.PAGINATION_TYPE]: CTA_TYPE.SHOW_MORE,
      [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: nextItemsCardCount,
    });
  };

  const categoryPropsPopularityRank =
    categoryProps?.categories[0]?.ranking.popularity;
  const finalTgidListToShow =
    (isDiscountedPage
      ? activeCategoryTgids || categoryPropsPopularityRank
      : isListicle
      ? categoryPropsPopularityRank
      : propTgids || activeCategoryTgids) || [];

  const tgidsSubArr = subArrays(finalTgidListToShow, Number(offset));
  const getViewMoreLink = () => {
    return `${pathname}?${getUpdatedQuery().toString()}`;
  };

  return (
    <StyledProductWrapper
      isEntertainmentMb={isEntertainmentMb}
      isEntertainmentMbListicle={isEntertainmentMbListicle}
    >
      {tgidsSubArr.map((row, index) => {
        if (showAll || index < rowsInView)
          return (
            <RowComponent
              tgidsSubArr={row}
              allTours={allTours}
              isMobile={isMobile}
              hasCategoryTourList={hasCategoryTourList}
              isEntertainmentMb={isEntertainmentMb}
              changePage={changePage}
              host={host}
              currentLanguage={lang}
              uid={uid}
              rowsInView={rowsInView}
              key={index}
              sectionId={sectionId}
              isListicle={isListicle}
              isDev={isDev}
              sectionIndex={index}
            />
          );
      })}

      <Conditional if={tgidsSubArr.length > rowsInView && !showAll}>
        <LinkResolver
          url={getViewMoreLink()}
          onClick={viewMore}
          className="view-more"
        >
          {isEntertainmentMbListicle
            ? strings.SEE_MORE_SHOWS
            : mbContext.buttons.see_more_text || strings.VIEW_MORE}
        </LinkResolver>
      </Conditional>
    </StyledProductWrapper>
  );
};

export default PopulateProducts;
