import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from '../../utils/shortCodes';
import Image from '../UI/Image';
import { AVENIR, GRAPHIK, COLORS } from '../../constants/ui-constants';

export const SearchItem = props => {
  const {
    tgid,
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
      onClick={() => {
        onSearchResultClick(tgid);
      }}
    >
      <div className="left">
        <div className="image">
          <Image
            url={productImage}
            imageId={tgid}
            format="pjpg"
            width={800}
            height={700}
          />
        </div>
      </div>
      <div className="right">
        <div className="search-title">{title}</div>
        {RichText.asText(cardFooter) && (
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
            font-family: ${GRAPHIK.FONT_STACK};
            grid-template-columns: 105px auto;
            grid-column-gap: 16px;
            cursor: pointer;
          }

          .search-item .search-title {
            font-family: ${AVENIR.FONT_STACK};
            font-size: 16px;
            color: ${COLORS.DAVY_GREY};
            font-weight: ${AVENIR.HEAVY};
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
            line-height: 12px;
            text-decoration: line-through;
            color: #757575;
            font-weight: ${GRAPHIK.REGULAR};
          }
          .search-item .current-price {
            font-size: 14px;
            color: ${COLORS.DAVY_GREY};
            font-weight: ${GRAPHIK.HEAVY};
          }
          @media (max-width: 768px) {
            .search-item .search-title {
              font-size: 14px;
              font-weight: ${AVENIR.HEAVY};
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
              color: ${COLORS.TEAL};
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
