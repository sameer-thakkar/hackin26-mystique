import Conditional from 'components/common/Conditional';
import { IImageContainerProps } from 'components/slices/ListicleV2/LargeListicle/ImageContainer/interfaces';
import {
  ImageWrapper,
  IndexBox,
  IndexRibbonWrapper,
  IndexWrapper,
  SvgWrapper,
} from 'components/slices/ListicleV2/LargeListicle/ImageContainer/styles';
import Image from 'UI/Image';
import Rect from 'assets/rect';
import Ribbon from 'assets/ribbon';

const ImageContainer = ({
  imageUrl,
  index,
  alt,
  isModalOpen,
  isMobile,
}: IImageContainerProps) => {
  return (
    <ImageWrapper isModalOpen={isModalOpen}>
      <Conditional if={imageUrl}>
        <Image
          url={imageUrl}
          alt={alt}
          fill={true}
          className="listicle-card-image"
        />
        <Conditional if={!isMobile}>
          <IndexRibbonWrapper>{Ribbon(index + 1)}</IndexRibbonWrapper>
          <SvgWrapper>{Rect()}</SvgWrapper>
        </Conditional>
        <Conditional if={isMobile}>
          <IndexWrapper>
            <IndexBox>{index + 1}</IndexBox>
          </IndexWrapper>
        </Conditional>
      </Conditional>
    </ImageWrapper>
  );
};
export default ImageContainer;
