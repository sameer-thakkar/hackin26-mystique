import { IImageContainerProps } from 'components/slices/ListicleV2/SmallListicle/SmallListicleGrid/ImageContainer/interfaces';
import {
  ImageWrapper,
  IndexBox,
  IndexWrapper,
} from 'components/slices/ListicleV2/SmallListicle/SmallListicleGrid/ImageContainer/styles';
import Image from 'UI/Image';

const ImageContainer = ({ imageUrl, index, alt }: IImageContainerProps) => {
  return (
    <ImageWrapper>
      <Image url={imageUrl} alt={alt} height={210} width={145} fill={false} />
      <IndexWrapper>
        <IndexBox>{index}</IndexBox>
      </IndexWrapper>
    </ImageWrapper>
  );
};
export default ImageContainer;
