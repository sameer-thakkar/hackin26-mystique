export interface IContentContainerProps {
  heading: string;
  settings: string;
  categoryTags: Array<string>;
  richTextData: Array<any>;
  index: number;
  overflow: boolean;
  practicalInfo: PracticalInfo;
  text: string;
  isMobile: boolean;
  onClickMapLink: () => void;
}
