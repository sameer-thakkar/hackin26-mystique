export interface IContentContainerProps {
  heading: string;
  categoryTags: string;
  richTextData: any;
  ctaText: string;
  ctaUrl: string;
  readMoreText: string;
  overflow: boolean;
  onClickCTA: () => void;
  onClickReadMore: () => void;
}
