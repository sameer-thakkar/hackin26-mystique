import React, { useState, useContext, useLayoutEffect, useRef } from 'react';
import { SortSelector } from './SortSelector';
import InteractionContext from '../../contexts/Interaction';
import { AVENIR, SIZES } from '../../constants/ui-constants';

const CategoryBar = props => {
  const interactionCtx = useContext(InteractionContext);
  const tagsRef = {};
  const parent = useRef(null);
  const category_bar = useRef(null);
  const scroll_div = useRef(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [filterDropdownActive, setFilterDropdownActive] = useState(false);
  const [indicatorStyles, setIndicatorStyles] = useState({
    width: null,
    left: null,
  });
  const [sticky, setSticky] = useState(false);
  const { categories, isMobile } = props;

  const toggleFilterDropdown = () => {
    setFilterDropdownActive(oldState => !oldState);
  };

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

  const changeCategory = index => {
    let { categories, isMobile } = props;
    props.changeCategory({
      tgidArray: categories[index].ranking.popularity,
      index: index,
    });

    interactionCtx.changeCategory(categories[index].ranking.popularity);
    setActiveCategory(index);
  };

  const changeOrder = orderKey => {
    let { categories, changeCategory } = props;
    changeCategory({
      tgidArray: categories[activeCategory].ranking[orderKey],
      index: activeCategory,
    });

    interactionCtx.changeCategory(categories[activeCategory].ranking[orderKey]);
  };

  const getActiveLineDimension = () => {
    const parentElement = parent.current;
    const tag = parentElement.querySelector('.tab.active');
    const { isMobile } = props;
    let seletectedTab = window.getComputedStyle(tag);
    let width = parseFloat(seletectedTab.width);
    let selectedTabDimensions = tag.getBoundingClientRect();
    let parentDimensions = parentElement.getBoundingClientRect();
    let activeLineXOffset =
      parseInt(selectedTabDimensions.x) -
      parseInt(parentDimensions.left) +
      parseInt(seletectedTab.paddingLeft);
    if (isMobile) {
      activeLineXOffset += parentElement.scrollLeft;
    }
    return { width: width, left: activeLineXOffset };
  };

  useLayoutEffect(() => {
    setIndicatorStyles(getActiveLineDimension());
    if (isMobile && parent.current) centerActiveCategory();
  }, [activeCategory]);

  return (
    <>
      <div className="scroll-reference" ref={scroll_div}></div>
      <div className={`category-bar `} ref={category_bar}>
        <div className="category-bar-wrapper" ref={parent}>
          <ul className="tabs-wrap">
            {categories.map((category, index) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    changeCategory(index);
                  }}
                  className={'tab ' + (activeCategory == index ? 'active' : '')}
                  data-tgid={category.ranking.popularity}
                >
                  {category.name}
                </li>
              );
            })}
            <li
              className="active-indicator"
              style={{ ...indicatorStyles }}
            ></li>
          </ul>
          {!isMobile ? (
            <div className="filter-wrapper">
              <SortSelector
                isFilterDropdownActive={filterDropdownActive}
                toggleFilterDropdown={toggleFilterDropdown}
                changeOrder={changeOrder}
              />
            </div>
          ) : null}
        </div>
        <style jsx>
          {`
            .category-bar-wrapper {
              display: grid;
              grid-template-columns: 1fr auto;
              align-items: center;
              border-bottom: 1px solid #ebebeb;
              grid-gap: 8px;
              padding-top: 36px;
              padding-bottom: 14px;
            }
            .category-bar {
              position: sticky;
              background: #fff;
              top: 0;
              z-index: 20;
            }

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
              font-family: ${AVENIR.FONT_STACK};
              font-size: 22px;
              line-height: 1.3;
              color: #545454;
              font-weight: ${AVENIR.MEDIUM};
              text-align: center;
              cursor: pointer;
            }
            .tab.active {
              color: #ec1943;
            }
            .active-indicator {
              position: absolute;
              bottom: -14px;
              left: 0;
              width: 100px;
              height: 2px;
              background: #ec1943;
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
              font-family: Avenir;
            }

            @media (max-width: 768px) {
              .category-bar {
                margin-left: -16px;
                margin-right: -16px;
              }
              .category-bar .tabs-wrap {
                padding-left: 16px;
                padding-right: 16px;
              }
              .tabs-wrap {
                width: max-content;
              }
              .category-bar-wrapper {
                overflow-y: hidden;
                overflow-x: scroll;
                -webkit-overflow-scrolling: touch;
                padding-top: 19px;
                margin-top: 24px;
              }
              .tab {
                font-size: 18px;
                font-family: ${AVENIR.FONT_STACK};
                font-weight: ${AVENIR.MEDIUM};
              }
              .filter-wrapper {
                display: none;
              }
            }
          `}
        </style>
        <style jsx global>
          {`
            .swiper-container {
              overflow: unset;
            }
            .carousel img {
              border-radius: 10px;
            }
            .category-bar.sticky .category-bar-wrapper {
              position: fixed;
              background: #fff;
              max-width: ${SIZES.MAX_WIDTH};
              margin: auto;
              top: 0;
              left: 50%;
              transform: translatex(-50%);
              z-index: 999;
              width: 100%;
            }
            .category-bar.sticky::before {
              content: '';
              height: 80px;
              display: block;
            }
            .category-bar.sticky .active-indicator {
              bottom: -16px;
            }
            @media (max-width: 768px) {
              .category-bar.sticky .active-indicator {
                bottom: -14px;
              }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default CategoryBar;
