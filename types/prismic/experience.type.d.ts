type PracticalInfo = {
  location: string;
  findItOnMap: string;
  timings: any;
  distance: string;
  time: string;
  season: string;
  title: string;
  content: string;
};

type Experience = {
  experienceType: string;
  heading: string;
  imageUrl: string;
  imageAlt: string;
  ctaText: string;
  ctaUrl: string;
  categoryTags: Array<string>;
  richTextData: any;
  experienceId?: string;
  practicalInfo?: PracticalInfo;
  experienceName?: string;
  slices?: any;
};
