import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { MBContext } from 'contexts/MBContext';
import Image from 'UI/Image';
import Conditional from 'components/common/Conditional';
import DetailedCollectionCard from 'components/GlobalMbs/collectionTabs/detailedCollectionCard';
import { FALLBACK_IMAGES, SIDEBAR_TYPES } from 'const/index';
import { COLORS, SOLEIL } from 'const/ui-constants';

const StyledCard = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: max-content;
  cursor: pointer;

  .image-wrapper {
    position: relative;
    svg {
      width: 12px;
      height: 12px;
      margin-right: 2px;
    }
  }
  .l1-booster {
    position: absolute;
    display: flex;
    align-items: center;
    top: 12px;
    left: 12px;
    background-color: ${COLORS.WHITE};
    width: max-content;
    padding: 4px 8px;
    border-radius: 2px;
    z-index: 20;
    font-size: 12px;
    font-style: normal;
    font-weight: ${SOLEIL.REGULAR};
    line-height: 14px;
    span {
      margin-right: 4px;
    }
  }
  img {
    width: 100%;
    height: 180px;
    border-radius: 4px;
    object-fit: cover;
    margin-bottom: 8px;

    @media (max-width: 500px) {
      height: 218px;
    }
  }
  .l2-booster-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3px;
    .category {
      line-height: 16px;
      font-size: 12px;
      font-style: normal;
      font-weight: ${SOLEIL.REGULAR};
      color: ${COLORS.GREY.G4};
    }
  }
  .name {
    font-size: 16px;
    font-style: normal;
    font-weight: ${SOLEIL.SEMIBOLD};
    line-height: 20px;
  }
  .price-wrapper {
    display: grid;
    grid-template-rows: repeat(2, max-content);
    gap: 5px;
    margin-top: 8px;
    .text {
      line-height: 16px;
      font-size: 12px;
      font-style: normal;
      font-weight: ${SOLEIL.REGULAR};
      color: ${COLORS.GREY.G4};
    }
    .price {
      font-size: 16px;
      font-style: normal;
      font-weight: ${SOLEIL.SEMIBOLD};
      line-height: 16px;
    }
  }
`;

interface CardProps {
  card: any;
  clickHandler: (e: React.MouseEvent<HTMLButtonElement>, index: number) => void;
  isMobile: boolean;
  price?: string;
  currency?: string;
}

const Card: FunctionComponent<CardProps> = ({
  card,
  clickHandler,
  isMobile,
  price,
  currency,
}) => {
  const {
    data: {
      images,
      other_filters: otherFilters,
      primary_category: primaryCategory,
      collection_name: collectionName,
      headout_category_id: categoryId,
    },
  } = card;
  const imageUrl = images[0]?.image_url || FALLBACK_IMAGES.THEMEPARKS;

  const BEST_SELLER = 'Bestseller';

  const hasBestSeller = otherFilters?.length
    ? otherFilters?.some((tag) => tag?.filter_name === BEST_SELLER)
    : false;

  const {
    sidebarModal: { addToAside },
  } = useContext(MBContext);

  const handleClick = (e) => {
    if (isMobile) {
      addToAside({
        width: '100vw',
        children: (
          <DetailedCollectionCard
            data={card}
            isMobile={isMobile}
            price={price}
            currency={currency}
          />
        ),
        type: SIDEBAR_TYPES.PRODUCT_CARD,
      });
    }
    if (!isMobile) {
      clickHandler(e, card);
    }
  };
  const ASPECT_RATIO = '16:10';
  return (
    <StyledCard onClick={handleClick}>
      <div className="image-wrapper">
        <Conditional if={hasBestSeller}>
          <div className="l1-booster">
            <span role="img" aria-label="Hot">
              🔥
            </span>
            {BEST_SELLER}
          </div>
        </Conditional>
        <Image
          url={imageUrl}
          aspectRatio={ASPECT_RATIO}
          autoCrop={false}
          width={800}
          height={400}
        />
      </div>
      <div className="l2-booster-wrapper">
        <div className="category">{primaryCategory}</div>
      </div>
      <div className="name">{collectionName}</div>
      <Conditional if={categoryId && price}>
        <div className="price-wrapper">
          <div className="text">Tickets start from</div>
          <div className="price">
            {currency} {price}
          </div>
        </div>
      </Conditional>
    </StyledCard>
  );
};

export default Card;
