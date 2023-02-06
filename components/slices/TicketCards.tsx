import React, { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';
import PriceBlock from 'UI/PriceBlock';
import Button from 'UI/Button';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { getHostName } from 'utils/helper';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';

const TicketCardsWrapper = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  display: grid;
  grid-gap: 24px;
  ${(props) => {
    if ((props as any).twoColumns) {
      return `grid-template-columns: 1fr 1fr;`;
    }
  }}
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TicketCard = styled.div`
  display: grid;
  grid-template-columns: auto max-content max-content;
  grid-template-areas: 'heading price cta';
  grid-gap: 16px;
  align-items: center;
  border: 1px solid ${COLORS.GRAY.G7};
  padding: 16px;
  color: ${COLORS.GRAY.G2};
  @media (max-width: 768px) {
    grid-template-areas: 'heading heading' 'price cta';
    grid-template-columns: 1fr 1fr;
  }
`;

const TicketCardHeading = styled.div`
  grid-area: heading;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: ${COLORS.GRAY.G2};
  margin: 0;
`;

const TicketCardPrice = styled.div`
  grid-area: price;
  .tour-price {
    justify-self: flex-end;
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
  }
  .tour-scratch-price {
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #939393;
    .strike-through {
      text-decoration: line-through;
    }
  }
  @media (max-width: 768px) {
    justify-self: flex-start;
    div {
      justify-content: flex-start;
    }
  }
`;

const TicketCardCTA = styled.div`
  grid-area: cta;
  @media (max-width: 768px) {
    justify-self: flex-end;
  }
`;

type TicketCardsProps = {
  title: string;
  cards: any[];
  twoColumns?: boolean;
};

/**
 *
 * A list of ticket cards with a heading, price and CTA.
 *
 * ### Non-repeatable zone
 * - Title (title of the section)
 *
 * ### Repeatable zone
 * - Card Heading
 * - Tour Group ID
 *  - This is an optional field and will automatically add in the price and heading (if heading is left blank)
 * - CTA Title (Defaults to 'Book Now')
 * - CTA Link
 *
 */

const TicketCards: React.FC<TicketCardsProps> = ({
  title,
  cards,
  twoColumns = false,
}) => {
  const [data, setData] = useState(cards);
  const { isDev, host, isStage, lang } = useContext(MBContext);
  const hostname = getHostName(isStage, isDev, host);
  const tgids = cards.reduce((acc, card) => {
    if (card.tgid) return [...acc, card.tgid];
    else return [...acc];
  }, []);
  const tourListEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    hostname,
    params: {
      'ids[]': tgids?.join(','),
      ...(lang && {
        language: lang,
      }),
    },
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | nu... Remove this comment to see the full error message
    id: null,
  });
  // @ts-expect-error TS(2345): Argument of type '[string | undefined, { fetcher: ... Remove this comment to see the full error message
  const { data: tourListData } = useSWR(tourListEndpoint, {
    fetcher: swrFetcher,
  });

  useEffect(() => {
    if (tourListData) {
      let finalCards = cards.reduce((acc, card) => {
        let temp = null;
        const { name, listingPrice } =
          tourListData?.tourGroups?.find(
            (tour: any) => tour.id === Number(card.tgid)
          ) ?? {};
        temp = {
          name: name,
          listingPrice: listingPrice,
        };
        if (temp) return [...acc, { ...card, ...temp }];
        return [...acc, card];
      }, []);
      setData(finalCards);
    }
  }, [tourListData, cards, setData]);

  return (
    <>
      <h2>{title}</h2>
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <TicketCardsWrapper twoColumns={twoColumns}>
        {data.map(
          (
            {
              card_heading: cardHeading,
              name,
              listingPrice,
              cta_link: ctaLink,
              cta_title: ctaTitle,
            },
            index
          ) => (
            <TicketCard key={index}>
              <TicketCardHeading>{cardHeading || name}</TicketCardHeading>
              <Conditional if={listingPrice}>
                <TicketCardPrice>
                  <PriceBlock
                    lang={lang}
                    listingPrice={listingPrice}
                    showScratchPrice
                  />
                </TicketCardPrice>
              </Conditional>
              <TicketCardCTA>
                <a href={ctaLink.url} target={ctaLink.target}>
                  <Button>{ctaTitle || 'Book Now'}</Button>
                </a>
              </TicketCardCTA>
            </TicketCard>
          )
        )}
      </TicketCardsWrapper>
    </>
  );
};

export default TicketCards;
