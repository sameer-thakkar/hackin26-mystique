import { useMemo } from 'react';
import Image from 'UI/Image';
import { getEntryPointPlaceHolder } from 'utils/itinerary';
import { strings } from 'const/strings';
import { TailedArrowSVG } from 'assets/airportTransfers';
import { EntryPointContainer } from './style';
import { EntryPointProps } from './type';

const EntryPoint = ({ onClick, image }: EntryPointProps) => {
  const defaultImage = useMemo(() => getEntryPointPlaceHolder(), []);

  return (
    <EntryPointContainer onClick={onClick}>
      <Image
        url={image ?? defaultImage}
        alt="banner-image"
        height={296}
        width={576}
        priority
        fetchPriority={'high'}
        fill
        aspectRatio="16:10"
        autoCrop={false}
      />
      <div className="entry-point-button">
        {strings.ITINERARY.VIEW_ITINERARY}
        <TailedArrowSVG />
      </div>
    </EntryPointContainer>
  );
};

export default EntryPoint;
