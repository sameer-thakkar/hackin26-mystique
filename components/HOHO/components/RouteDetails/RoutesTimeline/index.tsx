import Conditional from 'components/common/Conditional';
import { SECTION_NAMES } from 'components/HOHO/constants';
import { genUniqueId } from 'utils';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';
import Landmarks from 'assets/landmarks';
import Location from 'assets/location';
import { StopDetails, StopsList } from './styles';
import { extractStopsList } from './utils';

const RoutesTimeline = (props: any) => {
  const { routeSectionsData, routeName } = props;
  const stopsList = extractStopsList({ routeSectionsData });
  return (
    <StopsList>
      {stopsList?.map((attraction: Record<string, any>, index) => {
        const { stopName, stopLocation, attractionsCovered } = attraction || {};
        return (
          <StopDetails key={genUniqueId()}>
            <div className="stop-name">{stopName}</div>
            <a
              className="stop-location"
              href={stopLocation}
              target="_blank"
              rel="noopener"
              onClick={() => {
                trackEvent({
                  eventName: ANALYTICS_EVENTS.ITINERARY_CTA_CLICKED,
                  [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.MAP_LINK,
                  [ANALYTICS_PROPERTIES.LABEL]: 'View Location',
                  [ANALYTICS_PROPERTIES.SECTION]:
                    SECTION_NAMES.STOPS_AND_ATTRACTIONS,
                  [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
                  [ANALYTICS_PROPERTIES.STOP_NAME]: stopName,
                  [ANALYTICS_PROPERTIES.STOP_NUMBER]: index + 1,
                });
              }}
            >
              {Location}
              {strings.HOHO.VIEW_LOCATION}
            </a>
            <Conditional if={attractionsCovered?.length}>
              <div className="stop-attractions">
                <Landmarks />
                {attractionsCovered?.join(', ')}
              </div>
            </Conditional>
          </StopDetails>
        );
      })}
    </StopsList>
  );
};
export default RoutesTimeline;
