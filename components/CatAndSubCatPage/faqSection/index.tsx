import React from 'react';
import { FaqSectionProps } from 'components/CatAndSubCatPage/faqSection/interface';
import {
  AccordianContainer,
  FaqContainer,
  SectionHeading,
} from 'components/CatAndSubCatPage/faqSection/styles';
import Accordion from 'components/slices/Accordion';
import RichContent from 'UI/RichContent';
import { SLICE_TYPES } from 'const/index';
import { strings } from 'const/strings';

const FaqSection: React.FC<FaqSectionProps> = (props) => {
  const { faqData, isOpenOverride, useSchema } = props;

  return (
    <FaqContainer>
      <SectionHeading>
        <h2>{strings.SHOW_PAGE.FREQUENTLY_ASKED_QUESTIONS}</h2>
      </SectionHeading>
      <AccordianContainer>
        {faqData.map((accordion, index) => {
          const content = (
            <RichContent
              render={accordion.content}
              parentProps={{
                sectionName: strings.SHOW_PAGE.FREQUENTLY_ASKED_QUESTIONS,
                sliceType: SLICE_TYPES.ACCORDION,
              }}
            />
          );
          return (
            <Accordion
              key={index}
              index={index}
              content={content}
              isOpenOverride={index == 0 && isOpenOverride}
              heading={accordion.heading}
              useSchema={useSchema}
              isCatOrSubCatPage={true}
            />
          );
        })}
      </AccordianContainer>
    </FaqContainer>
  );
};

export default FaqSection;
