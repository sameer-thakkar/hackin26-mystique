import React from 'react';
import { FAQPageJsonLd } from 'next-seo';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import styled from 'styled-components';
import FaqSection from 'components/CatAndSubCatPage/faqSection';
import Conditional from 'components/common/Conditional';
import Accordion from 'components/slices/Accordion';
import RichContent from 'components/UI/RichContent';
import TitleTextCombo from 'components/UI/TitleTextCombo';
import { generateSidenavId } from 'utils/helper';
import COLORS from 'const/colors';
import { ESCAPE_REGEX, ESCAPE_REPLACER } from 'const/index';

const Divider = styled.div`
  padding-bottom: 1.5rem;
  border-bottom: 0.25px solid ${COLORS.GRAY.G7};
`;

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
  heading?: string;
  useSchema: boolean;
  isMobile?: boolean;
  sliceProps?: any;
  isOpenOverride?: boolean;
  headingNeedsSeparator?: boolean;
  tabData?: [];
  findBestSeatsCtaCallback?: () => void | null;
  isRevampedDesign?: boolean;
  isVenuePage?: boolean;
  openAll?: boolean;
  isSideModal?: boolean;
};

const AccordionGroup = ({
  accordions,
  heading,
  useSchema,
  sliceProps,
  isOpenOverride = true,
  headingNeedsSeparator = false,
  tabData = [],
  findBestSeatsCtaCallback,
  isRevampedDesign,
  isVenuePage,
  isMobile,
  openAll = false,
  isSideModal = false,
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
      <Conditional if={isRevampedDesign}>
        <FaqSection
          faqData={accordions}
          isOpenOverride={isOpenOverride}
          useSchema={useSchema}
          isMobile={isMobile || false}
        />
      </Conditional>

      <Conditional if={!isRevampedDesign}>
        <div>
          <Conditional if={heading}>
            <TitleTextCombo isVenuePage={isVenuePage} noMargin />
            <h2 id={generateSidenavId(heading || '')}>{heading}</h2>
            <Conditional if={headingNeedsSeparator && isMobile}>
              <br />
              <Divider />
            </Conditional>
          </Conditional>
          {accordions.map((accordion, index) => {
            const content = <RichContent render={accordion.content} />;
            return (
              <Accordion
                key={index}
                index={index}
                content={content}
                isOpenOverride={(index == 0 && isOpenOverride) || openAll}
                heading={accordion.heading}
                isGlobalMb={isGlobalMb}
                useSchema={useSchema}
                tabData={tabData}
                isVenuePage={isVenuePage}
                findBestSeatsCtaCallback={findBestSeatsCtaCallback}
                isSideModal={isSideModal}
              />
            );
          })}
        </div>
      </Conditional>

      <Conditional if={useSchema}>
        <FAQPageJsonLd mainEntity={faqSchemaProps} />
      </Conditional>
    </>
  );
};

export default AccordionGroup;
