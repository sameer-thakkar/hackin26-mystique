import Image from 'UI/Image';
import { TCarouselItemProps } from './interface';
import { StyledImage } from './styles';

const CarouselItem = ({
  isLoaded,
  onClick,
  onLoad,
  fileName,
  height,
  width,
  url,
  location,
}: TCarouselItemProps) => {
  return (
    <StyledImage
      onClick={onClick}
      $width={width}
      $height={height}
      className={`snapshot-item-${location.globalIndex}`}
      $showShimmer={!isLoaded}
      tabIndex={0}
      data-review-id={location.reviewId}
      data-local-index={location?.localIndex}
    >
      <Image
        url={url}
        width={width}
        height={height}
        alt={fileName}
        onLoadingComplete={onLoad}
      />
    </StyledImage>
  );
};

export default CarouselItem;
