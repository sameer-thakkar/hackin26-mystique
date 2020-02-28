import React from 'react';
import FeatureBox from '../../components/slices/FeatureBox';

export default {
  title: 'Slices/Feature Box',
  component: FeatureBox,
};

export const Basic = () => {
  return (
    <FeatureBox
      blocks={[
        {
          image_source: {
            dimensions: { width: 1024, height: 712 },
            alt: null,
            copyright: null,
            url:
              'https://images.prismic.io/mystique/35d1c051-f11e-4cc5-b003-1af89bcab1d2_Windsor+Castle+Highlights+11.jpg?auto=compress,format',
          },
          image_url: { link_type: 'Any' },
          feature_description: [
            {
              type: 'paragraph',
              text:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore accusantium eius nostrum maiores sunt dignissimos illo itaque molestiae sequi ea dicta et vitae consequatur praesentium nihil, adipisci ad pariatur! Nisi! Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore accusantium eius nostrum maiores sunt dignissimos illo itaque molestiae sequi ea dicta et vitae consequatur praesentium nihil, adipisci ad pariatur! Nisi! Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore accusantium eius nostrum maiores sunt dignissimos illo itaque molestiae sequi ea dicta et vitae consequatur praesentium nihil, adipisci ad pariatur! Nisi!',
              spans: [],
            },
          ],
        },
      ]}
      lazyLoad={false}
    />
  );
};
