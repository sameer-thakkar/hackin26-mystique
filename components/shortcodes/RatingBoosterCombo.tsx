import React, { useContext } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import Conditional from 'components/common/Conditional';
import { MBContext } from 'contexts/MBContext';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { getHostName } from 'utils/helper';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import Star from 'assets/star';

const BoosterContainer = styled.span`
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: left;
  align-items: center;
  font-weight: 400;
  grid-gap: 5px;
  font-size: 12px;
  font-family: ${HALYARD.FONT_STACK};
  line-height: 1;
  color: ${COLORS.GRAY.G2};
  .booster-rating {
    display: grid;
    grid-gap: 5px;
    grid-template-columns: auto auto;
    align-items: center;
    svg {
      height: 12px;
      width: 12px;
      margin-bottom: 1px;
    }
  }
  .booster-text {
    color: ${COLORS.GRAY.G2};
  }
`;

const RatingBoosterCombo = (props: any) => {
  const { tgid, text } = props;
  const { isDev, host, isStage, lang } = useContext(MBContext);
  const hostname = getHostName(isStage, isDev, host);
  const tourListEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    hostname,
    params: {
      ...(lang && {
        language: lang,
      }),
    },
    id: tgid,
  });
  const { data: tourGroupData } = useSWR(tourListEndpoint, {
    fetcher: swrFetcher,
  });
  const rating = tourGroupData?.averageRating ?? '';
  const boosterText = text || tourGroupData?.callToAction;
  return (
    <>
      <Conditional if={tourGroupData}>
        <BoosterContainer>
          <Conditional if={rating}>
            <span className="booster-rating">
              <Star color={'#FFBB58'} />
              {rating}
            </span>
          </Conditional>
          <Conditional if={!rating}>
            <span className="new">{strings.NEW}</span>
          </Conditional>
          <span className="booster-text">
            <Conditional if={boosterText}>{` | ${boosterText}`}</Conditional>
          </span>
        </BoosterContainer>
      </Conditional>
      <Conditional if={!tourGroupData}>{'\u00A0'}</Conditional>
    </>
  );
};

export default RatingBoosterCombo;
