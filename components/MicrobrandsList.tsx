import React, { Component } from 'react';
import { tourListApiParser } from '../utils/dataParsers';
import { LinkCards } from './slices/MicrobrandCards';
import styled from 'styled-components';
import { SOLEIL } from '../constants/ui-constants';

const StyledMBList = styled.div`
  max-width: 1200px;
  margin: auto;

  .microbrands-list-heading {
    border-left: 3px solid #669dde;
    padding: 5px 10px 5px;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.SEMIBOLD};
    color: #000000;
    margin: 40px 0px;
    font-size: 2em;
  }
  @media (max-width: 768px) {
    margin: auto 25px;
    .microbrands-list-heading {
      font-size: 24px;
    }
  }
`;

export default class MicrobrandList extends Component<any, any> {
  state = {
    cardPrices: {},
    currencySymbol: '',
    isFetched: false,
  };

  async componentDidMount() {
    const { microbrandCards } = this.props;
    const tgids = microbrandCards.map((card) => card.tgid);
    const tgidsExist = tgids.filter((tgid) => tgid);
    if (tgidsExist.length) {
      const fetchPrice = await fetch(
        `https://api.headout.com/api/v5/tour-group/list?ids[]=${tgidsExist}`
      ).then((res) => res.json());
      const cardPrices = tourListApiParser(fetchPrice);
      const currencySymbol = fetchPrice.currencies[0].localSymbol;
      this.setState({
        cardPrices: cardPrices,
        currencySymbol: currencySymbol,
        isFetched: true,
      });
    }
  }

  render() {
    const { microbrandCards, microbrandCardsHeading } = this.props;
    const { isFetched, currencySymbol, cardPrices } = this.state;
    const finalCards = microbrandCards.map((card) => {
      return {
        image: {
          url: card.image_source.url || card.image_url.url,
          alt: card.card_title,
        },
        title: card.card_title,
        tgid: card.tgid,
        link: card.microbrand_link.url,
      };
    });
    return (
      <StyledMBList className="microbrands-list">
        {microbrandCardsHeading && (
          <div className="microbrands-list-heading">
            {microbrandCardsHeading}
          </div>
        )}
        {microbrandCards.length ? <br /> : null}
        <LinkCards
          isFetched={isFetched}
          cards={finalCards}
          cardPrices={cardPrices}
          currencySymbol={currencySymbol}
        />
      </StyledMBList>
    );
  }
}
