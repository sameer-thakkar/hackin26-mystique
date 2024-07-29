import { useMemo } from 'react';
import { ChildSection } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import Descriptors from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors';
import FindDirection from 'components/common/Itinerary/TimelineView/components/StopCard/components/FindDirection';
import type { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import MediaCarousel from 'UI/MediaCarousel';
import COLORS from 'const/colors';
import { MEDIA_CAROUSEL_IMAGE_LIMIT } from 'const/index';
import en from 'const/localization/en';
import SubStops from '../SubStops';
import { SubStopCardProps } from '../SubStops/types';
import {
  MediaContainer,
  SinglePointStopCardContainer,
  StopDescription,
  StopHeadContainer,
  StopInfoContainer,
  StopTitle,
} from './styles';

const SinglePointStopCard = ({
  stop,
  showTitle = true,
  isCurrentStop = false,
}: {
  stop: StopCardProps;
  showTitle?: boolean;
  isCurrentStop?: boolean;
}) => {
  const { sectionDetails, descriptors, subCards = [] } = stop;
  const {
    details: { name, description, mediaUrls = [] },
    location,
  } = sectionDetails!;

  const { highlights, nearBys } = useMemo(() => {
    return subCards.reduce(
      (acc, stop) => {
        const { subSectionDetails, descriptors } = stop;
        const { id, details, location, type } =
          subSectionDetails! as ChildSection;
        const {
          name,
          mediaUrls = [],
          passBy,
          description,
          subType: { label: subTypeLabel } = {},
        } = details;

        const item = {
          id,
          title: name,
          imageURL: mediaUrls[0],
          descriptors,
          description,
          iconType: subTypeLabel || type,
          location,
        } as SubStopCardProps;

        if (passBy) {
          acc.nearBys.push(item);
        } else {
          acc.highlights.push(item);
        }

        return acc;
      },
      {
        highlights: [] as SubStopCardProps[],
        nearBys: [] as SubStopCardProps[],
      }
    );
  }, [subCards]);

  return (
    <SinglePointStopCardContainer
      $isCurrentStop={isCurrentStop}
      className="stop-card-container"
    >
      <StopInfoContainer className="stop-info-container">
        <StopHeadContainer>
          <Conditional if={showTitle && name}>
            <StopTitle>{name}</StopTitle>
          </Conditional>
          <Conditional if={location}>
            <FindDirection location={location!} />
          </Conditional>
        </StopHeadContainer>
        <Conditional if={descriptors}>
          <Descriptors
            {...descriptors}
            variant={TimelineViewComponentVariant.REDUCED_WIDTH}
          />
        </Conditional>
        <Conditional if={mediaUrls.length >= 1}>
          <MediaContainer className="card-img">
            <MediaCarousel
              imageList={mediaUrls
                .map((url: string) => ({ url, altText: name! }))
                .slice(0, MEDIA_CAROUSEL_IMAGE_LIMIT)}
              imageId="card-img"
              backgroundColor={COLORS.GRAY.G7}
              differentBorderRadiusForMobile={false}
              imageAspectRatio="16:10"
              imageWidth={400}
              showPagination={false}
              isFirstProduct={true}
              isMobile={true}
              bottomPosition={'4px'}
              enableAutoplay={false}
              isTimed={false}
              trackImage={false}
              shouldCrop
              showTimedPaginator
            />
          </MediaContainer>
        </Conditional>
        <Conditional if={description}>
          <StopDescription
            className="description-text"
            dangerouslySetInnerHTML={{ __html: description! }}
          />
        </Conditional>
      </StopInfoContainer>

      <Conditional if={highlights.length}>
        <SubStops
          title={en.ITINERARY.SUB_SECTION_HEADING.HIGHLIGHTS}
          subStops={highlights}
        />
      </Conditional>

      <Conditional if={nearBys.length}>
        <SubStops
          title={en.ITINERARY.SUB_SECTION_HEADING.NEARBY_THINGS_TO_DO}
          subStops={nearBys!}
        />
      </Conditional>
    </SinglePointStopCardContainer>
  );
};

export default SinglePointStopCard;
