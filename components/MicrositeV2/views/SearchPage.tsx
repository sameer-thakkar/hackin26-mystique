import React, { ComponentType, useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { MBContext } from 'contexts/MBContext';
import { getProductCardDestination } from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import { PAGETYPE } from 'const/index';
import { HALYARD } from 'const/ui-constants';
import { CLOSE_WHITE } from 'assets/SvgIcons';
import PopulateProducts from '../PopulateProducts';

const SearchBox: ComponentType<any> = dynamic(
  () => import('components/MicrositeV2/SearchBox').then((mod) => mod.SearchBox),
  { ssr: false }
);
const SearchItem: ComponentType<any> = dynamic(
  () =>
    import('components/MicrositeV2/SearchItem').then((mod) => mod.SearchItem),
  { ssr: false }
);

export const SearchPage = (props: any) => {
  const [results, setResults] = useState([]);
  const [searchStarted, setsearchStarted] = useState(false);
  const handleResults = (results: any) => {
    setResults(results);
    setsearchStarted(true);
  };
  const loadHomepage = () => {
    props.changePage({ name: PAGETYPE.HOMEPAGE });
  };
  const { currentLanguage, isLTT } = props;
  const { nakedDomain, isDev, host, redirectToHeadoutBookingFlow } = useContext(
    MBContext
  );
  const currency = useRecoilValue(currencyAtom);

  const searchItemClick = (
    productTgid: any,
    showPageUid: string,
    flowType: string,
    urlSlugs: string[]
  ) => {
    if (isLTT) {
      const { destinationUrl } = getProductCardDestination({
        nakedDomain,
        lang: currentLanguage,
        tgid: productTgid,
        redirectToHeadoutBookingFlow,
        currency,
        flowType,
        urlSlugs,
        showPageUid,
        isDev,
        host,
      });
      window.open(destinationUrl, '_self', 'noopener,noreferrer');
    } else {
      props.changePage({
        name: PAGETYPE.MOBILE_PRODUCT_PAGE,
        tgid: productTgid,
      });
    }
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
                  // @ts-expect-error TS(2698): Spread types may only be created from object types... Remove this comment to see the full error message
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
            font-family: ${HALYARD.FONT_STACK};
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
            font-weight: 600;
            font-family: ${HALYARD.FONT_STACK};
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

export default SearchPage;
