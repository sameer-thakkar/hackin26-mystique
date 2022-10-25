import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
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

const StyledCategoryBar = styled.div`
  height: fit-content;
  position: sticky;
  background: ${COLORS.BRAND.WHITE};
  top: 0;
  z-index: 20;

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

const CategoryBarWrapper = styled.div`
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
const CategoryBar = (props) => {
  const { changeCategory: changeCategoryHandler } =
    useContext(InteractionContext) || {};
  const pageMetaData = useRecoilValue(metaAtom);
  const parent = useRef(null);
  const category_bar = useRef(null);
  const scroll_div = useRef(null);
  const [activeCategory, setActiveCategory] = useState(0);
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
  const toggleFilterDropdown = (dropdownState) => {
    if (!filterDropdownActive)
      trackEvent({
        eventName: ANALYTICS_EVENTS.MB_SORT_BY_CLICKED,
        ...getCommonEventMetaData(pageMetaData),
      });
    setFilterDropdownActive((oldState) =>
      typeof dropdownState !== 'undefined' ? dropdownState : !oldState
    );
  };

  const changeCategory = (index) => {
    let { categories } = props;
    setActiveCategory(index);
    changeCategoryHandler(categories[index].ranking[activeOrder], index);
    const ranking = categories
      .filter((category) =>
        category?.ranking?.popularity?.length
          ? category.ranking.popularity.some(
              (tgid) => allTours[tgid]?.available
            )
          : false
      )
      .findIndex((category) => category.name === categories[index].name);

    trackEvent({
      eventName: ANALYTICS_EVENTS.CATEGORY_TAB_CLICKED,
      ...getCommonEventMetaData(pageMetaData),
      [ANALYTICS_PROPERTIES.RANKING]: ranking + 1,
      [ANALYTICS_PROPERTIES.HEADING]: categories[index].name,
    });
  };

  const changeOrder = (orderKey) => {
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
  };

  useEffect(() => {
    if (!parent.current) return;

    const centerActiveCategory = () => {
      const parentElement = parent.current;
      const selectedTab = parentElement.querySelector('.tab.active');
      if (isMobile) {
        selectedTab.scrollIntoView({
          inline: 'center',
          behavior: 'smooth',
          block: 'end',
        });
      }
    };

    const getActiveLineDimension = () => {
      const parentElement = parent.current;
      const tag = parentElement.querySelector('.tab.active');
      let selectedTab = window.getComputedStyle(tag);
      let width = parseFloat(selectedTab.width);
      let selectedTabDimensions = tag.getBoundingClientRect();
      let parentDimensions = parentElement.getBoundingClientRect();
      let activeLineXOffset =
        parseInt(selectedTabDimensions.x) -
        parseInt(parentDimensions.left) +
        parseInt(selectedTab.paddingLeft);
      if (isMobile) {
        activeLineXOffset += parentElement.scrollLeft;
      }
      return { width: width, left: activeLineXOffset };
    };

    setIndicatorStyles(getActiveLineDimension());
    if (isMobile && parent.current) centerActiveCategory();
  }, [activeCategory, parent, isMobile]);

  // Don't render the category bar if all TGIDs are unavailable
  const isAnyTGIDAvailable = Object.keys(allTours).some(
    (tgid) => allTours[tgid].available
  );

  if (!isAnyTGIDAvailable) return null;

  return (
    <>
      <div className="scroll-reference" ref={scroll_div}></div>
      <StyledCategoryBar ref={category_bar}>
        <CategoryBarWrapper ref={parent} isEntertainmentMb={isEntertainmentMb}>
          <div className="tabs-wrap">
            {categories.map((category, index) => {
              const { ranking, name } = category || {};
              const { popularity } = ranking || {};
              const availableShows = popularity?.reduce((acc, tgid) => {
                if (allTours[tgid]?.available) {
                  acc++;
                }
                return acc;
              }, 0);
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
