import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { ChildSection } from 'types/itinerary.type';
import { getIntlUnit } from '@headout/espeon/utils';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { appAtom } from 'store/atoms/app';
import { nearbyThingsIcon } from 'const/itinerary';
import { strings } from 'const/strings';
import { TailedArrowSVG } from 'assets/airportTransfers';
import { IconContainer, SubStopContainer, SubStopContent } from './styles';
import { TSubStopCardProps } from './types';

const SubStopCard = ({
  details,
  id,
  link,
  itineraryId,
  onClick,
}: TSubStopCardProps) => {
  const {
    mediaUrls = [],
    name = '',
    timeFromParent = 0,
    subType = null,
  } = details;
  const [TypeIcon, setTypeIcon] = useState<React.ComponentType<{}> | null>(
    null
  );

  const { language } = useRecoilValue(appAtom);

  const iconAvailable =
    subType && Object.keys(nearbyThingsIcon).includes(subType.label);

  useEffect(() => {
    if (!subType) return;

    const icon = dynamic(nearbyThingsIcon[subType.label]);

    setTypeIcon(icon);
  }, []);

  const walkDuration = timeFromParent
    ? getIntlUnit({
        // @ts-expect-error
        lang: language,
        number: timeFromParent,
        options: {
          unit: 'minute',
        },
      })
    : '';

  const hasImage = !!mediaUrls?.length;

  return (
    <SubStopContainer
      key={`nearby-things-${id}`}
      {...(link && { href: link, as: 'a', target: '_blank' })}
      id={`itinerary-card-${itineraryId}-${id}`}
      onClick={(e: any) => {
        e.stopPropagation();
        onClick?.({ id } as ChildSection);
      }}
    >
      {hasImage && (
        <Image
          url={mediaUrls[0]}
          alt="passby-image"
          height={36}
          width={56}
          priority
          fetchPriority={'high'}
          fill
          aspectRatio="16:10"
          autoCrop={false}
          loadHigherQualityImage={true}
        />
      )}
      <Conditional if={!hasImage && iconAvailable}>
        <IconContainer>{TypeIcon && <TypeIcon />}</IconContainer>
      </Conditional>

      <SubStopContent $isClickable={!!link}>
        <div className="passby-name">{name}</div>
        <Conditional if={walkDuration}>
          <div className="passby-duration">
            {strings.formatString(
              strings.ITINERARY.WALK_DURATION,
              walkDuration
            )}
          </div>
        </Conditional>
        <Conditional if={!!link}>
          <TailedArrowSVG className="passby-arrow" />
        </Conditional>
      </SubStopContent>
    </SubStopContainer>
  );
};

export default SubStopCard;
