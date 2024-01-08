export type TCriticReviewProps = {
  rating: number;
  reviewContent: {
    text: string;
    type: string;
    spans: [];
  };
  criticName: {
    text: string;
    type: string;
    spans: [];
  };
};
