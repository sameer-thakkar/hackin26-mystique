export interface ISettingsContainerProps {
  richTextData: Array<any>;
  practicalInfo: PracticalInfo;
  overflow: boolean;
  text: string;
  isMobile: boolean;
  onClickMapLink: () => void;
  settingsType?: string;
}
