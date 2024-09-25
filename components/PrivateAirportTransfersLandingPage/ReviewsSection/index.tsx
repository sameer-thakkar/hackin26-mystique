import Reviews from 'components/slices/Reviews';
import { useTrackElementView } from 'hooks/useTrackElementView';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { PRIVATE_AT_REVIEWS } from '../constants';
import { StyledReviewSectionWrapper } from './styles';

export const ReviewsSection = ({ isMobile }: { isMobile: boolean }) => {
  const ref = useTrackElementView({
    eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
    properties: {
      [ANALYTICS_PROPERTIES.SECTION]: 'Reviews',
      [ANALYTICS_PROPERTIES.RANKING]: 3,
    },
  });

  const handleScroll = () => {
    trackEvent({
      eventName: 'Carousel Scrolled',
      [ANALYTICS_PROPERTIES.SECTION]: 'Reviews',
    });
  };

  return (
    <StyledReviewSectionWrapper ref={ref}>
      <Reviews
        title="Loved by millions"
        reviews={PRIVATE_AT_REVIEWS}
        isMobile={isMobile}
        showNewDesign={true}
        swiperConfigOverride={{
          autoplay: false,
          centeredSlides: false,
        }}
        shouldTrackPageSectionView={false}
        onSlideChange={handleScroll}
        truncateLength={182}
      />
    </StyledReviewSectionWrapper>
  );
};
