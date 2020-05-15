import React, { useState } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import Image from 'UI/Image';
import Button from 'UI/Button';
import Pricing from './Pricing';
import * as labels from 'constants/localization/labels';
import { COLORS, SOLEIL } from 'constants/ui-constants';
import { shortCodeSerializer } from 'utils/shortCodes';

const StyledLargeListicle = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  padding: 24px;
  border: 1px solid ${COLORS.GREY_G6};
  border-radius: 8px;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Title = styled.div`
  display: flex;
  font-size: 21px;
  line-height: 22px;
  margin-bottom: 24px;
  span {
    margin-left: 12px;
  }
`;

const StyledNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${COLORS.DAVY_GREY};
  color: white;
  line-height: 22px;
  font-size: 16px;
  text-align: center;
`;

const ImageWrapper = styled.div`
  height: 401px;
  margin-bottom: 16px;
  img {
    width: 100%;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    height: 194px;
  }
`;

const Paragraph = styled.div`
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
  margin-bottom: 32px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoTitle = styled.div`
  font-weight: ${SOLEIL.SEMIBOLD};
  line-height: 20px;
  margin-bottom: 8px;
`;

const InfoTimings = styled.table`
  width: 100%;
  tr {
    td {
      :last-child {
        text-align: center;
      }
    }
  }
`;

const WTTDTSection = styled.div`
  background: ${COLORS.GREY.G8};
  padding: 16px;
  margin-bottom: 32px;
  div {
    margin-bottom: 8px;
  }
`;

const WTTDTSectionRichText = styled.div`
  ${({ collapsed }) => (collapsed ? `height: 50px;` : '')}
  overflow: hidden;
  color: ${COLORS.DAVY_GREY};
  line-height: 22px;
  * {
    margin-top: 0;
  }
`;

const WTTDTToggle = styled.div`
  color: ${COLORS.HEADOUT_CANDY};
  cursor: pointer;
`;

const PriceAndCTASection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ReadMore = styled(Button)`
  width: ${({ fullWidth }) => (fullWidth ? '100%;' : '42%; margin-right: 8px')};
`;

const BookNow = styled(Button)`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '55%')};
`;

type LargeListicleProps = {
  index: number;
  primary: any;
  items: any[];
  currentLanguage: string;
  tourData: any;
};

const LargeListicle: React.FC<LargeListicleProps> = ({
  index,
  primary,
  items,
  currentLanguage,
  tourData,
}) => {
  const {
    title,
    summary,
    why_summary,
    show_price,
    read_more_link,
    book_now_link,
  } = primary;
  const [WTTDTCollapsed, setWTTDTCollapsed] = useState(true);

  const infoItems = items.reduce((acc, { info_title, info_description }) => {
    if (info_title) {
      return [
        ...acc,
        { infoTitle: info_title, infoDescription: info_description },
      ];
    }
    return acc;
  }, []);

  const timingsList = items.reduce(
    (acc, { timings_left_column, timings_right_column }) => {
      if (timings_left_column && timings_right_column) {
        return [
          ...acc,
          {
            leftColumn: timings_left_column,
            rightColumn: timings_right_column,
          },
        ];
      }
      return acc;
    },
    []
  );

  const image = {
    url: items[0]?.image?.url || tourData?.imageUploads[0]?.url,
    alt: items[0]?.image?.alt || tourData?.imageUploads[0]?.alt,
  };

  return (
    <StyledLargeListicle>
      <Title>
        <StyledNumber>{index + 1}</StyledNumber>
        <span>{title || tourData?.name}</span>
      </Title>
      {image.url ? (
        <ImageWrapper>
          <Image
            url={image.url}
            alt={image.alt || 'Product Image'}
            height={401}
          />
        </ImageWrapper>
      ) : null}
      {RichText.asText(summary).length > 0 ? (
        <Paragraph>
          <RichText render={summary} htmlSerializer={shortCodeSerializer} />
        </Paragraph>
      ) : null}
      {infoItems.length > 0 ? (
        <InfoGrid>
          {infoItems.map(({ infoTitle, infoDescription }, index) => {
            return (
              <div key={index}>
                <InfoTitle>{infoTitle}</InfoTitle>
                <RichText
                  render={infoDescription}
                  htmlSerializer={shortCodeSerializer}
                />
              </div>
            );
          })}
          {timingsList.length > 0 ? (
            <div>
              <InfoTitle>{labels[currentLanguage].TIMINGS}</InfoTitle>
              <InfoTimings>
                {timingsList.map((timing, index) => {
                  return (
                    <tr key={index}>
                      <td>{timing.leftColumn}</td>
                      <td>:</td>
                      <td>{timing.rightColumn}</td>
                    </tr>
                  );
                })}
              </InfoTimings>
            </div>
          ) : null}
        </InfoGrid>
      ) : null}
      {RichText.asText(why_summary).length > 0 ? (
        <WTTDTSection>
          <div>{labels[currentLanguage].WHY_TAKE_THIS_DAY_TRIP}</div>
          <WTTDTSectionRichText collapsed={WTTDTCollapsed}>
            <RichText
              render={why_summary}
              htmlSerializer={shortCodeSerializer}
            />
          </WTTDTSectionRichText>
          <WTTDTToggle
            onClick={() => setWTTDTCollapsed((c) => !c)}
            role="button"
            tabIndex={0}
          >
            {` ${
              WTTDTCollapsed
                ? labels[currentLanguage].MORE_DETAILS
                : labels[currentLanguage].SHOW_LESS_TEXT
            }`}
          </WTTDTToggle>
        </WTTDTSection>
      ) : null}
      <PriceAndCTASection>
        <div>
          {tourData && show_price ? (
            <Pricing
              currentLanguage={currentLanguage}
              listingPrice={tourData.listingPrice}
            />
          ) : null}
        </div>
        <div>
          {read_more_link?.url ? (
            <a
              href={read_more_link.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ReadMore fullWidth={!book_now_link?.url} paddingSides="0px">
                {labels[currentLanguage].READ_MORE}
              </ReadMore>
            </a>
          ) : null}
          {book_now_link?.url ? (
            <a
              href={book_now_link.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <BookNow
                fullWidth={!read_more_link?.url}
                type="fillGradient"
                paddingSides="0px"
              >
                {labels[currentLanguage].BOOK_NOW_CTA}
              </BookNow>
            </a>
          ) : null}
        </div>
      </PriceAndCTASection>
    </StyledLargeListicle>
  );
};

export default LargeListicle;
