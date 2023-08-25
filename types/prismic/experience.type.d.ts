type PracticalInfo = {
  location: string;
  findItOnMap: string;
  openingHours: Array<any>;
  distance: string;
  duration: string;
  season: string;
  calendar: string;
};

type LargeListicleTabData = {
  title: string;
  text: string;
};

type Experience = {
  experienceType: string;
  heading: string;
  imageUrl: string;
  imageAlt: string;
  ctaText: string;
  ctaUrl: string;
  categoryTags: Array<string>;
  richTextData: Array<any>;
  tabData?: Array<LargeListicleTabData>;
  experienceId?: string;
  practicalInfo?: PracticalInfo;
  experienceName?: string;
  slices?: Record<any, any>;
};
