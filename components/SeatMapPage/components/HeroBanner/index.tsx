import { useEffect, useState } from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import Conditional from 'components/common/Conditional';
import {
  DEFAULT_SEATING_MAP_CONTENT,
  SEATING_MAP,
  SEATING_MAP_CONTENT_TYPE,
} from 'components/SeatMapPage/constants';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { THeroBannerParams } from './interface';
import {
  BannerDescription,
  BannerHeading,
  ContentBottomWrapper,
  ContentTopWrapper,
  HeroBannerContent,
  HeroBannerContentWrapper,
  HeroBannerWrapper,
  HR,
  IconContainer,
  IconLabel,
  IconParent,
  IconWrapper,
} from './styles';

const TRUNCATED_DESCRIPTION_LENGTH = 84;

const HeroBanner = ({
  theatreType,
  isMobile,
  breadcrumbs,
  addVenueSeatsPageSectionViewedDataEvents,
}: THeroBannerParams) => {
  let seatMapHeaderContent: SEATING_MAP_CONTENT_TYPE =
    DEFAULT_SEATING_MAP_CONTENT;

  const [showReadMore, setShowReadMore] = useState(isMobile);
  seatMapHeaderContent = SEATING_MAP.headerContent[theatreType] ?? {};

  let bannerDescriptionText = seatMapHeaderContent.BANNER_DESCRIPTION;
  const descriptionLength = bannerDescriptionText.length;

  bannerDescriptionText = bannerDescriptionText.slice(
    0,
    showReadMore ? TRUNCATED_DESCRIPTION_LENGTH : descriptionLength
  );
  bannerDescriptionText += showReadMore ? '...' : '';

  const toggleShowReadMore = () => {
    if (!showReadMore) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
        [ANALYTICS_PROPERTIES.CTA_TYPE]:
          ANALYTICS_EVENTS.SEATMAP_EXPERIMENT.READ_MORE,
        [ANALYTICS_PROPERTIES.SECTION]: ANALYTICS_PROPERTIES.HEADER,
      });
    }
    setShowReadMore((prev) => !prev);
  };

  useEffect(() => {
    addVenueSeatsPageSectionViewedDataEvents({
      sectionName: 'Banner',
      rank: 1,
    });
  }, []);

  return (
    <HeroBannerWrapper>
      <HeroBannerContentWrapper>
        <HeroBannerContent>
          <Conditional if={Object.keys(breadcrumbs).length}>
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              isMobile={isMobile}
              isCategoryPage
            />
          </Conditional>
          <ContentTopWrapper>
            <BannerHeading>{seatMapHeaderContent.BANNER_HEADING}</BannerHeading>
            <BannerDescription isMobile={isMobile} showReadMore={showReadMore}>
              {bannerDescriptionText}
              <button className="read-more" onClick={toggleShowReadMore}>
                <span>Read More</span>
              </button>

              <button className="show-less" onClick={toggleShowReadMore}>
                <span className="show-less">Show Less</span>
              </button>
            </BannerDescription>
          </ContentTopWrapper>
          <HR />
        </HeroBannerContent>
        <ContentBottomWrapper>
          {seatMapHeaderContent.BANNER_ICONS.map((item, index) => {
            return (
              <IconContainer key={index}>
                <IconWrapper>
                  <IconParent>
                    <item.icon />
                  </IconParent>
                </IconWrapper>
                <IconLabel>{item.name}</IconLabel>
              </IconContainer>
            );
          })}
        </ContentBottomWrapper>
      </HeroBannerContentWrapper>
    </HeroBannerWrapper>
  );
};

export default HeroBanner;
