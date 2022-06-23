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
  setRow: any;
  setSectionIndex: any;
  sectionIndex: any;
  cards: any[];
  categoryData: any[];
  ticketPages?: any[];
}
const RowComponent: FunctionComponent<RowComponentProps> = ({
  setRow,
  setSectionIndex,
  sectionIndex,
  cards,
  categoryData,
  ticketPages = [],
}) => {
  const width = useWindowWidth();
  const isMobile = width <= 768;
  const [activeCard, setActiveCard] = useState(null);
  const [activeCardPrice, setActiveCardPrice] = useState(null);
  const [ticketURL, setTicketURl] = useState('');

  const scrollToDetails = (id) => {
    scroller.scrollTo(id, {
      duration: 1200,
      offset: -78,
      smooth: 'easeInOutQuart',
    });
  };

  const detailedCardRef = useRef<HTMLDivElement | null>(null);
  const getPrice = (currentCardCatId) => {
    return categoryData?.find(
      (category) => category?.id === Number(currentCardCatId)
    );
  };

  const updateActiveCard = (e, active_card) => {
    setRow(sectionIndex);
    if (activeCard?.id !== active_card?.id) {
      setActiveCard(active_card);
      const ticketURL = ticketPages?.filter(
        (page) => page.data.collection.id === active_card?.id
      )?.[0]?.uid;
      setTicketURl(ticketURL);
      const price = getPrice(
        active_card?.data.headout_collection_id ||
          active_card?.data.headout_category_id
      );
      setActiveCardPrice(price);
    } else {
      closeActiveCard();
    }
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
    const price = getPrice(
      card?.data?.headout_collection_id || card?.data.headout_category_id
    );
    return (
      <Card
        key={index}
        card={card}
        clickHandler={updateActiveCard}
        isMobile={isMobile}
        price={price?.startingPrice}
        currency={price?.currency}
      />
    );
  });

  return (
    <>
      <RowWrapper>{cardMarkup}</RowWrapper>
      <Conditional if={setSectionIndex === sectionIndex}>
        <Conditional if={!isMobile && activeCard}>
          <DetailedCollectionCard
            ref={detailedCardRef}
            data={activeCard}
            clickHandler={closeActiveCard}
            isMobile={isMobile}
            price={activeCardPrice?.startingPrice}
            currency={activeCardPrice?.currency}
            ticketURL={ticketURL}
          />
        </Conditional>
      </Conditional>
    </>
  );
};

export default RowComponent;
