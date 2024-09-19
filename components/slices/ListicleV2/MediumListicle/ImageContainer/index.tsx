import { IImageContainerProps } from 'components/slices/ListicleV2/MediumListicle/ImageContainer/interfaces';
import {
  ImageWrapper,
  IndexBox,
  IndexWrapper,
} from 'components/slices/ListicleV2/MediumListicle/ImageContainer/styles';
import Image from 'UI/Image';

const ImageContainer = ({ imageUrl, index, alt }: IImageContainerProps) => {
  return (
    <ImageWrapper>
      <Image
        url={imageUrl}
        alt={alt}
        fill={true}
        loadHigherQualityImage={true}
      />
      <IndexWrapper>
        <IndexBox>{index}</IndexBox>
      </IndexWrapper>
    </ImageWrapper>
  );
};
export default ImageContainer;
