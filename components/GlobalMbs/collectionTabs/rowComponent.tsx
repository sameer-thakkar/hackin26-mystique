import { FunctionComponent, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { scroller } from 'react-scroll';
import { useWindowWidth } from '@react-hook/window-size';
import Conditional from 'components/common/Conditional';
import Card from 'components/GlobalMbs/collectionTabs/collectionCard';
import DetailedCollectionCard from 'components/GlobalMbs/collectionTabs/detailedCollectionCard';

const RowWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  @media (max-width: 768px) {
    grid-template-columns: unset;
    grid-auto-flow: row;
    grid-auto-rows: max-content;
  }
  &:not(:last-child) {
    margin-bottom: 24px;
  }
`;

interface RowComponentProps {
  cards: any[];
  categoryData: any[];
}
const RowComponent: FunctionComponent<RowComponentProps> = ({
  cards,
  categoryData,
}) => {
  const width = useWindowWidth();
  const isMobile = width <= 768;
  const [activeCard, setActiveCard] = useState(null);
  const [activeCardPrice, setActiveCardPrice] = useState(null);

  const scrollToDetails = (id) => {
    scroller.scrollTo(id, {
      duration: 1200,
      offset: -78,
      smooth: 'easeInOutQuart',
    });
  };

  const detailedCardRef = useRef<HTMLDivElement | null>(null);
  const getPrice = (currentCardCatId) => {
    const data = categoryData?.filter(
      (data) => data?.catId === currentCardCatId
    );
    return data?.length ? data?.reduce((acc, curr) => acc + curr) : {};
  };

  const updateActiveCard = (e, activeCard) => {
    setActiveCard(activeCard);
    const price = getPrice(activeCard?.data.headout_category_id);
    setActiveCardPrice(price);
  };
  const closeActiveCard = () => {
    setActiveCard(null);
  };

  useLayoutEffect(() => {
    if (activeCard && detailedCardRef?.current) {
      const targetId = detailedCardRef?.current?.getAttribute('id');
      scrollToDetails(targetId);
    }
  }, [activeCard]);

  const cardMarkup = cards?.map((card, index) => {
    const price = getPrice(card?.data?.headout_category_id);
    return (
      <Card
        key={index}
        card={card}
        clickHandler={updateActiveCard}
        isMobile={isMobile}
        price={price?.startingPrice}
        currency={price?.currency?.localSymbol}
      />
    );
  });

  return (
    <>
      <RowWrapper>{cardMarkup}</RowWrapper>
      <Conditional if={!isMobile && activeCard}>
        <DetailedCollectionCard
          ref={detailedCardRef}
          data={activeCard}
          clickHandler={closeActiveCard}
          isMobile={isMobile}
          price={activeCardPrice?.startingPrice}
          currency={activeCardPrice?.currency?.localSymbol}
        />
      </Conditional>
    </>
  );
};

export default RowComponent;
