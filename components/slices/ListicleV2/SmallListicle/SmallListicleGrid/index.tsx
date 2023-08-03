import { useState } from 'react';
import ContentContainer from 'components/slices/ListicleV2/SmallListicle/SmallListicleGrid/ContentContainer/index';
import ImageContainer from 'components/slices/ListicleV2/SmallListicle/SmallListicleGrid/ImageContainer/index';
import { ISmallListicleGridProps } from 'components/slices/ListicleV2/SmallListicle/SmallListicleGrid/interfaces';
import { SmallListicleBox } from 'components/slices/ListicleV2/SmallListicle/SmallListicleGrid/styles';
import {
  trackCTAClickEvent,
  trackReadMoreEvent,
} from 'components/slices/ListicleV2/utils';
import { LISTICLE_TYPE } from 'const/index';
import { strings } from 'const/strings';

const SmallListicleGrid = ({
  imageUrl,
  index,
  heading,
  experienceType,
  categoryTags,
  richTextData,
  ctaText,
  ctaUrl,
  experienceId,
  experienceName,
  listicleSectionTitle,
  alt,
}: ISmallListicleGridProps) => {
  const READ_MORE = strings.READ_MORE;
  const READ_LESS = strings.READ_LESS;
  const [readMoreText, setReadMoreText] = useState(READ_MORE);

  const onClickReadMore = () => {
    setReadMoreText((prev) => (prev === READ_MORE ? READ_LESS : READ_MORE));

    if (readMoreText === READ_MORE) {
      trackReadMoreEvent({
        cardSize: LISTICLE_TYPE.SMALL,
        experienceType,
        experienceId: experienceId as string,
        listicleSectionTitle,
        heading,
        experienceName: experienceName as string,
        index,
      });
    }
  };

  const onClickCTA = () => {
    trackCTAClickEvent({
      cardSize: LISTICLE_TYPE.SMALL,
      experienceType,
      experienceId: experienceId as string,
      listicleSectionTitle,
      heading,
      experienceName: experienceName as string,
      index,
    });
  };

  return (
    <SmallListicleBox
      overflow={readMoreText === READ_MORE}
      isRichTextPresent={richTextData?.length}
    >
      <ImageContainer imageUrl={imageUrl} index={index + 1} alt={alt} />
      <ContentContainer
        heading={heading}
        categoryTags={categoryTags}
        richTextData={richTextData}
        onClickReadMore={onClickReadMore}
        onClickCTA={onClickCTA}
        ctaText={ctaText}
        ctaUrl={ctaUrl}
        readMoreText={readMoreText}
        overflow={readMoreText === READ_MORE}
      />
    </SmallListicleBox>
  );
};
export default SmallListicleGrid;
