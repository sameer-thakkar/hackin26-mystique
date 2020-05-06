import React from 'react';
import Accordion from './Accordion';
import RichContent from '../UI/RichContent';

/**
 *
 * Accordion slice allows you to have toggleable content, heading is visible at all times and on-click the respective content gets shown/hidden.
 * Commonly used for creating FAQs
 * First accordion item is open by default.
 *
 * ### Repeatable Zone
 * **Heading**: Simple text field, this is always shown and is the clickable part of the Accordian.
 * **Content**: RichText field, is by default hidden (except for first) unless user clicks on the heading or the chevron icon.
 *
 */

const AccordionGroup: React.FC<{
  accordions: {
    content: any;
    heading: string;
  }[];
}> = ({ accordions }) => {
  return (
    <>
      {accordions.map((accordion, index) => {
        const content = <RichContent render={accordion.content} />;
        return (
          <Accordion
            key={index}
            content={content}
            isOpenOverride={index == 0}
            heading={accordion.heading}
          />
        );
      })}
    </>
  );
};

export default AccordionGroup;
