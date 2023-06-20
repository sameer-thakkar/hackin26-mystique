import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { scroller } from 'react-scroll';
import InteractionContext from 'contexts/Interaction';
import Conditional from 'components/common/Conditional';
import { SortSelector } from 'components/MicrositeV2/SortSelector';
import { SIZES } from 'const/ui-constants';
import COLORS from 'const/colors';
import { metaAtom } from 'store/atoms/meta';
import { useRecoilValue } from 'recoil';
import { getCommonEventMetaData, trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { expandFontToken } from 'const/typography';

const StyledCategoryBar = styled.div<{ isMobile?: boolean }>`
  height: fit-content;
  position: sticky;
  background: ${COLORS.BRAND.WHITE};
  top: ${({ isMobile }) => (isMobile ? '35px' : '56px')};
  z-index: 2;

  .swiper-container {
    overflow: unset;
  }
  .carousel img {
    border-radius: 0.625rem;
  }
  @media (max-width: 768px) {
    margin-left: -1rem;
    margin-right: -1rem;
  }
`;

const CategoryBarWrapper = styled.div<{ isEntertainmentMb?: boolean }>`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border-bottom: ${({ isEntertainmentMb }) =>
    isEntertainmentMb
      ? `1px solid ${COLORS.GRAY.G6}`
      : `1px solid ${COLORS.GRAY.G7}`};
  grid-gap: 0.5rem;
  padding-top: 2.25rem;
  padding-bottom: ${({ isEntertainmentMb }) =>
    isEntertainmentMb ? '0.75rem' : '1.25rem'};
  .tabs-wrap {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-auto-flow: column;
    justify-content: left;
    grid-column-gap: 1.875rem;
    position: relative;
  }
  .tab {
    ${expandFontToken('Heading/Large')}
    color: ${COLORS.GRAY.G2};
    text-align: center;
    cursor: pointer;
  }
  .tab.active {
    color: ${COLORS.TEXT.PURPS_3};
  }
  .active-indicator {
    position: absolute;
    bottom: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '-0.83rem' : '-1.3rem'};
    left: 0;
    width: 6.25rem;
    height: 0.125rem;
    background: ${COLORS.TEXT.PURPS_3};
    z-index: 8;
    transition: width 0.5s ease, left 0.5s ease;
  }
  .carousel {
    max-width: ${SIZES.MAX_WIDTH};
    padding: 0 5.46vw;
    margin: 0 auto;
  }
  .filter-wrapper {
    display: grid;
    align-items: center;
    grid-column-gap: 0.5rem;
    grid-template-columns: auto auto;
  }
  .filter-wrapper span {
    ${expandFontToken('UI/Label Regular (Heavy)')}
  }

  @media (max-width: 768px) {
    overflow-y: hidden;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    padding-top: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '1.125rem' : '1.188rem'};
    padding-bottom: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '1.10rem' : '1.01rem'};
    margin-top: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '1rem' : '1.5rem'};

    .tabs-wrap {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .tabs-wrap {
      width: max-content;
    }

    .active-indicator {
      bottom: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '-1.10rem' : '-1.01rem'};
    }

    .tab {
      ${expandFontToken('Heading/Product Card')}
    }

    .filter-wrapper {
      display: none;
    }

    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;
const CategoryBar = (props: any) => {
  // @ts-expect-error TS(2339): Property 'changeCategory' does not exist on type '... Remove this comment to see the full error message
  const { changeCategory: changeCategoryHandler, activeCategoryIndex } =
    useContext(InteractionContext) || {};
  const pageMetaData = useRecoilValue(metaAtom);
  const parent = useRef<HTMLDivElement>(null);
  const category_bar = useRef(null);
  const scroll_div = useRef(null);
  const [activeCategory, setActiveCategory] = useState(activeCategoryIndex);
  const [activeOrder, setActiveOrder] = useState('popularity');
  const [filterDropdownActive, setFilterDropdownActive] = useState(false);
  const [indicatorStyles, setIndicatorStyles] = useState({
    width: null,
    left: null,
  });
  const {
    categories,
    allTours,
    isMobile,
    hideSortBySelector,
    isEntertainmentMb,
    isListicle,
  } = props;

  const focusProductList = () =>
    scroller.scrollTo('product-wrapper-v2', {
      duration: 0,
      offset: isMobile ? -120 : -170,
      smooth: true,
    });

  const toggleFilterDropdown = (dropdownState: any) => {
    if (!filterDropdownActive)
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_SORT_BY_CLICKED,
        ...getCommonEventMetaData(pageMetaData),
      });
    setFilterDropdownActive((oldState) =>
      typeof dropdownState !== 'undefined' ? dropdownState : !oldState
    );
  };

  const changeCategory = (index: number) => {
    let { categories } = props;
    setActiveCategory(index);
    changeCategoryHandler(categories[index].ranking[activeOrder], index);
    const ranking = categories
      .filter((category: any) =>
        category?.ranking?.popularity?.length
          ? category.ranking.popularity.some(
              (tgid: any) => allTours[tgid]?.available
            )
          : false
      )
      .findIndex((category: any) => category.name === categories[index].name);

    trackEvent({
      eventName: ANALYTICS_EVENTS.CATEGORY_TAB_CLICKED,
      ...getCommonEventMetaData(pageMetaData),
      [ANALYTICS_PROPERTIES.RANKING]: ranking + 1,
      [ANALYTICS_PROPERTIES.HEADING]: categories[index].name,
    });

    focusProductList();
  };

  const changeOrder = (orderKey: any) => {
    let { categories } = props;
    setActiveOrder(orderKey);

    changeCategoryHandler(
      categories[activeCategory].ranking[orderKey],
      activeCategory
    );

    trackEvent({
      eventName: ANALYTICS_EVENTS.MB_EXPERIENCE_SORTED,
      [ANALYTICS_PROPERTIES.SORT_BY]: orderKey,
      ...getCommonEventMetaData(pageMetaData),
    });

    focusProductList();
  };

  useEffect(() => {
    if (!parent.current) return;

    const centerActiveCategory = () => {
      const parentElement = parent.current;
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      const selectedTab = parentElement.querySelector('.tab.active');
      if (isMobile) {
        selectedTab?.scrollIntoView({
          inline: 'center',
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    };

    const getActiveLineDimension = () => {
      const parentElement = parent.current;
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      const tag: Element = parentElement.querySelector('.tab.active');
      let selectedTab = window.getComputedStyle(tag);
      let width = parseFloat(selectedTab.width);
      let selectedTabDimensions = tag.getBoundingClientRect();
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      let parentDimensions = parentElement.getBoundingClientRect();
      let activeLineXOffset =
        parseInt(selectedTabDimensions.x.toString()) -
        parseInt(parentDimensions.left.toString()) +
        parseInt(selectedTab.paddingLeft);
      if (isMobile) {
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        activeLineXOffset += parentElement.scrollLeft;
      }
      return { width: width, left: activeLineXOffset };
    };

    // @ts-expect-error TS(2345): Argument of type '{ width: number; left: number; }... Remove this comment to see the full error message
    setIndicatorStyles(getActiveLineDimension());
    if (isMobile && parent.current) centerActiveCategory();
  }, [activeCategory, activeCategoryIndex, parent, isMobile]);

  // Don't render the category bar if all TGIDs are unavailable
  const isAnyTGIDAvailable = Object.keys(allTours).some(
    (tgid) => allTours[tgid].available
  );

  if (!isAnyTGIDAvailable) return null;

  return (
    <>
      <div className="scroll-reference" ref={scroll_div}></div>
      <StyledCategoryBar ref={category_bar} isMobile={isMobile}>
        <CategoryBarWrapper ref={parent} isEntertainmentMb={isEntertainmentMb}>
          <div className="tabs-wrap">
            {categories.map((category: any, index: number) => {
              const { ranking, name } = category || {};
              const { popularity } = ranking || {};
              const availableShows = popularity?.reduce(
                (acc: any, tgid: any) => {
                  if (allTours[tgid]?.available) {
                    acc++;
                  }
                  return acc;
                },
                0
              );
              const showCategoryTab = availableShows > 0;
              return (
                <Conditional if={showCategoryTab} key={index}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      changeCategory(index);
                    }}
                    className={
                      'tab ' + (activeCategory == index ? 'active' : '')
                    }
                    data-tgid={popularity}
                  >
                    {name}
                  </div>
                </Conditional>
              );
            })}
            <div
              className="active-indicator"
              // @ts-expect-error TS(2322): Type '{ width: null; left: null; }' is not assigna... Remove this comment to see the full error message
              style={{ ...indicatorStyles }}
            ></div>
          </div>
          <Conditional if={!isMobile && !hideSortBySelector && !isListicle}>
            <div className="filter-wrapper">
              <SortSelector
                isFilterDropdownActive={filterDropdownActive}
                toggleFilterDropdown={toggleFilterDropdown}
                changeOrder={changeOrder}
                isEntertainmentMb={isEntertainmentMb}
              />
            </div>
          </Conditional>
        </CategoryBarWrapper>
      </StyledCategoryBar>
    </>
  );
};

export default CategoryBar;
