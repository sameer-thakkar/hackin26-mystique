import { useState } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import Conditional from 'components/common/Conditional';
import ContentContainer from 'components/slices/ListicleV2/MediumListicle/ContentContainer/index';
import ImageContainer from 'components/slices/ListicleV2/MediumListicle/ImageContainer/index';
import { IMediumListicleGridProps } from 'components/slices/ListicleV2/MediumListicle/MediumListicleGrid/interfaces';
import {
  CTAButtonWrapper,
  MediumListicleBox,
} from 'components/slices/ListicleV2/MediumListicle/MediumListicleGrid/styles';
import ReadMore from 'components/slices/ListicleV2/MediumListicle/ReadMore/index';
import Button from 'UI/Button';
import {
  trackCTAClickEvent,
  trackMapClickEvent,
  trackReadMoreEvent,
} from 'utils/listicle';
import { LISTICLE_TYPE, SETTINGS_TYPE } from 'const/index';
import { strings } from 'const/strings';
import { ARROW_DOWN, LISTICLE_CHEVRON_UP } from 'assets/SvgIcons';

const MediumListicleGrid = ({
  settingsType,
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
  alt,
}: IMediumListicleGridProps) => {
  const [readMoreText, setReadMoreText] = useState(strings.READ_MORE);
  const [width] = useWindowSize();
  const isMobile = width <= 768;
  const [overFlowContent, setOverflowContent] = useState(!isMobile);
  const [icon, setIcon] = useState(ARROW_DOWN);

  const onClickReadMore = () => {
    if (readMoreText === strings.READ_MORE) {
      trackReadMoreEvent({
        cardSize: LISTICLE_TYPE.MEDIUM,
        experienceType,
        experienceId: experienceId as string,
        listicleSectionTitle,
        heading,
        experienceName: experienceName as string,
        index,
      });
    }
    setReadMoreText((prev) =>
      prev === strings.READ_MORE ? strings.READ_LESS : strings.READ_MORE
    );
    setIcon(
      readMoreText === strings.READ_MORE ? LISTICLE_CHEVRON_UP : ARROW_DOWN
    );
    setOverflowContent((prev) => !prev);
  };

  const onClickCTAButton = () => {
    trackCTAClickEvent({
      cardSize: LISTICLE_TYPE.MEDIUM,
      experienceType,
      experienceId: experienceId as string,
      listicleSectionTitle,
      heading,
      experienceName: experienceName as string,
      index,
    });
    // TODO: Confirm this from Siddhesh that whetehr we want a button or anchor tag for better SEO.
    window.open(ctaUrl, '_blank', 'noopener, noreferrer');
  };

  const onClickMapLink = () => {
    trackMapClickEvent({
      cardSize: LISTICLE_TYPE.MEDIUM,
      experienceType,
      experienceId: experienceId as string,
      listicleSectionTitle,
      heading,
      experienceName: experienceName as string,
      index,
    });
    window.open(practicalInfo?.findItOnMap, '_blank', 'noopener, noreferrer');
  };

  return (
    <MediumListicleBox
      overflow={overFlowContent}
      isSettingsOne={settingsType === SETTINGS_TYPE.SETTINGS_ONE}
    >
      <ImageContainer imageUrl={imageUrl} index={index + 1} alt={alt} />
      <ContentContainer
        text={readMoreText}
        heading={heading}
        categoryTags={categoryTags}
        richTextData={richTextData}
        settings={settingsType}
        practicalInfo={practicalInfo}
        overflow={overFlowContent}
        onClickMapLink={onClickMapLink}
        index={index}
        isMobile={isMobile}
      />
      <Conditional if={isMobile}>
        <ReadMore
          text={readMoreText}
          onClick={onClickReadMore}
          icon={icon}
          settings={settingsType}
          index={index}
        />
      </Conditional>

      <CTAButtonWrapper
        isSettingsOne={settingsType === SETTINGS_TYPE.SETTINGS_ONE}
        isSettingsTwo={settingsType === SETTINGS_TYPE.SETTINGS_TWO}
        isReadMore={readMoreText === strings.READ_MORE}
      >
        <Conditional if={ctaUrl}>
          <Button className="cta-button">
            <a
              href={ctaUrl}
              target={'_blank'}
              onClick={onClickCTAButton}
              rel="noreferrer noopener"
            >
              {ctaText}
            </a>
          </Button>
        </Conditional>
      </CTAButtonWrapper>
    </MediumListicleBox>
  );
};
export default MediumListicleGrid;
