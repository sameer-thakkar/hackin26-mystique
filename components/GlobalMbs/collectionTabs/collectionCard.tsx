import { FLAME } from 'assets/SvgIcons';
import Conditional from 'components/common/Conditional';
import { FALLBACK_IMAGE, SIDEBAR_TYPES } from 'const/index';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { MBContext } from 'contexts/MBContext';
import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import Image from 'UI/Image';

import DetailedCollectionCard from './detailedProductCard';
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
    z-index: 50;
    font-size: 12px;
    font-style: normal;
    font-weight: ${SOLEIL.REGULAR};
    line-height: 14px;
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
  .l2-booter-wrapper {
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

type CardProps = {
  card: any;
  clickHandler: (e: React.MouseEvent<HTMLButtonElement>, index: number) => void;
  isMobile: boolean;
  price?: string;
  currency?: string;
};

const Card: FunctionComponent<CardProps> = ({
  card,
  clickHandler,
  isMobile,
  price,
  currency,
}) => {
  const imageUrl = card?.data?.images[0]?.image_url || FALLBACK_IMAGE;

  const hasBestSeller = card?.data?.other_filters?.length
    ? card?.data?.other_filters?.some(
        (tag) => tag?.filter_name === 'Bestseller'
      )
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

  return (
    <StyledCard onClick={handleClick}>
      <div className="image-wrapper">
        <Conditional if={hasBestSeller}>
          <div className="l1-booster">{FLAME} Bestseller</div>
        </Conditional>
        <Image url={imageUrl} />
      </div>
      <div className="l2-booter-wrapper">
        <div className="category">{card?.data?.primary_category}</div>
      </div>
      <div className="name">{card?.data?.collection_name}</div>
      <Conditional if={card?.data?.headout_category_id}>
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
