import React from 'react';
import Listicle from '../../components/slices/Listicle';
import { deepCopy } from '../../utils/storybook';

export default {
  title: 'Slices/Listicle',
  component: Listicle,
};

const data = {
  slice_type: 'listicle',
  items: [
    {
      image: {},
      info_title: 'Address',
      info_description: [{ type: 'paragraph', text: 'Lorem Ipsum', spans: [] }],
      timings_left_column: 'Mon',
      timings_right_column: '10:00 - 12:00',
    },
    {
      image: {},
      info_title: 'Telephone',
      info_description: [{ type: 'paragraph', text: '123456789', spans: [] }],
      timings_left_column: 'Tue',
      timings_right_column: '11:00 - 1:00',
    },
  ],
  primary: {
    title: null,
    summary: [
      {
        type: 'paragraph',
        text:
          'An hour’s drive (approx. 100 km) or a 40-minute train ride from Barcelona, Girona is a medieval town settled on the banks of River Onyar. The city even served as one of the locations of the popular series Game of Thrones, a tour that takes you along the ancient streets with castle walls and traditional markets.',
        spans: [],
      },
    ],
    tgid: 9016,
    why_summary: [
      {
        type: 'paragraph',
        text:
          'An hour’s drive (approx. 100 km) or a 40-minute train ride from Barcelona, Girona is a medieval town settled on the banks of River Onyar. The city even served as one of the locations of the popular series Game of Thrones, a tour that takes you along the ancient streets with castle walls and traditional markets.',
        spans: [],
      },
    ],
    book_now_link: { link_type: 'Web', url: 'https://www.headout.com' },
    read_more_link: { link_type: 'Web', url: 'https://www.headout.com' },
    show_price: true,
    theatre_name: 'Oxford Theatre',
    duration: '2 hours',
    tags: 'Fun, Food',
    seating_chart_link: { link_type: 'Web', url: 'https://www.headout.com' },
    seating_chart_image: {
      dimensions: { width: 6720, height: 4480 },
      alt: null,
      copyright: null,
      url:
        'https://images.prismic.io/mystique/edce8f73-2cf0-4822-b757-c4290dc44447_harry+potter+11.jpeg?auto=compress,format',
    },
  },
};

export const LargeVariant1 = () => {
  return (
    <div style={{ maxWidth: 690 }}>
      <Listicle type="large" index={0} data={data} />
    </div>
  );
};

export const LargeVariant2 = () => {
  const dataCopy = deepCopy(data);
  delete dataCopy.primary.tgid;
  dataCopy.primary.title = 'Large Listicle';
  return (
    <div style={{ maxWidth: 690 }}>
      <Listicle type="large" index={0} data={dataCopy} />
    </div>
  );
};

export const LargeVariant3 = () => {
  const dataCopy = deepCopy(data);
  delete dataCopy.primary.read_more_link;
  return (
    <div style={{ maxWidth: 690 }}>
      <Listicle type="large" index={0} data={dataCopy} />
    </div>
  );
};

export const Medium = () => {
  return (
    <div style={{ maxWidth: 690 }}>
      <Listicle type="medium" index={0} data={data} />
    </div>
  );
};

export const Small = () => {
  return (
    <div style={{ maxWidth: 690 }}>
      <Listicle type="small" index={0} data={data} />
    </div>
  );
};
