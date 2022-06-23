import { PropsWithChildren } from 'react';

type AMPCarouselProps = {
  type: 'slides' | 'carousel';
  layout?: 'responsive' | 'fixed-height' | 'fill' | 'flex-item';
  width?: string;
  height: string;
};

const AMPCarousel = (props: PropsWithChildren<AMPCarouselProps>) => {
  const { type, layout, width, height, children } = props;

  return (
    <amp-carousel
      type={type}
      layout={layout}
      width={width}
      height={height}
      controls
      role="region"
      data-next-button-aria-label="Go to next slide"
      data-previous-button-aria-label="Go to previous slide"
    >
      {children}
    </amp-carousel>
  );
};

export default AMPCarousel;
