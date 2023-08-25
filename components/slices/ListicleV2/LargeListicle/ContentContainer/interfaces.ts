export interface IContentContainerProps {
  heading: string;
  categoryTags: Array<string>;
  practicalInfo: PracticalInfo;
  tabData: Array<LargeListicleTabData>;
  richTextData: Array<any>;
  isModalOpen: boolean;
  isMobile: boolean;
  ctaText: string;
  ctaUrl: string;
  onClickCTAButton: () => void;
  onClickMapLink: () => void;
}
