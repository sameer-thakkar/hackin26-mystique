type RichTextField = import('@prismicio/types').RichTextField;

type ProductCard = {
  title: string;
  highlights?: Array<any>;
  primaryCollection: PrimaryCollecton;
  primaryCategory: PrimaryCategory;
  primarySubCategory: PrimaryCategory;
  descriptors: Array<string>;
  secondaryDescriptors: Array<{
    code: string;
    name: string;
  }>;
  productHighlights: string;
  cardFooter: string;
  theater: string;
  content_theater: string;
  contentBlocks: any;
  productImage: string;
  descriptionImage: string;
  price: number;
  flowType: string;
  scratchPrice: number;
  currencySymbol: string;
  tgid: number;
  images: Media[];
  averageRating: number;
  reviewCount: number;
  ctaBooster: string;
  description: string;
  available: boolean;
  overlayBooster: string;
  vendor: string;
  allTags: Array<string>;
  reopeningDate: string;
  closingDate: string;
  hasBestSafety: boolean;
  category: {
    collectionName: string;
    primaryCategoryName: string;
    primarySubCategoryName: string;
  };
  microBrandsHighlight: {
    [k: string]: string;
  };
  listingPrice: ListingPrice;
  safetyImages: null;
  showPageUid: string;
  listicleShowSummary: {
    heading: string;
    text: RichTextField;
  };
  listicleWhyWatch: {
    heading: string;
    text: RichTextField;
  };
  hasSpecialOffer: boolean;
  minDuration: number;
  maxDuration: number;
  combo: boolean;
  multiVariant: boolean;
  urlSlugs: IUrlSlugs;
};

type PrimaryCategory = {
  id: number;
  name: string;
  categoryId: number;
  rank: number;
  displayName: string;
  heading: string;
  metaTitle: 'London Musical Tickets  – Top Musicals in London';
  metaDescription: string;
  noIndex: boolean;
  canonicalUrl: string;
};

type PrimarySubCategory = {
  id: number;
  name: string;
  categoryId: number;
  rank: number;
  displayName: string;
  heading: string;
  metaTitle: 'London Musical Tickets  – Top Musicals in London';
  metaDescription: string;
  noIndex: boolean;
  canonicalUrl: string;
};

type PrimaryCollecton = {
  id: number;
  name: string;
  displayName: string;
};

type TGIDProductCardMap = {
  [key: number]: ProductCard;
};
