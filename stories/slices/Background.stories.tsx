import React from 'react';
import Background from '../../components/slices/Background';

export default {
  title: 'Slices/Background',
  component: Background,
};

const data = {
  color: 'Light Grey',
  textCenter: false,
  slices: [
    {
      slice_type: 'rich_text',
      slice_label: null,
      items: [
        {
          text: [
            {
              type: 'paragraph',
              text: 'LOREM 1 (Inside Background)',
              spans: [
                {
                  start: 0,
                  end: 27,
                  type: 'strong',
                },
              ],
            },
            {
              type: 'paragraph',
              text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non erat laoreet, venenatis velit eget, pharetra elit. Suspendisse et risus arcu. Praesent vitae augue ex. Praesent sem nibh, euismod vel sollicitudin a, blandit vel ante. Proin tempus, neque faucibus commodo pretium, lorem magna malesuada sem, eu congue sem turpis a lorem. Quisque a dolor laoreet, gravida magna vel, dignissim augue. Aenean porttitor, tellus ut pretium tristique, sem ex cursus mi, et rhoncus arcu est ac erat. Nam quis enim et quam viverra sodales et quis magna. Sed tempor turpis non odio ultrices fringilla. Donec bibendum sed lorem ut commodo. Curabitur auctor purus nunc, eu rhoncus dui dignissim ac. Phasellus tincidunt, tortor vitae interdum dignissim, risus massa tristique nisi, non mollis mi augue vel tellus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla id vulputate metus. Aenean eu arcu neque. Suspendisse consectetur neque ac faucibus euismod.',
              spans: [
                {
                  start: 0,
                  end: 17,
                  type: 'strong',
                },
                {
                  start: 288,
                  end: 299,
                  type: 'strong',
                },
              ],
            },
            {
              type: 'paragraph',
              text:
                '{cta link="https://www.google.com/" text="Book Now" align="center" fill="yes"}',
              spans: [],
            },
          ],
        },
      ],
      primary: {},
    },
  ],
  sliceProps: {
    isMobile: false,
    uid: 'sydney.opera-tickets.org',
  },
};

export const Basic = () => {
  return (
    <div style={{ width: 1200, padding: 50 }}>
      <Background {...data} />
    </div>
  );
};
