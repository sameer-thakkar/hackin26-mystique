import React from 'react';
import Background from '../../components/slices/Background';

export default {
  title: 'Slices/Background Section',
  component: Background,
};

const data = {
  color: 'Light Grey',
  textCenter: true,
  slices: [
    {
      slice_type: 'rich_text',
      slice_label: null,
      items: [
        {
          text: [
            {
              type: 'heading2',
              text: 'Why Watch Frozen',
              spans: [
                {
                  start: 0,
                  end: 16,
                  type: 'strong',
                },
              ],
            },
            {
              type: 'paragraph',
              text:
                'Frozen captured the imagination of families worldwide with an emotional story of sisterly bond at its core. Backed with a catchy soundtrack, it produced the global sensation “Let It Go”. The Broadway production is brought to you by the creators of the movie, so you can expect the source material to be honored. With a stellar set design that beautifully captures the majesty and familiarity of Arendelle, you’re in for a magical ride back to Elsa and Anna.',
              spans: [],
            },
            {
              type: 'paragraph',
              text:
                'Follow the story of Anna and Elsa, two sisters brought up in the same castle, but with literal and figurative walls between them. After their parents tragically die in a storm, Elsa must suppress her cryokinetic magic and become the Queen of Arendelle. But is it always that easy to let it go? Anna, on the other hand, has to bring the family together when a prince from the Southern Isles sets his eyes on her kingdom. Will she succeed and reunite with her sister?',
              spans: [],
            },
          ],
        },
      ],
      primary: {},
    },
    {
      slice_type: 'rich_text',
      slice_label: null,
      items: [
        {
          text: [
            {
              type: 'paragraph',
              text:
                'Anna, on the other hand, has to bring the family together when a prince from the Southern Isles sets his eyes on her kingdom. Will she succeed and reunite with her sister?',
              spans: [],
            },
          ],
        },
      ],
      primary: {},
    },
    {
      slices: [
        {
          slice_type: 'card',
          slice_label: null,
          items: [
            {
              image_source: {},
              image_url: {
                link_type: 'Any',
              },
              image_alt: null,
            },
          ],
          primary: {
            card_title: 'An Awesome Card',
            card_description: [
              {
                type: 'paragraph',
                text:
                  'Anna, on the other hand, has to bring the family together when a prince from the Southern Isles sets his eyes on her kingdom. Will she succeed and reunite with her sister?',
                spans: [],
              },
            ],
            card_link: {
              link_type: 'Any',
            },
            card_link_type: null,
            cta_text: 'Book Now',
            cta_link: {
              link_type: 'Web',
              url: 'https://www.google.com',
              target: '_blank',
            },
          },
        },
        {
          slice_type: 'card',
          slice_label: null,
          items: [
            {
              image_source: {},
              image_url: {
                link_type: 'Any',
              },
              image_alt: null,
            },
          ],
          primary: {
            card_title: 'Another Awesome Card',
            card_description: [
              {
                type: 'paragraph',
                text:
                  'Anna, on the other hand, has to bring the family together when a prince from the Southern Isles sets his eyes on her kingdom. Will she succeed and reunite with her sister?',
                spans: [],
              },
            ],
            card_link: {
              link_type: 'Any',
            },
            card_link_type: null,
            cta_text: null,
            cta_link: {
              link_type: 'Any',
            },
          },
        },
      ],
      slice_type: 'card_section',
      primary: {
        card_section_title: null,
        card_section_type: 'Grid',
        card_type: 'Column Card',
      },
      items: [{}],
    },
  ],
  sliceProps: {},
};

export const Basic = () => {
  return (
    <div style={{ width: 1200, padding: 50 }}>
      <Background
        {...{ ...data, color: 'Default', slices: [data.slices[0]] }}
      />
      <Background {...data} />
    </div>
  );
};
