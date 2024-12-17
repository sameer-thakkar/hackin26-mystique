import ImageGallery from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery';
import { GalleryViewContainer } from 'components/Product/components/ExpandedGallery/styles';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  IMAGE_GALLERY_DIMENSIONS,
} from 'const/index';
import { strings } from 'const/strings';
import { TGalleryProps } from './types';

const Gallery = ({
  images,
  getAssociatedReview,
  controller,
  infiniteList,
  onClose,
}: TGalleryProps) => {
  return (
    <GalleryViewContainer>
      <ImageGallery
        imageUploads={images}
        onHide={(reviewInfo) => {
          if (reviewInfo) {
            trackEvent({
              eventName: ANALYTICS_EVENTS.STORY_MODE_CLOSED,
              [ANALYTICS_PROPERTIES.RATING]: reviewInfo?.rating,
            });
          }
          onClose?.();
        }}
        onShow={(reviewInfo) => {
          if (reviewInfo)
            trackEvent({
              eventName: ANALYTICS_EVENTS.STORY_MODE_OPENED,
              [ANALYTICS_PROPERTIES.RATING]: reviewInfo?.rating,
            });
        }}
        showMoreButton={false}
        hideFirstImageInOverlay={false}
        controlBodyOverflow={false}
        navigation="arrow"
        imageDimensions={{
          thumbnail: IMAGE_GALLERY_DIMENSIONS.DESKTOP.thumbnail,
        }}
        controller={controller}
        infiniteList={infiniteList}
        getAssociatedReview={getAssociatedReview}
        title={strings.SNAPSHOTS_SECTION_HEADER}
      />
    </GalleryViewContainer>
  );
};

export default Gallery;
