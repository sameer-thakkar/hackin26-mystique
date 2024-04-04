import { PrismicRichText } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import ReadMore from 'components/slices/ListicleV2/SmallListicle/ReadMore/index';
import { IContentContainerProps } from 'components/slices/ListicleV2/SmallListicle/SmallListicleGrid/ContentContainer/interface';
import {
  CategoryTagsWrapper,
  CategoryTagWrapper,
  ContentWrapper,
  GradientWrapper,
  RichTextWrapper,
  TitleWrapper,
} from 'components/slices/ListicleV2/SmallListicle/SmallListicleGrid/ContentContainer/styles';
import { shortCodeSerializer } from 'utils/shortCodes';

const ContentContainer = ({
  heading,
  categoryTags,
  richTextData,
  ctaText,
  ctaUrl,
  readMoreText,
  overflow,
  onClickCTA,
  onClickReadMore,
}: IContentContainerProps) => {
  return (
    <ContentWrapper>
      <TitleWrapper id="title">{heading}</TitleWrapper>
      <CategoryTagsWrapper>
        <Conditional if={categoryTags}>
          <CategoryTagWrapper>{categoryTags}</CategoryTagWrapper>
        </Conditional>
      </CategoryTagsWrapper>
      <RichTextWrapper overflow={overflow}>
        <PrismicRichText
          field={richTextData}
          components={shortCodeSerializer}
        />
        <Conditional if={overflow && richTextData?.length}>
          <GradientWrapper />
        </Conditional>
      </RichTextWrapper>
      <Conditional if={richTextData && richTextData?.length}>
        <ReadMore text={readMoreText} onClick={onClickReadMore} />
      </Conditional>
      <Conditional if={ctaText && ctaUrl}>
        <a
          href={ctaUrl}
          target={'_blank'}
          className="cta-btn"
          onClick={onClickCTA}
          rel="noopener"
        >
          {ctaText}
        </a>
      </Conditional>
    </ContentWrapper>
  );
};
export default ContentContainer;
