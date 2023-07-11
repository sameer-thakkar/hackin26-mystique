import React, { useEffect, useState } from 'react';
import { PAGETYPE } from 'const/index';
import { HALYARD } from 'const/ui-constants';
import { CHEVRON_LEFT, SEARCH_ICON } from 'assets/SvgIcons';
import { ProductsWrapper } from '../ProductsWrapper';
import { SortSelector } from '../SortSelector';

export const CategoryPage = (props: any) => {
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [activeCategoryArray, setActiveCategory] = useState(null);

  useEffect(() => {
    if (!window) return;
    window.scrollTo(0, 0);
  });

  const toggleFilterDropdown = () => {
    setFilterDropdown((oldFilterDropdown) => !oldFilterDropdown);
  };

  const loadHomepage = () => {
    props.changePage({ name: PAGETYPE.HOMEPAGE });
  };

  const loadSearchPage = () => {
    props.changePage({ name: PAGETYPE.SEARCH });
  };

  const changeOrder = (orderKey: any) => {
    let { categories } = props.categoryProps;
    setActiveCategory(categories[props.category].ranking[orderKey]);
  };

  const { changePage, category, allTours, isMobile, categoryProps } = props;
  return (
    <div>
      <div className="category-header">
        <span
          role="button"
          tabIndex={0}
          onClick={() => {
            loadHomepage();
          }}
          className="icon"
        >
          {CHEVRON_LEFT}
        </span>

        <span
          onClick={loadSearchPage}
          role="button"
          tabIndex={0}
          className="search-trigger icon"
        >
          {SEARCH_ICON}
        </span>
      </div>
      <div className="category-wrapper">
        <div className="category-head">
          <div className="category-title">{category.name}</div>
          <div className="filters">
            <SortSelector
              isFilterDropdownActive={filterDropdown}
              toggleFilterDropdown={toggleFilterDropdown}
              changeOrder={changeOrder}
            />
          </div>
        </div>
        <div className="category-content">
          <ProductsWrapper
            changePage={changePage}
            activeCategory={category}
            categoryProps={categoryProps}
            isMobile={isMobile}
            allTours={allTours}
            propsTgids={activeCategoryArray}
          />
        </div>
      </div>
      <style jsx>
        {`
          .category-header {
            padding: 18px 16px;
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            font-family: ${HALYARD.FONT_STACK};
            grid-gap: 10px;
            border-bottom: 1px solid #dadada;
          }
          .search-trigger {
            grid-column: 3 / 4;
          }
          .category-wrapper {
            margin: 40px 16px;
            margin-bottom: 0;
          }
          .icon {
            display: flex;
          }
          .category-title {
            font-size: 24px;
            font-family: ${HALYARD.FONT_STACK};
            font-weight: 500;
          }

          .category-head {
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: start;
          }
        `}
      </style>
      <style jsx global>
        {`
          .category-wrapper .main-wrapper {
            padding: 0;
          }
        `}
      </style>
    </div>
  );
};
