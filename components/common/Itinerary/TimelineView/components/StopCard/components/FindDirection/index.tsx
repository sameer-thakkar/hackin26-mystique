import React from 'react';
import Link from 'next/link';
import { Location } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import { generateGoogleMapPlacesUrl } from 'utils/itinerary';
import { strings } from 'const/strings';
import { TailedArrowSVG } from 'assets/airportTransfers';
import { Container } from './styles';

type FindDirectionProps = {
  location: Location;
  show?: boolean | { icon?: boolean; text?: boolean };
  hoverAnimation?: boolean;
  variant?: TimelineViewComponentVariant;
};

const FindDirection = ({
  location,
  show = true,
  hoverAnimation = false,
  variant = TimelineViewComponentVariant.DEFAULT,
}: FindDirectionProps) => {
  const url = generateGoogleMapPlacesUrl(location);

  const showIcon = typeof show === 'boolean' ? show : show.icon;
  const showText = typeof show === 'boolean' ? show : show.text;

  return (
    <Link href={url} passHref legacyBehavior>
      <Container
        $iconOnly={!showText && showIcon}
        $hoverAnimation={hoverAnimation}
        $variant={variant}
        target="_blank"
        onClick={(e: any) => {
          e.stopPropagation();
        }}
      >
        <Conditional if={showText}>
          <span className="direction-text">
            {strings.ITINERARY.GET_DIRECTION} <TailedArrowSVG />
          </span>
        </Conditional>
      </Container>
    </Link>
  );
};

export default FindDirection;
