import Image from 'UI/Image';
import {
  GuestsSVG,
  LuggageSVG,
} from 'assets/airportTransfers/privateAirportTransfers';
import {
  cardStyles,
  carListStyles,
  contentStyles,
  detailItemStyles,
  detailsStyles,
  imageStyles,
  separatorStyles,
  titleStyles,
} from './style';

export const CarCard = ({
  imageUrl,
  title,
  guests,
  luggage,
  carList,
  isMobile,
}: {
  imageUrl: string;
  title: string;
  guests: number;
  luggage: number;
  carList: string;
  isMobile: boolean;
}) => {
  return (
    <div className={cardStyles}>
      <Image
        url={imageUrl}
        alt={title}
        className={imageStyles}
        fitCrop={true}
        fill
        aspectRatio={isMobile ? '223:185' : '282:253'}
        width={isMobile ? undefined : 282}
        height={isMobile ? undefined : 253}
        autoCrop
        cropMode={'focalpoint'}
        focalPointParams={
          isMobile
            ? {
                x: 0.55,
                y: 0.5,
              }
            : {
                x: 0.5,
                y: 0.45,
              }
        }
      />

      <div className={contentStyles}>
        <h3 className={titleStyles}>{title}</h3>

        <div className={detailsStyles}>
          <span className={detailItemStyles}>
            <GuestsSVG />
            {guests} guests
          </span>

          <span className={separatorStyles} aria-hidden="true" />

          <span className={detailItemStyles}>
            <LuggageSVG />
            {luggage} luggage
          </span>
        </div>

        <p className={carListStyles}>{carList}</p>
      </div>
    </div>
  );
};
