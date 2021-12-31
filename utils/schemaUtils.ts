import { getValidUrl } from 'utils/urlUtils';

type imageArray = {
  url: string;
  [key: string]: any;
};
type reviewArray = {
  nonCustomerName: string;
  rating: number;
  reviewTime: number;
  content: string;
  [key: string]: any;
};
type reviewDetailsType = {
  averageRating: number;
  ratingsCount: number;
  reviewsCount: number;
  ratingsSplit: { [key: string]: number };
};
type productSchemaType = {
  productName: string;
  price: string | number;
  currencySymbol: string;
  reviewsDetails?: reviewDetailsType;
  images?: imageArray[];
  topReviews?: reviewArray[];
};

export const getProductSchemaImages = (array: imageArray[]): string[] =>
  array?.map((image) => getValidUrl(image?.url));

export const getReviewSchema = (array: reviewArray[], productName: string) =>
  array?.map((review) => {
    const { nonCustomerName, rating, reviewTime, content } = review;
    const datePublished = new Date(reviewTime).toISOString();
    return {
      author: {
        type: 'Person',
        name: nonCustomerName,
      },
      datePublished,
      name: productName,
      reviewBody: content,
      reviewRating: {
        bestRating: '5',
        ratingValue: `${rating}`,
        worstRating: '1',
      },
    };
  });

export const getProductSchema = ({
  productName,
  price,
  currencySymbol,
  reviewsDetails,
  images,
  topReviews,
}: productSchemaType) => {
  const offerSchema = {
    price: `${price}`,
    priceCurrency: currencySymbol,
  };
  const { averageRating, reviewsCount, ratingsCount } = reviewsDetails || {};
  return {
    productName,
    offers: [offerSchema],
    ...(ratingsCount &&
      reviewsCount &&
      averageRating && {
        aggregateRating: {
          ratingValue: `${averageRating}`,
          reviewCount: `${reviewsCount}`,
          ratingCount: `${ratingsCount}`,
        },
      }),
    ...(images &&
      images?.length && {
        images: getProductSchemaImages(images),
      }),
    ...(topReviews &&
      topReviews?.length && {
        reviews: getReviewSchema(topReviews, productName),
      }),
  };
};
