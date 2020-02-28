import React from 'react';
import ImageLinksCarousel from '../../components/slices/ImageLinksCarousel';
import '../../public/static/global.css';

export default {
  title: 'Slices/Image Links Carousel',
  component: ImageLinksCarousel,
};

export const Basic = () => {
  return (
    <ImageLinksCarousel
      lazyLoadImages={false}
      description={[
        {
          type: 'paragraph',
          text:
            'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit quibusdam dicta fuga est cum dolorem, totam quia obcaecati dolores incidunt officia soluta quos voluptate unde, optio eligendi deleniti aliquid nemo?',
          spans: [],
        },
      ]}
      heading="Lorem Ipsum"
      cards={[
        {
          image: {
            url:
              'https://images.prismic.io/mystique/dfbd70ae-854b-4aa7-8423-3aea6e8d3c08_Casa+Batllo+Barcelona+3.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/dfbd70ae-854b-4aa7-8423-3aea6e8d3c08_Casa+Batllo+Barcelona+3.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/dfbd70ae-854b-4aa7-8423-3aea6e8d3c08_Casa+Batllo+Barcelona+3.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/dfbd70ae-854b-4aa7-8423-3aea6e8d3c08_Casa+Batllo+Barcelona+3.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/dfbd70ae-854b-4aa7-8423-3aea6e8d3c08_Casa+Batllo+Barcelona+3.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/dfbd70ae-854b-4aa7-8423-3aea6e8d3c08_Casa+Batllo+Barcelona+3.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
      ]}
      isMobile={false}
    />
  );
};

export const Mobile = () => (
  <div style={{ width: 400 }}>
    <ImageLinksCarousel
      lazyLoadImages={false}
      description={[
        {
          type: 'paragraph',
          text:
            'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit quibusdam dicta fuga est cum dolorem, totam quia obcaecati dolores incidunt officia soluta quos voluptate unde, optio eligendi deleniti aliquid nemo?',
          spans: [],
        },
      ]}
      heading="Lorem Ipsum"
      cards={[
        {
          image: {
            url:
              'https://images.prismic.io/mystique/384ea433-fd87-4be4-8010-b38fc6f9da78_tree-architecture-road-street-town-building-1276221-pxhere.com.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/384ea433-fd87-4be4-8010-b38fc6f9da78_tree-architecture-road-street-town-building-1276221-pxhere.com.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/384ea433-fd87-4be4-8010-b38fc6f9da78_tree-architecture-road-street-town-building-1276221-pxhere.com.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/384ea433-fd87-4be4-8010-b38fc6f9da78_tree-architecture-road-street-town-building-1276221-pxhere.com.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/384ea433-fd87-4be4-8010-b38fc6f9da78_tree-architecture-road-street-town-building-1276221-pxhere.com.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/384ea433-fd87-4be4-8010-b38fc6f9da78_tree-architecture-road-street-town-building-1276221-pxhere.com.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/384ea433-fd87-4be4-8010-b38fc6f9da78_tree-architecture-road-street-town-building-1276221-pxhere.com.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
        {
          image: {
            url:
              'https://images.prismic.io/mystique/384ea433-fd87-4be4-8010-b38fc6f9da78_tree-architecture-road-street-town-building-1276221-pxhere.com.jpg',
            alt: 'something',
          },
          link: { url: 'https://www.headout.com' },
          card_title: 'Super',
        },
      ]}
      isMobile={true}
    />
  </div>
);
