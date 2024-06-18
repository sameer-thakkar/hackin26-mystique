import React from 'react';
import Link from 'next/link';
import { Location } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { generateGoogleMapUrl } from 'utils/itinerary';
import { strings } from 'const/strings';
import { TailedArrowSVG } from 'assets/airportTransfers';
import { Container } from './styles';

type FindDirectionProps = {
  location: Location;
  show?: boolean | { icon?: boolean; text?: boolean };
  hoverAnimation?: boolean;
};

const FindDirection = ({
  location,
  show = true,
  hoverAnimation = false,
}: FindDirectionProps) => {
  const url = generateGoogleMapUrl(location);

  const showIcon = typeof show === 'boolean' ? show : show.icon;
  const showText = typeof show === 'boolean' ? show : show.text;

  return (
    <Link href={url} passHref>
      <Container
        $iconOnly={!showText && showIcon}
        $hoverAnimation={hoverAnimation}
        target="_blank"
        onClick={(e) => {
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
