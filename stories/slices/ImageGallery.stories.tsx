import React from 'react';
import useWindowSize from '../../components/hooks/useWindowSize';
import ImageGallery from '../../components/slices/ImageGallery';

export default {
  title: 'Slices/Image Gallery',
  component: ImageGallery,
};

const data = {
  heading: 'Some Heading',
  images: [
    {
      uploaded_image: {
        dimensions: {
          width: 1600,
          height: 999,
        },
        alt: null,
        copyright: null,
        url:
          'https://images.prismic.io/mystique/cc03b8ec-86c6-46f2-9f79-638f01303c68_65a3da0b-bedb-4772-9401-0dd4de291893-11992-tokyo-tokyo-go-kart-rental-with-local-guide-from-akihabara-06.jpg?auto=compress,format',
      },
      linked_image: {
        link_type: 'Any',
      },
      image_caption: [
        {
          type: 'paragraph',
          text: 'Go Kart',
          spans: [],
        },
      ],
      image_credits: 'Person',
    },
    {
      uploaded_image: {
        dimensions: {
          width: 839,
          height: 1024,
        },
        alt: null,
        copyright: null,
        url:
          'https://images.prismic.io/mystique/e0b0e201-8663-41fc-9f41-24bc7805f4f7_Skydive+Generic+19.jpg?auto=compress,format',
      },
      linked_image: {
        link_type: 'Any',
      },
      image_caption: [
        {
          type: 'paragraph',
          text: 'Card',
          spans: [],
        },
      ],
      image_credits: null,
    },
    {
      uploaded_image: {
        dimensions: {
          width: 1600,
          height: 999,
        },
        alt: null,
        copyright: null,
        url:
          'https://images.prismic.io/mystique/f95e74fa-1595-4fe2-90a8-f0e496c57ada_6cc3f1f4-feb4-432c-a9f4-d03825a045df-11721-tokyo-tokyo-skytree-admission-ticket--02.jpg?auto=compress,format',
      },
      linked_image: {
        link_type: 'Any',
      },
      image_caption: [],
      image_credits: null,
    },
    {
      uploaded_image: {
        dimensions: {
          width: 1600,
          height: 999,
        },
        alt: null,
        copyright: null,
        url:
          'https://images.prismic.io/mystique/d7514bbd-2056-4db1-9483-7a0b8cd64ca2_fa7e8c3b-ce3f-4691-b397-f17b8cf2fef9-11733-tokyo-asakusa-rockza-adult-show-03.jpg?auto=compress,format',
      },
      linked_image: {
        link_type: 'Any',
      },
      image_caption: [],
      image_credits: null,
    },
    {
      uploaded_image: {
        dimensions: {
          width: 1600,
          height: 999,
        },
        alt: null,
        copyright: null,
        url:
          'https://images.prismic.io/mystique/0fbed18e-2ae1-40bf-8cb9-e63c6d1c3d0b_06bbeb57-8fde-40ca-a3b9-d31608811c89-11733-tokyo-asakusa-rockza-adult-show-05.jpg?auto=compress,format',
      },
      linked_image: {
        link_type: 'Any',
      },
      image_caption: [],
      image_credits: null,
    },
    {
      uploaded_image: {
        dimensions: {
          width: 1600,
          height: 999,
        },
        alt: null,
        copyright: null,
        url:
          'https://images.prismic.io/mystique/de2dfeac-a1fb-4901-b1ec-d70a8028be3a_Skydive+Grand+Canyon+4.jpg?auto=compress,format',
      },
      linked_image: {
        link_type: 'Any',
      },
      image_caption: [],
      image_credits: null,
    },
    {
      uploaded_image: {
        dimensions: {
          width: 1600,
          height: 999,
        },
        alt: null,
        copyright: null,
        url:
          'https://images.prismic.io/mystique/94082e03-8189-4788-8b3d-680c6eb20a44_Skydive+Grand+Canyon+3.jpg?auto=compress,format',
      },
      linked_image: {
        link_type: 'Any',
      },
      image_caption: [],
      image_credits: null,
    },
    {
      uploaded_image: {
        dimensions: {
          width: 1600,
          height: 999,
        },
        alt: null,
        copyright: null,
        url:
          'https://images.prismic.io/mystique/83d1cdff-b455-4eb0-bf69-8ceb49aef8cf_72596d51-f398-42b8-9f47-16e0c5f27e0c-11725-tokyo-japanese-drum-show-ticket--mangekyo--07.jpg?auto=compress,format',
      },
      linked_image: {
        link_type: 'Any',
      },
      image_caption: [],
      image_credits: null,
    },
  ],
  mobileLayout: 'Scrollable',
};

export const Basic = () => {
  const isMobile = useWindowSize().width < 768;
  return (
    <div style={{ width: 900, padding: 50, position: 'relative' }}>
      <ImageGallery {...data} isMobile={isMobile} />
    </div>
  );
};
