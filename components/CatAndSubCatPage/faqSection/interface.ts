export type FaqSectionProps = {
  faqData: Array<{
    heading: string;
    content: Array<Record<string, any>>;
  }>;
  isOpenOverride: boolean;
  useSchema: boolean;
  isMobile: boolean;
};
