type PracticalInfo = {
  location: string;
  findItOnMap: string;
  openingHours: Array<any>;
  distance: string;
  duration: string;
  season: string;
  calendar: string;
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
  experienceId?: string;
  practicalInfo?: PracticalInfo;
  experienceName?: string;
  slices?: Record<any, any>;
};
