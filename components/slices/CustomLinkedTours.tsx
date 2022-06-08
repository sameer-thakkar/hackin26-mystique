import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { MBContext } from 'contexts/MBContext';
import Conditional from 'components/common/Conditional';
import Image from 'components/UI/Image';
import LocalisedPrice from 'components/UI/LPrice';
import { tourListApiParser } from 'utils/dataParsers';
import RichContent from 'components/UI/RichContent';
import { createBookingURL } from 'utils';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { getHostName } from 'utils/helper';
import { STAR_FULL } from 'assets/SvgIcons';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import { DESIGN } from 'const/index';
import TitleTextCombo from 'UI/TitleTextCombo';

const Tour = styled.a`
  display: grid;
  grid-row-gap: 8px;
  text-decoration: none;
  img {
    width: 100%;
    border-radius: 4px;
    object-fit: cover;
    height: auto;
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
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 600;
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
  font-family: ${HALYARD.FONT_STACK};
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
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
    font-weight: 400;
    font-size: 12px;
    font-family: ${HALYARD.FONT_STACK};
    line-height: 1;
  }
  svg {
    height: 12px;
    width: 12px;
  }
`;

const StyledCustomLinkedTours = styled.div`
  color: ${({ design }) =>
    design === DESIGN.V1 ? COLORS.GRAY.G2 : COLORS.GRAY.G1};
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
  const {
    isDev,
    host,
    isStage,
    lang,
    design,
    nakedDomain,
    currencySymbolMap,
    biLink,
  } = useContext(MBContext);
  const [currency, setCurrency] = useState(null);

  const hostname = getHostName(isStage, isDev, host);
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

  useEffect(() => {
    if (tourListData) {
      const tours = tourListApiParser(tourListData, lang);
      const { currencies } = tourListData || {};
      const [currency] = currencies || [];
      setTours(tours);
      setCurrency(currency);
    }
  }, [tourListData]);

  const defaultURL = (tgid) =>
    createBookingURL({ nakedDomain, lang, tgid, biLink });
  return (
    <StyledCustomLinkedTours design={design}>
      <TitleTextCombo>
        <RichContent render={content} />
      </TitleTextCombo>
      <TourGrid>
        {apiTours &&
          tgids.map((tgid: any, index) => {
            const {
              title,
              image,
              currency: tourCurrency,
              price,
              averageRating,
              reviewCount,
            } = apiTours[tgid] || {};
            return (
              <Tour
                key={index}
                href={
                  basicTours[tgid].url || commonLink.url || defaultURL(tgid)
                }
                target={(basicTours[tgid] || commonLink).target}
              >
                <Image url={image} aspectRatio={'16:10'} alt={title} />
                <TitlePriceCombo>
                  <Title>{title}</Title>
                  <LocalisedPrice
                    currencySymbol={
                      currency?.localSymbol ??
                      currencySymbolMap[tourCurrency]?.localSymbol
                    }
                    price={price}
                    lang={lang}
                  />
                </TitlePriceCombo>
                <Conditional if={averageRating}>
                  <Booster>
                    <STAR_FULL />{' '}
                    <span>
                      {averageRating}{' '}
                      {reviewCount ? `| ${reviewCount} reviews` : ''}
                    </span>
                  </Booster>
                </Conditional>
              </Tour>
            );
          })}
      </TourGrid>
    </StyledCustomLinkedTours>
  );
};
export default CustomLinkedTours;
