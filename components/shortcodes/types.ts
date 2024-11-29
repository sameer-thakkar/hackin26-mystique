export type TExperienceDrawerPortal = {
  isPopUpOpen: boolean;
  tgid: string;
  showNextAvailable: boolean;
  descriptors: any;
  scorpioData?: any;
  tourPrices: any;
  currentLanguage: string;
  isMobile: boolean;
  host: string;
  defaultOpen: boolean;
  isShortcodePopup: boolean;
  handleShortcodeDrawer: (isOpen: boolean) => void;
};
