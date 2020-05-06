import React from 'react';
import SliderAccordion from '../../components/slices/SliderAccordion';

export default {
  title: 'Slices/Question',
  component: SliderAccordion,
};

const data = {
  faqs: [
    {
      question: 'Can I skip the long lines with these tickets?',
      answer: [
        {
          type: 'paragraph',
          text:
            'Yes, you will be able to skip the long ticket queues with these tickets. Since the Vatican is one of the most visited attractions in Rome, the waiting line to get tickets to the museums can be anywhere between 30 minutes - 90 minutes long.',
          spans: [],
        },
        {
          type: 'paragraph',
          text: '',
          spans: [],
        },
      ],
      images: [
        {
          url:
            'https://images.prismic.io/mystique/38103e67-a23a-4ef7-93fb-7a32550bee57_Big+Bus+-+M.png?auto=compress,format',
          caption: null,
          alt: null,
        },
      ],
    },
    {
      question:
        'Do I need tickets to enter the Vatican Museums and St. Peter’s Basilica?',
      answer: [
        {
          type: 'paragraph',
          text:
            'Entry to the Vatican Museums and Sistine Chapel require you to purchase tickets. On the other hand, entry to St. Peter’s Basilica is free. However, if you wish to skip the long lines at St. Peter’s Basilica, it is advised that you purchase a skip the line ticket as the queue can easily be upto 60 minutes long.',
          spans: [],
        },
        {
          type: 'paragraph',
          text: '',
          spans: [],
        },
      ],
      images: [
        {
          url:
            'https://images.prismic.io/mystique/e4a77b8a-f31f-4728-8a70-202b6ae96843_Original+-+M.png?auto=compress,format',
          caption: null,
          alt: null,
        },
        {
          url:
            'https://images.prismic.io/mystique/38103e67-a23a-4ef7-93fb-7a32550bee57_Big+Bus+-+M.png?auto=compress,format',
          caption: null,
          alt: null,
        },
      ],
    },
  ],
  sliceProps: {
    index: 0,
    activeTabId: 'lion-king',
    isMobile: false,
  },
};

export const AccordionComboSingleImage = () => {
  const singleImageFAQs = data.faqs.filter((faq) => faq.images.length === 1);
  return <SliderAccordion {...data} faqs={singleImageFAQs} />;
};

export const AccordianComboMultiImage = () => {
  const multiImageFAQs = data.faqs.filter((faq) => faq.images.length > 1);
  return <SliderAccordion {...data} faqs={multiImageFAQs} />;
};

export const AccordianComboSliderComplete = () => {
  return <SliderAccordion {...data} />;
};
