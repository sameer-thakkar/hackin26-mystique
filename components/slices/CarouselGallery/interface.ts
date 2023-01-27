export type CarouselGalleryProps = {
  heading: string;
  images: Array<{
    linked_image: {
      url: string;
    };
    image_alt?: string;
    heading: Array<{}>;
    content: Array<{}>;
    cta_link?: {
      url: string;
    };
  }>;
};
