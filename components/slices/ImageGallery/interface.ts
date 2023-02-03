export type ImageGalleryProps = {
  heading: string;
  images: Array<{
    heading: Array<{}>;
    content: Array<{}>;
    linked_image: {
      url: string;
    };
    uploaded_image: {
      url: string;
    };
    image_alt?: string;
  }>;
};
