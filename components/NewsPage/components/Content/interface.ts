export type TBannerProps = {
  bannerImage: {
    url: string;
  };
};

export type TPageContentProps = {
  content: TBannerProps & {
    contentFrameworkSlices: Record<string, any>[];
  };
};
