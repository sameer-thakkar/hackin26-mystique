import React from 'react';
import TableV2 from '../../components/slices/TableV2';
import useWindowSize from '../../components/hooks/useWindowSize';

export default {
  title: 'Slices/Tables',
  component: TableV2,
};

const data = {
  title: 'This is the Table Heading.',
  rows: [
    {
      columns: [
        {
          content: [
            {
              type: 'paragraph',
              text: 'Venue',
              spans: [
                {
                  start: 0,
                  end: 5,
                  type: 'strong',
                },
              ],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: 'Monday',
              spans: [
                {
                  start: 0,
                  end: 6,
                  type: 'strong',
                },
              ],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: 'Tuesday',
              spans: [
                {
                  start: 0,
                  end: 7,
                  type: 'strong',
                },
              ],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: 'Wednesday',
              spans: [
                {
                  start: 0,
                  end: 9,
                  type: 'strong',
                },
              ],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: 'Thursday',
              spans: [
                {
                  start: 0,
                  end: 8,
                  type: 'strong',
                },
              ],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: 'Friday',
              spans: [
                {
                  start: 0,
                  end: 8,
                  type: 'strong',
                },
              ],
            },
          ],
        },
      ],
      primary: {},
    },
    {
      columns: [
        {
          content: [
            {
              type: 'paragraph',
              text: 'Vatican Museum',
              spans: [],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: '09: 00 AM - 06: 00 PM',
              spans: [],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: '09: 00 AM - 06: 00 PM',
              spans: [],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: '09: 00 AM - 06: 00 PM',
              spans: [],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: '09: 00 AM - 06: 00 PM',
              spans: [],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: '09: 00 AM - 06: 00 PM',
              spans: [],
            },
          ],
        },
      ],
      primary: {},
    },
    {
      columns: [
        {
          content: [
            {
              type: 'paragraph',
              text: 'St Peters Basilica',
              spans: [],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: '09: 00 AM - 06: 00 PM',
              spans: [],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: '09: 00 AM - 06: 00 PM',
              spans: [],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: '09: 00 AM - 06: 00 PM',
              spans: [],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: '09: 00 AM - 06: 00 PM',
              spans: [],
            },
          ],
        },
        {
          content: [
            {
              type: 'paragraph',
              text: '09: 00 AM - 06: 00 PM',
              spans: [],
            },
          ],
        },
      ],
      primary: {},
    },
  ],
};

export const Table = () => {
  const { width } = useWindowSize();
  return <TableV2 {...data} isMobile={width < 768} />;
};
