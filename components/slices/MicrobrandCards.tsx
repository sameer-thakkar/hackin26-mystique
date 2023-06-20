import React, { useContext } from 'react';
import styled from 'styled-components';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { MBContext } from 'contexts/MBContext';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { THEMES } from 'const/index';
import PriceBlock, { StyledPriceBlock } from 'UI/PriceBlock';
import { expandFontToken } from 'const/typography';
import COLORS from 'const/colors';
import { tourListApiParser } from 'utils/dataParsers';
import { shortCodeSerializer } from 'utils/shortCodes';
import { generateSidenavId, getHostName } from 'utils/helper';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';

const StyledMBCards = styled.div<{ gridAutoCol: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  ${({ gridAutoCol }) =>
    gridAutoCol
      ? `
    grid-template-columns: unset;
    grid-auto-flow: column;
  `
      : ''}
  grid-gap: 20px;

  a {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    .microbrands-list {
      margin: auto 25px;
    }
  }
`;

const MicrobrandCard = styled.div`
  display: grid;
  grid-template-rows: 170px auto;
  transition: all ease 0.2s;
  align-items: start;
  border-radius: 6px;

  ${StyledPriceBlock} {
    grid-column: 2 / 3;
    align-items: center;
    ${expandFontToken('Heading/XS')}
    justify-content: right;
    .tour-scratch-price {
      grid-column: 1 / 2;
    }
    .tour-price {
      grid-column: 2 / 3;
    }
  }

  .card-bottom {
    padding: 10px;
    align-items: start;
    display: grid;
    justify-content: space-between;
    grid-gap: 5px;
  }

  &:hover {
    transform: translate3d(0, -6px, 0);
    -webkit-perspective: 1000px;
    -webkit-transform: translate3d(0, -6px, 0);
  }
  .card-image {
    height: 100%;
  }
  .card-image img {
    object-fit: cover;
    height: 100%;
    width: 100%;
    border-radius: 6px;
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .card-bottom .card-title {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken('Heading/Product Card')}
    grid-row: 1;
    grid-column: 1 / 2;
  }

  .card-bottom .card-price {
    ${expandFontToken('Heading/XS')}
    justify-self: right;
    grid-row: 1;
    grid-column: 2 / 3;
    text-align: right;
  }

  ${({ theme }) =>
    theme.theme === THEMES.MIN_BLUE
      ? `
      .card-bottom {
        padding: 0
      }
      .card-image img {
        border-radius: 4px;
      }
      .card-bottom .card-price,
      .card-bottom .card-title,
      .card-bottom .tour-price {
        grid-column: 1 / 3;
        grid-row: unset;
        font-size: 16px;
        line-height: 22px;
      }
      .card-bottom .tour-scratch-price {
        font-size: 12px;
        line-height: 12px;
        color: ${COLORS.GRAY.G4};
      }
      .card-bottom .card-price,
      .card-bottom .tour-price {
        justify-self: left;
        color: ${COLORS.GRAY.G3};
        font-weight: 700;
      }
      .card-bottom .card-title {
        font-weight: 600;
      }
      `
      : `
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
    `}
`;

export const LinkCardWrapper = (props: any) => {
  if (props.as === React.Fragment) {
    return (
      <React.Fragment>
        <LinkCards {...props} />
      </React.Fragment>
    );
  }

  return (
    <StyledMBCards gridAutoCol={props.gridAutoCol}>
      <LinkCards {...props} />
    </StyledMBCards>
  );
};

export const LinkCard = (props: any) => {
  const {
    card,
    index,
    isFetched,
    cardPrices,
    currencySymbol,
    cardClassName,
  } = props;
  const { lang } = useContext(MBContext);

  const { image, title, tgid, link } = card ?? {};
  const { url: imageUrl, alt: altText } = image ?? {};
  const cardPrice = cardPrices?.[tgid] ?? {};
  const { listingPrice, price } = cardPrice ?? {};

  return (
    <div key={index} className={cardClassName || ''}>
      <a target="_blank" rel="noopener noreferrer" href={link}>
        <MicrobrandCard className="microbrand-card">
          <div className="card-image">
            <Image
              width={600}
              height={300}
              aspectRatio="16:10"
              url={imageUrl}
              alt={altText || title}
              priority={index < 8}
              fill
            />
          </div>
          <div className="card-bottom">
            <span className="card-title">{title}</span>
            <Conditional if={isFetched && tgid && cardPrice}>
              <>
                <Conditional if={listingPrice}>
                  <PriceBlock
                    lang={lang}
                    listingPrice={listingPrice}
                    showScratchPrice
                  />
                </Conditional>
                <Conditional if={!listingPrice && price}>
                  <span className="card-price">
                    {currencySymbol}
                    {price}
                  </span>
                </Conditional>
              </>
            </Conditional>
          </div>
        </MicrobrandCard>
      </a>
    </div>
  );
};

export const LinkCards = (props: any) => {
  const { cards, isFetched, cardPrices, currencySymbol, cardClassName } = props;

  return (
    <>
      {cards.map((card: any, index: number) => (
        <LinkCard
          card={card}
          key={index}
          index={index}
          isFetched={isFetched}
          cardPrices={cardPrices}
          currencySymbol={currencySymbol}
          cardClassName={cardClassName}
        />
      ))}
    </>
  );
};

const StyledMicrobandCards = styled.div`
  max-width: 1200px;
  margin: auto;
  .microbrand-cards-content {
    h2 {
      margin: 24px 0;
    }
  }
  @media (max-width: 768px) {
    margin: auto 25px;
  }
`;

/**
 * A card grid for microbrands
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - Content Above Cards
 *  - Rich Text field
 * - Content Below Cards
 *  - Rich Text field
 *
 * ### Repeatable zone
 * - Image Source
 *  - Add your image from prismic
 *  - Additionally add an 'alt' field
 * - Image URL
 *  - Add a link to the image directly
 *  - Will take precedence over 'Image Source'
 * - Image Alt
 *  - 'alt' field for Image URL
 *  - Will take precedence over 'Image Source' alt
 * - Microbrand Link
 * - TGID
 * - Card Title
 */

type MicrobrandCardsProps = {
  cards: any[];
  cardsContent?: any;
};

const MicrobrandCards: React.FC<MicrobrandCardsProps> = (props) => {
  const { cards, cardsContent } = props;
  const { isDev, host, isStage, lang } = useContext(MBContext);
  const hostname = getHostName(isStage, isDev, host);
  const tgids = cards
    ?.map((card) => card.tgid)
    ?.filter((tgid) => tgid)
    ?.join(',');
  const tourListEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    hostname,
    params: {
      'ids[]': tgids,
      ...(lang && {
        language: lang,
      }),
    },
    id: null,
  });
  const { data: tourListData } = useSWR(tourListEndpoint, {
    fetcher: swrFetcher,
  });

  const cardPrices = tourListData ? tourListApiParser(tourListData) : {};
  const currencySymbol = tourListData?.currencies?.[0]?.localSymbol ?? '';
  const isFetched = tourListData ? true : false;

  const finalCards = cards.map((card) => {
    return {
      image: {
        url: card.image_url.url || card.image_source.url,
        alt: card.image_alt || card.image_source.alt,
      },
      title: card.card_title,
      tgid: card.tgid,
      link: card.microbrand_link.url,
    };
  });

  const {
    content_above_cards: aboveContent,
    content_below_cards: belowContent,
  } = cardsContent || {};

  const idArray: Array<string> = [];
  aboveContent?.forEach((el: TRichTextArray) => {
    el.type === 'heading2' && idArray.push(generateSidenavId(el?.text));
  });
  belowContent?.forEach((el: TRichTextArray) => {
    el.type === 'heading2' && idArray.push(generateSidenavId(el?.text));
  });

  return (
    <StyledMicrobandCards>
      <div className="microbrand-cards-content" id={idArray?.[0]}>
        <RichText
          render={cardsContent.content_above_cards}
          htmlSerializer={shortCodeSerializer}
        />
      </div>
      <LinkCardWrapper
        isFetched={isFetched}
        cards={finalCards}
        cardPrices={cardPrices}
        currencySymbol={currencySymbol}
      />
      <div className="microbrand-cards-content" id={idArray?.[1]}>
        <RichText
          render={cardsContent.content_below_cards}
          htmlSerializer={shortCodeSerializer}
        />
      </div>
    </StyledMicrobandCards>
  );
};

export default MicrobrandCards;
