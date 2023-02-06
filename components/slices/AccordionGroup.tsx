import React from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { FAQPageJsonLd } from 'next-seo';
import Conditional from 'components/common/Conditional';
import Accordion from 'components/slices/Accordion';
import RichContent from 'components/UI/RichContent';
import TitleTextCombo from 'components/UI/TitleTextCombo';
import { ESCAPE_REGEX, ESCAPE_REPLACER } from 'const/index';

/**
 *
 * Accordion slice allows you to have toggle-able content, heading is visible at all times and on-click the respective content gets shown/hidden.<br>
 * Commonly used for creating FAQs<br>
 * First accordion item is open by default.
 *
 * ### Non-Repeatable Zone
 * **Heading**: Section Heading.
 *
 * ### Repeatable Zone
 * **Heading**: Simple text field, this is always shown and is the clickable part of the Accordion.<br>
 * **Content**: RichText field, is by default hidden (except for first) unless user clicks on the heading or the chevron icon.
 *
 */
type AccordionGroupProps = {
  accordions: {
    content: any;
    heading: string;
  }[];
  heading: string | undefined;
  useSchema: Boolean;
  sliceProps?: any;
  isOpenOverride?: Boolean;
};

const AccordionGroup = ({
  accordions,
  heading,
  useSchema,
  sliceProps,
  isOpenOverride = true,
}: AccordionGroupProps) => {
  const isGlobalMb = sliceProps?.isGlobalMb ? sliceProps?.isGlobalMb : false;
  const faqSchemaProps = accordions.map((acc) => {
    const { heading, content } = acc || {};
    return {
      questionName: heading?.replace(ESCAPE_REGEX, ESCAPE_REPLACER),
      acceptedAnswerText: RichText.asText(content)?.replace(
        ESCAPE_REGEX,
        ESCAPE_REPLACER
      ),
    };
  });

  return (
    <>
      <div>
        <Conditional if={heading}>
          <TitleTextCombo>
            <h2>{heading}</h2>
          </TitleTextCombo>
        </Conditional>
        {accordions.map((accordion, index) => {
          const content = <RichContent render={accordion.content} />;
          return (
            <Accordion
              key={index}
              index={index}
              content={content}
              isOpenOverride={index == 0 && isOpenOverride}
              heading={accordion.heading}
              isGlobalMb={isGlobalMb}
              useSchema={useSchema}
            />
          );
        })}
      </div>
      <Conditional if={useSchema}>
        <FAQPageJsonLd mainEntity={faqSchemaProps} />
      </Conditional>
    </>
  );
};

export default AccordionGroup;
