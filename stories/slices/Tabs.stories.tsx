import React from 'react';
import Tab from '../../components/slices/Tab';
import TabWrapper from '../../components/slices/TabWrapper';
import '../../public/static/styles.css';

export default {
  title: 'Slices/Tabs',
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
                  text: 'Why Watch The Lion King',
                  spans: [
                    {
                      start: 0,
                      end: 23,
                      type: 'strong',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  text:
                    "Set against the majesty of the Serengeti Plains and to the evocative rhythms of Africa, Disney's multi-award-winning musical will redefine your expectations of theatre. Brilliantly reimagined by acclaimed director Julie Taymor, Disney's beloved film has been transformed into a spectacular theatrical experience that explodes with glorious colours, stunning effects, and enchanting music. At its heart is the powerful and moving story of Simba - the epic adventure of his journey from wide-eyed cub to his destined role as King of the Pridelands.",
                  spans: [],
                },
                {
                  type: 'paragraph',
                  text:
                    'The Lion King tells the story of a young lion, Simba, and his coming of age. Growing up as the jungle prince, Simba idolized his father Mufasa - one of the greatest rulers the African Pride Lands has ever seen - and is preparing to be next in line. However, a family tragedy causes Simba to flee from his kingdom and go into exile instead. Years later, Simba realizes the truth and finally makes his way home. Follow Simba’s journey as he returns home to fulfil his true destiny as the true King of the Pride Lands.',
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
      parent: {
        slice_type: 'tab_wrapper',
        primary: {
          title: 'This is a Wrapper Heading.',
        },
        items: [{}],
        parent: {
          slices: [null],
        },
      },
    },
  ],
  heading: 'Heading for the Tabs.',
};

export const RichText = () => {
  return <TabWrapper {...data} />;
};
