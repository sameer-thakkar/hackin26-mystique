import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import InteractionContext from 'contexts/Interaction';
import Conditional from 'components/common/Conditional';
import { SortSelector } from 'components/MicrositeV2/SortSelector';
import { SOLEIL, SIZES, COLORS } from 'const/ui-constants';

const StyledCategoryBar = styled.div`
  position: sticky;
  background: ${COLORS.WHITE};
  top: 0;
  z-index: 20;

  .swiper-container {
    overflow: unset;
  }
  .carousel img {
    border-radius: 10px;
  }
  @media (max-width: 768px) {
    margin-left: -16px;
    margin-right: -16px;
  }
`;

const CategoryBarWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border-bottom: ${({ isEntertainmentMb }) =>
    isEntertainmentMb
      ? `1px solid ${COLORS.GREY_G6}`
      : `1px solid ${COLORS.CHALK}`};
  grid-gap: 8px;
  padding-top: 36px;
  padding-bottom: 14px;

  .tabs-wrap {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-auto-flow: column;
    justify-content: left;
    grid-column-gap: 30px;
    position: relative;
  }
  .tab {
    font-family: ${SOLEIL.FONT_STACK};
    font-size: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '21px' : '22px'};
    line-height: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '28px' : '1.3'};
    color: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? COLORS.GREY.G2 : COLORS.DAVY_GREY};
    font-weight: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? SOLEIL.SEMIBOLD : SOLEIL.MEDIUM};
    text-align: center;
    cursor: pointer;
  }
  .tab.active {
    color: ${COLORS.RHAPSODY};
  }
  .active-indicator {
    position: absolute;
    bottom: -16px;
    left: 0;
    width: 100px;
    height: 2px;
    background: ${COLORS.RHAPSODY};
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
    grid-column-gap: 8px;
    grid-template-columns: auto auto;
  }
  .filter-wrapper span {
    font-family: ${SOLEIL.FONT_STACK};
  }

  @media (max-width: 768px) {
    overflow-y: hidden;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    padding-top: 19px;
    margin-top: 24px;
    .tabs-wrap {
      padding-left: 16px;
      padding-right: 16px;
    }
    .tabs-wrap {
      width: max-content;
    }
    .active-indicator {
      bottom: -14px;
    }
    .tab {
      font-size: 18px;
      font-family: ${SOLEIL.FONT_STACK};
      font-weight: ${SOLEIL.MEDIUM};
    }
    .filter-wrapper {
      display: none;
    }
  }
`;
const CategoryBar = (props) => {
  const interactionCtx = useContext(InteractionContext);
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
  const { categories, isMobile, hideSortBySelector, isEntertainmentMb } = props;
  const toggleFilterDropdown = () => {
    setFilterDropdownActive((oldState) => !oldState);
  };

  const changeCategory = (index) => {
    let { categories } = props;
    interactionCtx.changeCategory(categories[index].ranking[activeOrder]);
    setActiveCategory(index);
  };

  const changeOrder = (orderKey) => {
    let { categories } = props;
    setActiveOrder(orderKey);

    interactionCtx.changeCategory(categories[activeCategory].ranking[orderKey]);
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

  return (
    <>
      <div className="scroll-reference" ref={scroll_div}></div>
      <StyledCategoryBar ref={category_bar}>
        <CategoryBarWrapper ref={parent} isEntertainmentMb={isEntertainmentMb}>
          <div className="tabs-wrap">
            {categories.map((category, index) => {
              const { ranking, name } = category || {};
              const { popularity } = ranking || {};
              return (
                <Conditional if={popularity?.length} key={index}>
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
          <Conditional if={!isMobile && !hideSortBySelector}>
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
