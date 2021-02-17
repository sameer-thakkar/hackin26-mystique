import React, { useState } from 'react';
import { PAGETYPE } from 'const/index';
import { CLOSE_WHITE } from 'assets/SvgIcons';
import { SOLEIL } from 'const/ui-constants';

import { SearchBox } from '../SearchBox';
import { SearchItem } from '../SearchItem';
import PopulateProducts from '../PopulateProducts';

export const SearchPage = (props) => {
  const [results, setResults] = useState([]);
  const [searchStarted, setsearchStarted] = useState(false);
  const handleResults = (results) => {
    setResults(results);
    setsearchStarted(true);
  };
  const loadHomepage = () => {
    props.changePage({ name: PAGETYPE.HOMEPAGE });
  };

  const searchItemClick = (productTgid) => {
    props.changePage({
      name: PAGETYPE.MOBILE_PRODUCT_PAGE,
      tgid: productTgid,
    });
  };

  const { isMobile, allTours, headerProps, changePage } = props;
  const defaultSearchTgids = headerProps.recommendedTours;
  const allToursArray = Object.values(allTours);

  return (
    <div>
      <div className="search-header">
        <SearchBox
          allToursArray={allToursArray}
          handleResults={handleResults}
          isMobile={isMobile}
        />
        <span
          onClick={loadHomepage}
          role="button"
          tabIndex={0}
          className="icon"
        >
          {CLOSE_WHITE}
        </span>
      </div>
      {!searchStarted && defaultSearchTgids.length ? (
        <div className="suggestions-wrap">
          <div className="heading">Suggested</div>
          <PopulateProducts
            propTgids={defaultSearchTgids}
            allTours={allTours}
            isMobile={isMobile}
            showAll={true}
            changePage={changePage}
          />
        </div>
      ) : null}
      <div className="search-results">
        {results.length
          ? results.map(({ item }, index) => {
              return (
                <SearchItem
                  key={index}
                  onSearchResultClick={searchItemClick}
                  {...item}
                />
              );
            })
          : null}
      </div>
      <pre></pre>
      <style jsx>
        {`
          .icon {
            display: flex;
            filter: invert(1);
          }
          .search-header {
            padding: 10px 16px;
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            justify-content: space-between;
            font-family: ${SOLEIL.FONT_STACK};
            grid-gap: 10px;
            border-bottom: 1px solid #dadada;
          }

          .search-results {
            display: grid;
            grid-row-gap: 32px;
            padding: 32px 16px;
          }
          .search-results .search-item {
          }
          .search-results img {
            height: 64px;
            width: 104px;
          }
          .suggestions-wrap {
            margin: 0 16px;
            margin-top: 32px;
            display: grid;
          }
          .heading {
            font-size: 22px;
            font-weight: ${SOLEIL.SEMIBOLD};
            font-family: ${SOLEIL.FONT_STACK};
            color: #545454;
          }
        `}
      </style>
      <style global jsx>{`
        .suggestions-wrap .product-wrapper {
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
};
