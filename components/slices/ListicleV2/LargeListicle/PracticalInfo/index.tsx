// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import Conditional from 'components/common/Conditional';
import { IPracticalInfoProps } from 'components/slices/ListicleV2/LargeListicle/PracticalInfo/intefaces';
import {
  PracticalInfoCalendarContentWrapper,
  PracticalInfoCalendarIconWrapper,
  PracticalInfoCalendarWrapper,
  PracticalInfoDistanceContentWrapper,
  PracticalInfoDistanceIconWrapper,
  PracticalInfoDistanceWrapper,
  PracticalInfoDotIconWrapper,
  PracticalInfoLocationContentWrapper,
  PracticalInfoLocationIconWrapper,
  PracticalInfoLocationWrapper,
  PracticalInfoSeasonContentWrapper,
  PracticalInfoSeasonIconWrapper,
  PracticalInfoSeasonWrapper,
  PracticalInfoTimeAndDurationWrapper,
  PracticalInfoTimeWrapper,
  PracticalInfoTimingsIconWrapper,
  PracticalInfoTimingsWrapper,
  PracticalInfoWrapper,
} from 'components/slices/ListicleV2/LargeListicle/PracticalInfo/styles';
import {
  DISTANCE,
  DOT,
  LOCATION,
  PRACTICAL_INFO_CALENDAR,
  SEASON,
  TIMING,
} from 'assets/SvgIcons';

const PracticalInfo = ({
  practicalInfo,
  isMobile,
  onClickMapLink,
}: IPracticalInfoProps) => {
  const {
    calendar,
    duration,
    distance,
    season,
    location,
    openingHours,
    findItOnMap,
  } = practicalInfo;
  return (
    <PracticalInfoWrapper>
      <Conditional if={calendar}>
        <PracticalInfoCalendarWrapper className="practical-info">
          <PracticalInfoCalendarIconWrapper>
            {PRACTICAL_INFO_CALENDAR()}
          </PracticalInfoCalendarIconWrapper>
          <PracticalInfoCalendarContentWrapper>
            {calendar}
          </PracticalInfoCalendarContentWrapper>
        </PracticalInfoCalendarWrapper>
      </Conditional>

      <Conditional if={isMobile}>
        <PracticalInfoTimeAndDurationWrapper>
          <Conditional if={duration}>
            <PracticalInfoTimeWrapper>
              <PracticalInfoDotIconWrapper>{DOT()}</PracticalInfoDotIconWrapper>
              <div>{duration}</div>
            </PracticalInfoTimeWrapper>
          </Conditional>

          <Conditional if={distance}>
            <PracticalInfoDistanceWrapper>
              <PracticalInfoDistanceIconWrapper>
                {DISTANCE()}
              </PracticalInfoDistanceIconWrapper>
              <PracticalInfoDistanceContentWrapper>
                {distance}
              </PracticalInfoDistanceContentWrapper>
            </PracticalInfoDistanceWrapper>
          </Conditional>
        </PracticalInfoTimeAndDurationWrapper>
      </Conditional>

      <Conditional if={!isMobile}>
        <Conditional if={duration}>
          <PracticalInfoTimeWrapper className="practical-info">
            <PracticalInfoDotIconWrapper>{DOT()}</PracticalInfoDotIconWrapper>
            <div>{duration}</div>
          </PracticalInfoTimeWrapper>
        </Conditional>

        <Conditional if={distance}>
          <PracticalInfoDistanceWrapper className="practical-info">
            <PracticalInfoDistanceIconWrapper>
              {DISTANCE()}
            </PracticalInfoDistanceIconWrapper>
            <PracticalInfoDistanceContentWrapper>
              {distance}
            </PracticalInfoDistanceContentWrapper>
          </PracticalInfoDistanceWrapper>
        </Conditional>
      </Conditional>

      <Conditional if={season}>
        <PracticalInfoSeasonWrapper className="practical-info">
          <PracticalInfoSeasonIconWrapper>
            {SEASON()}
          </PracticalInfoSeasonIconWrapper>
          <PracticalInfoSeasonContentWrapper>
            {season}
          </PracticalInfoSeasonContentWrapper>
        </PracticalInfoSeasonWrapper>
      </Conditional>

      <Conditional if={location && findItOnMap}>
        <PracticalInfoLocationWrapper className="practical-info">
          <PracticalInfoLocationIconWrapper>
            {LOCATION}
          </PracticalInfoLocationIconWrapper>
          <PracticalInfoLocationContentWrapper>
            <div>
              <a
                href={findItOnMap}
                target={'_blank'}
                rel="noreferrer noopener"
                onClick={onClickMapLink}
              >
                {location}
              </a>
            </div>
          </PracticalInfoLocationContentWrapper>
        </PracticalInfoLocationWrapper>
      </Conditional>

      <Conditional if={openingHours.length > 0}>
        <PracticalInfoTimingsWrapper className="practical-info">
          <PracticalInfoTimingsIconWrapper>
            {TIMING()}
          </PracticalInfoTimingsIconWrapper>
          <RichText render={openingHours} />
        </PracticalInfoTimingsWrapper>
      </Conditional>
    </PracticalInfoWrapper>
  );
};
export default PracticalInfo;
