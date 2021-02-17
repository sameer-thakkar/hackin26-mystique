import { SOLEIL, COLORS } from 'constants/ui-constants';
import {
  DATE_FORMAT_TYPES,
  DISCOUNTED_FUTURE_IMAGES_SECTION,
} from 'constants/index';

import { strings } from 'const/strings';
import Accordion from 'components/slices/Accordion';
import styled from 'styled-components';
import React, { useContext } from 'react';
import { MBContext } from 'contexts/MBContext';
import dayjs from 'dayjs';
import useLocalisedDate from 'hooks/useLocalisedDate';

import Image from './Image';
import IconCard from './IconCard';

const PitchGrid = styled.div`
  display: grid;
  grid-row-gap: 44px;
`;

const Section = styled.div`
  display: grid;
  grid-row-gap: 32px;
  .description {
    color: ${COLORS.TWO_BLACK};
  }
`;

const Heading = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  max-width: 65%;
  @media (max-width: 768px) {
    max-width: 100%;
    &.main-heading {
      max-width: 65%;
    }
  }
`;

const Text = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  color: ${COLORS.GREY_G3};
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  max-width: 65%;
`;

const Pitch = styled.div`
  display: grid;
  grid-row-gap: 12px;
  background-image: url('https://cdn-imgix-open.headout.com/sites/assets/travellers.svg');
  background-size: auto;
  background-repeat: no-repeat;
  background-position: right;
  ${Heading}, ${Text} {
    color: ${COLORS.TWO_BLACK};
  }
`;

const NumberCardWrap = styled.div`
  counter-reset: num;
  display: grid;
  grid-row-gap: 24px;
`;
const NumberCard = styled.div`
  display: grid;
  grid-template-columns: 24px auto;
  grid-column-gap: 16px;
  grid-row-gap: 8px;
  ${Text} {
    max-width: unset;
    color: ${COLORS.TWO_BLACK};
  }
  &:before {
    grid-row: 1 / 3;
    font-family: ${SOLEIL.FONT_STACK};
    counter-increment: num;
    content: counter(num);
    font-size: 16px;
    line-height: 24px;
    width: 24px;
    font-weight: 600;
    border-radius: 100%;
    display: flex;
    align-self: start;
    align-items: center;
    justify-content: center;
    background: ${COLORS.YOUNG_ORANGE};
  }
`;

const EmphasizedText = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: auto auto auto;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 2px;
  }
`;

const FAQGrid = styled.div`
  display: grid;
  grid-row-gap: 16px;
  margin-bottom: 32px;
  & > div {
    padding: 0;
    padding-bottom: 12px;
    margin-right: 0;
  }
  .answer {
    color: ${COLORS.TWO_BLACK};
  }
  ul {
    padding-left: 1em;
  }
`;
const replaceSuperBrand = (text, name, domain) =>
  text?.replace(/<mbName>/g, name).replace(/<domain>/g, domain) || '';

const getDFFAQs = (lang, name, domain) => {
  return Object.values(strings.DISCOUNTED_FUTURES.FAQ_QUESTIONS).map(
    ({ QUESTION, ANSWER }, i) => {
      const finalAnswer =
        typeof ANSWER === 'string' ? (
          replaceSuperBrand(ANSWER, name, domain)
        ) : (
          <ul>
            {ANSWER.map((answerLi, j) => (
              <li key={j}>{replaceSuperBrand(answerLi, name, domain)}</li>
            ))}
          </ul>
        );
      return (
        <Accordion
          key={i}
          heading={replaceSuperBrand(QUESTION, name, domain)}
          content={finalAnswer}
        />
      );
    }
  );
};
const DiscountedFuturesPitch = ({ dfExpiryDate = '' }) => {
  const { lang, nakedDomain } = useContext(MBContext);
  const startDate = useLocalisedDate(
    dayjs().add(30, 'day'),
    DATE_FORMAT_TYPES.FULL
  );
  const [name, ..._tld] = nakedDomain.replace(/-/g, ' ').split('.');

  return (
    <PitchGrid>
      <Section>
        <Pitch>
          <Heading className={'main-heading'}>
            {strings.DISCOUNTED_FUTURES.HEADING}
          </Heading>
          <Text>
            {/* <ReactMarkdown
              source={strings.DISCOUNTED_FUTURES.DESCRIPTION.replace(
                '<date>',
                dfExpiryDate
              )}
              renderers={{ paragraph: React.Fragment }}
              escapeHtml={false}
            /> */}
          </Text>
        </Pitch>
      </Section>
      <Section>
        <IconCard
          title={strings.DISCOUNTED_FUTURES.PITCH.GO_ANYTIME.HEADING}
          colorScheme={{ background: '#FFF8EF', color: COLORS.FOUR_BLACK }}
          description={strings.DISCOUNTED_FUTURES.PITCH.GO_ANYTIME.SUB_TEXT.replace(
            '<date>',
            dfExpiryDate
          )}
          icon={'https://cdn-imgix-open.headout.com/emails/assets/rocket.gif'}
        />
        <IconCard
          title={strings.DISCOUNTED_FUTURES.PITCH.SAVE_MONEY.HEADING}
          colorScheme={{ background: '#F2FDEB', color: COLORS.FOUR_BLACK }}
          description={strings.DISCOUNTED_FUTURES.PITCH.SAVE_MONEY.SUB_TEXT}
          icon={'https://cdn-imgix-open.headout.com/emails/assets/money.gif'}
        />
        <IconCard
          title={strings.DISCOUNTED_FUTURES.PITCH.BUCKET_LIST.HEADING}
          colorScheme={{ background: '#F8F6FF', color: COLORS.FOUR_BLACK }}
          description={strings.DISCOUNTED_FUTURES.PITCH.BUCKET_LIST.SUB_TEXT}
          icon={'https://cdn-imgix-open.headout.com/emails/assets/check.gif'}
        />
      </Section>
      <Section>
        <Heading>{strings.DISCOUNTED_FUTURES.HEADING_WORKS}</Heading>
        <NumberCardWrap>
          {Object.values(strings.DISCOUNTED_FUTURES.HOW_IT_WORKS).map(
            ({ HEADING, SUB_TEXT }, index) => {
              return (
                <NumberCard key={index}>
                  <EmphasizedText>{HEADING}</EmphasizedText>
                  <Text>
                    {replaceSuperBrand(
                      SUB_TEXT.replace('<date>', dfExpiryDate).replace(
                        '<cooldownDate>',
                        startDate
                      ),
                      name,
                      nakedDomain
                    )}
                  </Text>
                </NumberCard>
              );
            }
          )}
        </NumberCardWrap>
      </Section>
      <Section>
        <Heading>{strings.DISCOUNTED_FUTURES.IMAGES_SECTION.HEADING}</Heading>
        <ImageGrid>
          {Object.values(DISCOUNTED_FUTURE_IMAGES_SECTION).map((url, i) => (
            <Image key={i} url={url} aspectRatio={'0.8'} />
          ))}
        </ImageGrid>
      </Section>
      <Section>
        <Heading>{"FAQ's"}</Heading>
        <FAQGrid>{getDFFAQs(lang, name, nakedDomain)}</FAQGrid>
      </Section>
    </PitchGrid>
  );
};

export default DiscountedFuturesPitch;
