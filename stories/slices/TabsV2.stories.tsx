import React from 'react';
import TabWrapper from '../../components/slices/TabWrapper';
import useWindowSize from '../../components/hooks/useWindowSize';

export default {
  title: 'Slices/Tabs V2',
  component: TabWrapper,
};

const data = {
  slices: [
    {
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
      ],
      slice_type: 'tab',
      primary: {
        title: 'Frozen',
        tab_type: 'Rich Slices',
        is_default: 'No',
      },
      items: [{}],
    },
    {
      slices: [
        {
          slice_type: 'rich_text',
          slice_label: null,
          items: [
            {
              text: [
                {
                  type: 'heading2',
                  text: 'The Lion King',
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
                  text: '',
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
      ],
      slice_type: 'tab',
      primary: {
        title: 'Lion King',
        tab_type: 'Rich Slices',
        is_default: 'Yes',
      },
      items: [{}],
    },
  ],
  heading: 'This is a Wrapper Heading.',
  sliceProps: {
    isMobile: true,
  },
};

export const Basic = () => {
  const isMobile = useWindowSize().width < 768;
  const sliceProps = {
    ...data.sliceProps,
    isMobile,
  };
  return (
    <div style={{ width: 900, padding: 50, position: 'relative' }}>
      <TabWrapper {...data} sliceProps={sliceProps} />
    </div>
  );
};
