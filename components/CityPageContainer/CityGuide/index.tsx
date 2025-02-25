import { useEffect, useRef } from 'react';
import {
  CityGuideContainer,
  CityGuideItemsContainer,
} from 'components/CityPageContainer/CityGuide/styles';
import {
  CityGuideObject,
  ICityGuide,
  IGuideCardClick,
} from 'components/CityPageContainer/interface';
import {
  filterDuplicateCityGuides,
  trackCTA,
  trackPageSection,
} from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import useOnScreen from 'hooks/useOnScreen';
import { getHeadoutLanguagecode } from 'utils';
import { trackEvent } from 'utils/analytics';
import { convertUidToUrl } from 'utils/urlUtils';
import { GUIDE_MAP, SECTION_NAMES, TAGS } from 'const/cityPage';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';
import TravelGuideIcon from 'assets/travelGuideIcon';

const getTravelGuideDetails = (cityGuideData: Array<CityGuideObject>) => {
  const filteredData = cityGuideData.filter(
    (item) => item.primaryTag === TAGS.TRAVEL_GUIDE
  );
  const travelGuideItem = filteredData[0];
  return travelGuideItem;
};

const handleItemClick = ({ link, rank, name }: IGuideCardClick): void => {
  trackEvent({
    eventName: ANALYTICS_EVENTS.CONTENT_CARD_CLICKED,
    [ANALYTICS_PROPERTIES.CARD_NAME]: name,
    [ANALYTICS_PROPERTIES.RANKING]: rank,
    [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAMES.CITY_GUIDE,
  });
  window.open(link, '_blank');
};

const CityGuide = ({
  cityGuideData,
  lang,
  host,
  isDev,
  mbCityDisplayName,
  isMobile,
  shouldTrackView = true,
}: ICityGuide & { shouldTrackView?: boolean }) => {
  const containerRef = useRef(null);
  const isIntersecting = useOnScreen({ ref: containerRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting && shouldTrackView) {
      trackPageSection({ section: SECTION_NAMES.CITY_GUIDE });
    }
  }, [isIntersecting, shouldTrackView]);

  const filteredCityGuideData = filterDuplicateCityGuides(cityGuideData);
  const travelGuideData = getTravelGuideDetails(filteredCityGuideData) || {};
  const { uid: travelGuideUid } = travelGuideData;
  let travelGuideLink = '';
  if (travelGuideUid) {
    travelGuideLink = convertUidToUrl({
      uid: travelGuideUid,
      lang: getHeadoutLanguagecode(lang),
      hostname: host,
      isDev,
    });
  }

  if (filteredCityGuideData?.length < 2) return null;
  return (
    <CityGuideContainer ref={containerRef}>
      <div>
        <div className="heading-wrapper">
          <div className="travel-guide-heading">
            {strings.formatString(
              strings.CITY_PAGE.GO_TO_GUIDE,
              mbCityDisplayName
            )}
          </div>
          <Conditional if={!isMobile && travelGuideLink}>
            <a
              onClick={(e: any) =>
                trackCTA({
                  event: e,
                  url: travelGuideLink,
                  section: SECTION_NAMES.CITY_GUIDE,
                  ctaType: CTA_TYPE.VIEW_TRAVEL_GUIDE,
                })
              }
              href={travelGuideLink}
              target="_blank"
            >
              <div className="travel-guide-link">
                <TravelGuideIcon />
                <div className="travel-guide-text">
                  {strings.CITY_PAGE.VIEW_TRAVEL_GUIDE}
                </div>
              </div>
            </a>
          </Conditional>
        </div>
        <Conditional if={!isMobile}>
          <div className="travel-guide-description">
            {strings.formatString(
              strings.CITY_PAGE.GUIDE_SUBHEADING,
              mbCityDisplayName
            )}
          </div>
        </Conditional>
      </div>
      <CityGuideItemsContainer>
        {filteredCityGuideData.map((guideItem, index) => {
          const { uid, primaryTag } = guideItem;
          const { displayName, description, IconSvg } = GUIDE_MAP()[primaryTag];
          const guideLink = convertUidToUrl({
            uid,
            lang: getHeadoutLanguagecode(lang),
            hostname: host,
            isDev,
          });

          return (
            <div
              onClick={() =>
                handleItemClick({
                  link: guideLink,
                  rank: index + 1,
                  name: displayName,
                })
              }
              className="city-guide-item"
              key={uid}
              role="button"
              tabIndex={0}
            >
              <div className="item-svg">
                <IconSvg />
              </div>
              <a href={guideLink} target="_blank">
                <div className="item-name">{displayName}</div>
              </a>
              <div className="item-line" />
              <div className="item-description">
                {strings.formatString(description, mbCityDisplayName)}
              </div>
            </div>
          );
        })}
      </CityGuideItemsContainer>
    </CityGuideContainer>
  );
};

export default CityGuide;
