import { PrismicRichText } from '@prismicio/react';
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
import { shortCodeSerializer } from 'utils/shortCodes';
import Distance from 'assets/distance';
import Dot from 'assets/dot';
import Location from 'assets/location';
import PracticalInfoCalendar from 'assets/practicalInfoCalendar';
import Season from 'assets/season';
import Timing from 'assets/timing';

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
            {PracticalInfoCalendar()}
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
              <PracticalInfoDotIconWrapper>{Dot()}</PracticalInfoDotIconWrapper>
              <div>{duration}</div>
            </PracticalInfoTimeWrapper>
          </Conditional>

          <Conditional if={distance}>
            <PracticalInfoDistanceWrapper>
              <PracticalInfoDistanceIconWrapper>
                {Distance()}
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
            <PracticalInfoDotIconWrapper>{Dot()}</PracticalInfoDotIconWrapper>
            <div>{duration}</div>
          </PracticalInfoTimeWrapper>
        </Conditional>

        <Conditional if={distance}>
          <PracticalInfoDistanceWrapper className="practical-info">
            <PracticalInfoDistanceIconWrapper>
              {Distance()}
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
            {Season()}
          </PracticalInfoSeasonIconWrapper>
          <PracticalInfoSeasonContentWrapper>
            {season}
          </PracticalInfoSeasonContentWrapper>
        </PracticalInfoSeasonWrapper>
      </Conditional>

      <Conditional if={location && findItOnMap}>
        <PracticalInfoLocationWrapper className="practical-info">
          <PracticalInfoLocationIconWrapper>
            {Location}
          </PracticalInfoLocationIconWrapper>
          <PracticalInfoLocationContentWrapper>
            <div>
              <a
                href={findItOnMap}
                target={'_blank'}
                rel="noopener"
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
            {Timing()}
          </PracticalInfoTimingsIconWrapper>
          <PrismicRichText
            field={openingHours}
            components={shortCodeSerializer}
          />
        </PracticalInfoTimingsWrapper>
      </Conditional>
    </PracticalInfoWrapper>
  );
};
export default PracticalInfo;
