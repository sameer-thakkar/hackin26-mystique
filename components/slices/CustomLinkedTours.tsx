import styled from 'styled-components';
import Image from '../UI/Image';
import LocalisedPrice from '../UI/LPrice';
import { STAR_FULL } from '../../public/static/svg-icons';
import { useEffect, useState, useContext } from 'react';
import { tourListApiParser } from '../../utils/dataParsers';
import RichContent from '../UI/RichContent';
import { MBContext } from '../../contexts/MBContext';
import { AVENIR, COLORS, GRAPHIK } from '../../constants/ui-constants';
import { DESIGN, CURRENCY_SYMBOL_MAP } from '../../constants';

const Tour = styled.a`
  display: grid;
  grid-row-gap: 8px;
  text-decoration: none;
  img {
    width: 100%;
    border-radius: 4px;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    border-radius: 2px;
  }
`;
const TitlePriceCombo = styled.div`
  display: grid;
  align-items: baseline;
  justify-content: space-between;
  grid-column-gap: 8px;
  grid-template-columns: 1fr auto;
  span {
    font-family: ${AVENIR.FONT_STACK};
    font-weight: ${AVENIR.BLACK};
    font-size: 16px;
    line-height: 20px;
    text-align: right;
  }
  @media (max-width: 768px) {
    grid-template-columns: auto;
    span {
      text-align: left;
      font-size: 14px;
      line-height: 1;
    }
  }
`;

const Title = styled.div`
  font-family: ${AVENIR.FONT_STACK};
  font-size: 16px;
  line-height: 24px;
  font-weight: ${AVENIR.BLACK};
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.3;
  }
`;

const Booster = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: left;
  grid-column-gap: 5px;
  span {
    align-items: center;
    font-weight: ${GRAPHIK.REGULAR};
    font-size: 12px;
    font-family: ${GRAPHIK.FONT_STACK};
    line-height: 1;
  }
  svg {
    height: 12px;
    width: 12px;
  }
`;

const StyledCustomLinkedTours = styled.div`
  color: ${({ design }) =>
    design === DESIGN.V1 ? COLORS.FOUR_BLACK : COLORS.TWO_BLACK};
`;

const TourGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

/**
 * Custom Linked Tours lets you add Tour Cards which automatically pull Image, Tour Name, Ratings & Price based on the tgid provided, the card itself links to any URL added while creating the card.<br>
 * PS: By default the URL is the booking URL (if both Common Link and Override link is left blank)
 *
 *
 *
 * ### Non-repeatable zone
 * - Content
 *  - Rich Text field
 * - Common Link
 *  This link will be set to all tour cards, however if you set a different URL at tour level (in repeatable zone) that will be used instead.
 *
 * ### Repeatable zone
 * - TGID
 *  - Add the tours TGID
 * - Link Override: If you want this specific tour to go to different page than the one provided as Common Link.
 *
 */

const CustomLinkedTours = ({
  tours: basicTours,
  tgids,
  content,
  commonLink,
}) => {
  const [apiTours, setTours] = useState(null);
  useEffect(() => {
    fetch(`https://api.headout.com/api/v5/tour-group/list?ids[]=${tgids}`)
      .then((r) => r.json())
      .then((res) => {
        const apiTours = tourListApiParser(res);
        setTours(apiTours);
      });
  }, []);
  const { lang, design, nakedDomain } = useContext(MBContext);
  const defaultURL = (tgid) =>
    `https://book.${nakedDomain}/${lang !== 'en/' ? lang : ''}book/${tgid}`;
  return (
    <StyledCustomLinkedTours design={design}>
      <RichContent render={content} />
      <TourGrid>
        {apiTours &&
          tgids.map((tgid: any, index) => {
            const tour = apiTours[tgid];
            return (
              <Tour
                key={index}
                href={
                  basicTours[tgid].url || commonLink.url || defaultURL(tgid)
                }
                target={(basicTours[tgid] || commonLink).target}
              >
                <Image
                  url={tour.image}
                  aspectRatio={'16:10'}
                  alt={tour.title}
                />
                <TitlePriceCombo>
                  <Title>{tour.title}</Title>
                  <LocalisedPrice
                    currencySymbol={CURRENCY_SYMBOL_MAP[tour.currency]}
                    price={tour.price}
                    lang={lang}
                  />
                </TitlePriceCombo>
                {tour.averageRating ? (
                  <Booster>
                    {STAR_FULL}{' '}
                    <span>
                      {tour.averageRating}{' '}
                      {tour.reviewCount ? `| ${tour.reviewCount} reviews` : ''}
                    </span>
                  </Booster>
                ) : null}
              </Tour>
            );
          })}
      </TourGrid>
    </StyledCustomLinkedTours>
  );
};
export default CustomLinkedTours;
