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
import { RECT, RIBBON } from 'assets/SvgIcons';

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
          <IndexRibbonWrapper>{RIBBON(index + 1)}</IndexRibbonWrapper>
          <SvgWrapper>{RECT()}</SvgWrapper>
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
