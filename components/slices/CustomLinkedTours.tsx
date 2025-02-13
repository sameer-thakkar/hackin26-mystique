import { useContext } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import PriceBlock from 'UI/PriceBlock';
import RichContent from 'UI/RichContent';
import TitleTextCombo from 'UI/TitleTextCombo';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { tourListApiParser } from 'utils/dataParsers';
import { generateSidenavId, getHostName } from 'utils/helper';
import { appAtom } from 'store/atoms/app';
import { hsidAtom } from 'store/atoms/hsid';
import COLORS from 'const/colors';
import { DESIGN, SLICE_TYPES } from 'const/index';
import { HALYARD } from 'const/ui-constants';
import StarFull from 'assets/starFull';

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
  color: ${({
    // @ts-expect-error TS(2339): Property 'design' does not exist on type 'Pick<Det... Remove this comment to see the full error message
    design,
  }) => (design === DESIGN.V1 ? COLORS.GRAY.G2 : COLORS.GRAY.G1)};
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
}: any) => {
  const {
    isDev,
    host,
    lang,
    design,
    nakedDomain,
    biLink,
    redirectToHeadoutBookingFlow,
  } = useContext(MBContext);
  const { isMobile } = useRecoilValue(appAtom);
  const hsid = useRecoilValue(hsidAtom);

  const hostname = getHostName(isDev, host);
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
  const apiTours = tourListData ? tourListApiParser(tourListData, lang) : {};

  //filtering out tgids if no data returned from api
  tgids = tgids.filter((tgid: any) =>
    Object.keys(apiTours).includes(String(tgid))
  );
  const defaultURL = (tgid: any, flowType: string) =>
    createBookingURL({
      nakedDomain,
      lang,
      tgid,
      biLink,
      redirectToHeadoutBookingFlow,
      flowType,
      hsid,
    });
  const headingId = content?.map((el: TRichTextArray) => {
    if (el.type === 'heading2') return generateSidenavId(el.text);
  });
  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <StyledCustomLinkedTours design={design}>
      <TitleTextCombo id={headingId?.[0]}>
        <RichContent
          render={content}
          parentProps={{
            sectionName: headingId?.[0],
            sliceType: SLICE_TYPES.CUSTOM_LINKED_TOURS,
          }}
        />
      </TitleTextCombo>
      <TourGrid>
        {Object.keys(apiTours).length &&
          tgids.map((tgid: any, index: number) => {
            const {
              title,
              image,
              averageRating,
              reviewCount,
              listingPrice,
              flowType,
            } = apiTours[tgid] || {};
            return (
              <Tour
                key={index}
                href={
                  basicTours[tgid].url ||
                  commonLink.url ||
                  defaultURL(tgid, flowType)
                }
                target={(basicTours[tgid] || commonLink).target}
              >
                <Image
                  url={image}
                  aspectRatio={'16:10'}
                  alt={title}
                  width={isMobile ? 150 : 300}
                  loadHigherQualityImage={true}
                />
                <TitlePriceCombo>
                  <Title>{title}</Title>
                  <PriceBlock lang={lang} listingPrice={listingPrice} />
                </TitlePriceCombo>
                <Conditional if={averageRating}>
                  <Booster>
                    <StarFull fillColor={COLORS.TEXT.CANDY_1} />{' '}
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
