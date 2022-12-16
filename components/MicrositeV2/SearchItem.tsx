import { RichText } from 'prismic-reactjs';
import { useRecoilValue } from 'recoil';
import { searchQueryAtom } from 'store/atoms/searchQuery';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import Image from 'UI/Image';

import { shortCodeSerializer } from '../../utils/shortCodes';

export const SearchItem = (props) => {
  const query = useRecoilValue(searchQueryAtom);
  const {
    tgid,
    showPageUid,
    productImage,
    title,
    cardFooter,
    currencySymbol,
    scratchPrice,
    price,
    onSearchResultClick,
  } = props;
  return (
    <div
      className="search-item"
      role={'button'}
      tabIndex={0}
      onClick={() => {
        onSearchResultClick(tgid, showPageUid);

        trackEvent({
          eventName: ANALYTICS_EVENTS.SEARCH_RESULT_CLICKED,
          [ANALYTICS_PROPERTIES.TGID]: tgid,
          [ANALYTICS_PROPERTIES.SEARCH_QUERY]: query,
        });
      }}
    >
      <div className="left">
        <div className="image">
          <Image
            url={productImage}
            imageId={tgid}
            format="pjpg"
            width={208}
            height={128}
            aspectRatio={'16:10'}
            alt={title}
          />
        </div>
      </div>
      <div className="right">
        <div className="search-title">{title}</div>
        {cardFooter && RichText.asText(cardFooter) && (
          <div className="booster">
            <RichText
              render={cardFooter}
              htmlSerializer={shortCodeSerializer}
            />
          </div>
        )}
        <div className="price-wrapper">
          <div className="current-price">
            {currencySymbol}
            {price}
          </div>
          {scratchPrice ? (
            <div className="old-price">
              {currencySymbol}
              {scratchPrice}
            </div>
          ) : null}
        </div>
      </div>
      <style jsx>
        {`
          .search-item {
            display: grid;
            font-family: ${HALYARD.FONT_STACK};
            grid-template-columns: 105px auto;
            grid-column-gap: 16px;
            cursor: pointer;
          }

          .search-item .search-title {
            font-family: ${HALYARD.FONT_STACK};
            font-size: 16px;
            color: ${COLORS.GRAY.G2};
            font-weight: 600;
            line-height: 1.2;
          }

          .search-item .right {
            display: grid;
            grid-gap: 4px;
            grid-auto-flow: row;
            grid-auto-rows: max-content;
          }

          .search-item .price-wrapper {
            margin-top: 8px;
            display: grid;
            grid-template-columns: auto auto;
            justify-content: left;
            grid-gap: 5px;
            align-items: end;
          }

          .search-item .old-price {
            font-size: 10px;
            text-decoration: line-through;
            color: #757575;
            font-weight: 400;
          }
          .search-item .current-price {
            font-size: 14px;
            color: ${COLORS.GRAY.G2};
            font-weight: 500;
          }
          @media (max-width: 768px) {
            .search-item .search-title {
              font-size: 14px;
              font-weight: 600;
            }
          }
        `}
      </style>
      <style jsx global>
        {`
          .search-item img {
            width: 100%;
            border-radius: 4px;
            height: 64px;
            object-fit: cover;
          }
          .search-item picture {
            display: flex;
          }
          .booster p {
            margin: 0;
          }
          @media (max-width: 768px) {
            .booster p {
              font-size: 12px;
              color: ${COLORS.TEXT.BEACH};
            }
            .booster p * {
              display: none;
            }
            .booster p *:first-child {
              display: unset;
            }
          }
        `}
      </style>
    </div>
  );
};
