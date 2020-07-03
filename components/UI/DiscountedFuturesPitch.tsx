import IconCard from './IconCard';
import styled from 'styled-components';
import Accordion from 'components/slices/Accordion';
import Image from './Image';
import * as labels from 'constants/localization/labels';
import { SOLEIL, COLORS } from 'constants/ui-constants';
import { DISCOUNTED_FUTURE_IMAGES_SECTION } from 'constants/index';
import { useContext } from 'react';
import { MBContext } from 'contexts/MBContext';

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
  background-size: contain;
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
  font-family: ${SOLEIL.FONT_STACK}
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
const getDFFAQs = (lang) => {
  return Object.values(labels[lang].DISCOUNTED_FUTURES.FAQ_QUESTIONS).map(
    ({ QUESTION, ANSWER }, i) => {
      const finalAnswer =
        typeof ANSWER === 'string' ? (
          ANSWER
        ) : (
          <ul>
            {ANSWER.map((answerLi, j) => (
              <li key={j}>{answerLi}</li>
            ))}
          </ul>
        );
      return <Accordion key={i} heading={QUESTION} content={finalAnswer} />;
    }
  );
};
const DiscountedFuturesPitch = ({ dfExpiryDate = '' }) => {
  const { lang } = useContext(MBContext);

  return (
    <PitchGrid>
      <Section>
        <Pitch>
          <Heading>{labels[lang].DISCOUNTED_FUTURES.HEADING}</Heading>
          <Text>
            {labels[lang].DISCOUNTED_FUTURES.DESCRIPTION.replace(
              '<date>',
              dfExpiryDate
            )}
          </Text>
        </Pitch>
      </Section>
      <Section>
        <IconCard
          title={labels[lang].DISCOUNTED_FUTURES.PITCH.GO_ANYTIME.HEADING}
          colorScheme={{ background: '#FFF8EF', color: COLORS.FOUR_BLACK }}
          description={labels[
            lang
          ].DISCOUNTED_FUTURES.PITCH.GO_ANYTIME.SUB_TEXT.replace(
            '<date>',
            dfExpiryDate
          )}
          icon={'https://cdn-imgix-open.headout.com/emails/assets/rocket.gif'}
        />
        <IconCard
          title={labels[lang].DISCOUNTED_FUTURES.PITCH.SAVE_MONEY.HEADING}
          colorScheme={{ background: '#F2FDEB', color: COLORS.FOUR_BLACK }}
          description={
            labels[lang].DISCOUNTED_FUTURES.PITCH.SAVE_MONEY.SUB_TEXT
          }
          icon={'https://cdn-imgix-open.headout.com/emails/assets/money.gif'}
        />
        <IconCard
          title={labels[lang].DISCOUNTED_FUTURES.PITCH.BUCKET_LIST.HEADING}
          colorScheme={{ background: '#F8F6FF', color: COLORS.FOUR_BLACK }}
          description={
            labels[lang].DISCOUNTED_FUTURES.PITCH.BUCKET_LIST.SUB_TEXT
          }
          icon={'https://cdn-imgix-open.headout.com/emails/assets/check.gif'}
        />
      </Section>
      <Section>
        <Heading>{labels[lang].DISCOUNTED_FUTURES.HEADING_WORKS}</Heading>
        <NumberCardWrap>
          {Object.values(labels[lang].DISCOUNTED_FUTURES.HOW_IT_WORKS).map(
            ({ HEADING, SUB_TEXT }, index) => {
              return (
                <NumberCard key={index}>
                  <EmphasizedText>{HEADING}</EmphasizedText>
                  <Text>{SUB_TEXT.replace('<date>', dfExpiryDate)}</Text>
                </NumberCard>
              );
            }
          )}
        </NumberCardWrap>
      </Section>
      <Section>
        <Heading>
          {labels[lang].DISCOUNTED_FUTURES.IMAGES_SECTION.HEADING}
        </Heading>
        <ImageGrid>
          {Object.values(DISCOUNTED_FUTURE_IMAGES_SECTION).map((url, i) => (
            <Image key={i} url={url} aspectRatio={'0.8'} />
          ))}
        </ImageGrid>
      </Section>
      <Section>
        <Heading>{"FAQ's"}</Heading>
        <FAQGrid>{getDFFAQs(lang)}</FAQGrid>
      </Section>
    </PitchGrid>
  );
};

export default DiscountedFuturesPitch;
