import { useContext, useState } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import Conditional from 'components/common/Conditional';
import ContentContainer from 'components/slices/ListicleV2/LargeListicle/ContentContainer';
import ImageContainer from 'components/slices/ListicleV2/LargeListicle/ImageContainer/index';
import { ILargeListicleGridProps } from 'components/slices/ListicleV2/LargeListicle/LargeListicleGrid/interfaces';
import {
  ButtonBackgroundWrapper,
  LargeListicleBox,
  LargeListicleGridWrapper,
  ModalCardContainer,
} from 'components/slices/ListicleV2/LargeListicle/LargeListicleGrid/styles';
import Button from 'UI/Button';
import { MBContext } from 'contexts/MBContext';
import { trackCTAClickEvent, trackMapClickEvent } from 'utils/listicle';
import { LISTICLE_TYPE, SIDEBAR_TYPES } from 'const/index';
import { strings } from 'const/strings';

const LargeListicleGrid = ({
  imageUrl,
  index,
  heading,
  categoryTags,
  richTextData,
  practicalInfo,
  ctaText,
  ctaUrl,
  experienceId,
  experienceType,
  experienceName,
  listicleSectionTitle,
  tabData,
  alt,
}: ILargeListicleGridProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    sidebarModal: { addToAside },
  } = useContext(MBContext);
  const [width] = useWindowSize();
  const isMobile = width <= 768;

  const handleCloseComboPopup = () => {
    document.body.style.overflow = 'auto';
    setIsModalOpen(false);
  };

  const onClickMoreDetails = (e: any) => {
    e?.stopPropagation();
    document.body.style.overflow = 'hidden';
    // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
    addToAside({
      width: '100vw',
      children: (
        <ModalCardContainer>{getProductCardElements(true)}</ModalCardContainer>
      ),
      onCloseCallback: () => handleCloseComboPopup(),
      history: {
        enable: true,
        params: {},
      },
      type: SIDEBAR_TYPES.LISTICLE_CARD,
    });
    setIsModalOpen(true);
  };

  const onClickCTAButton = () => {
    trackCTAClickEvent({
      cardSize: LISTICLE_TYPE.LARGE,
      experienceType,
      experienceId: experienceId as string,
      listicleSectionTitle,
      heading,
      experienceName: experienceName as string,
      index,
    });
  };

  const onClickMapLink = () => {
    trackMapClickEvent({
      cardSize: LISTICLE_TYPE.LARGE,
      experienceType,
      experienceId: experienceId as string,
      listicleSectionTitle,
      heading,
      experienceName: experienceName as string,
      index,
    });
    window.open(practicalInfo?.findItOnMap, '_blank', 'noopener');
  };

  const getProductCardElements = (isOpen: boolean) => {
    return (
      <LargeListicleBox isModalOpen={isOpen}>
        <ImageContainer
          isMobile={isMobile}
          imageUrl={imageUrl}
          alt={alt}
          index={index}
          isModalOpen={isOpen}
        />
        <ContentContainer
          heading={heading}
          categoryTags={categoryTags}
          practicalInfo={practicalInfo}
          tabData={tabData}
          richTextData={richTextData}
          isMobile={isMobile}
          ctaText={ctaText}
          isModalOpen={isOpen}
          onClickCTAButton={onClickCTAButton}
          onClickMapLink={onClickMapLink}
          ctaUrl={ctaUrl}
        />
        <Conditional if={!isOpen && isMobile}>
          <Conditional if={ctaUrl}>
            <Button className="cta-button" onClick={onClickCTAButton}>
              <a
                href={ctaUrl}
                target={'_blank'}
                onClick={onClickCTAButton}
                rel="noopener"
              >
                {ctaText}
              </a>
            </Button>
          </Conditional>
          <Button className="more-details-button" onClick={onClickMoreDetails}>
            {strings.MORE_DETAILS}
          </Button>
        </Conditional>
        <Conditional if={isOpen && isMobile && ctaUrl}>
          <ButtonBackgroundWrapper>
            <Button className="cta-button">
              <a
                href={ctaUrl}
                target={'_blank'}
                onClick={onClickCTAButton}
                rel="noopener"
              >
                {ctaText}
              </a>
            </Button>
          </ButtonBackgroundWrapper>
        </Conditional>
      </LargeListicleBox>
    );
  };

  return (
    <LargeListicleGridWrapper className="large-listicle-grid">
      {getProductCardElements(isModalOpen)}
    </LargeListicleGridWrapper>
  );
};
export default LargeListicleGrid;
