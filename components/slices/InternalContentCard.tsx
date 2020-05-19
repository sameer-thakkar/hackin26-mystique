import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { SOLEIL } from 'constants/ui-constants';

const StyledInternalContentCard = styled.div`
  .more-reads-section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 40px;
  }

  .more-reads-section a {
    text-decoration: none;
  }

  .more-reads-image img {
    height: 250px;
    object-fit: cover;
    max-width: 100%;
    width: 100%;
  }
  .more-reads {
    border: 1px solid #ebebeb;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.18);
    height: 100%;
  }
  .more-reads-text-heading {
    display: block;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: 600;
    font-size: 18px;
    color: #080808;
    line-height: 1.5;
  }
  .more-reads-text {
    padding: 0px 20px;
    padding-bottom: 15px;
    padding-top: 15px;
    line-height: 1.5;
  }
  .more-reads-text-text {
    display: block;
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    line-height: 1.5;
    color: #444444;
  }
  .more-reads-text-heading {
    color: #444444;
  }
  @media (max-width: 768px) {
    .more-reads {
      margin-bottom: 20px;
    }
    .more-reads-section {
      display: block;
    }
  }
`;
export default class InternalContentCard extends PureComponent<any, any> {
  render() {
    const { title, cards } = this.props;
    return (
      <StyledInternalContentCard>
        <h2 className="heading">{title}</h2>
        <div className="divider-1"></div>
        <div className="more-reads-section">
          {cards.map((card, index) => {
            return (
              <a key={index} href={card.card_cta.url}>
                <div className="more-reads">
                  <div className="more-reads-image">
                    <img
                      data-src={card.image_link.url || card.image_source.url}
                      alt={card.heading}
                      className="lazyload"
                    />
                  </div>
                  <div className="more-reads-text">
                    <span className="more-reads-text-heading">
                      {card.heading}
                    </span>
                    <span className="more-reads-text-text">{card.subtext}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </StyledInternalContentCard>
    );
  }
}
