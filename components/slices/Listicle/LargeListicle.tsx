import { HALYARD } from 'const/ui-constants';
import React, { useState } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import Tags from 'UI/Tags';
import Image from 'UI/Image';
import Button from 'UI/Button';
import { strings } from 'const/strings';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';

import Pricing from './Pricing';

const StyledLargeListicle = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  padding: 24px;
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 8px;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Title = styled.div`
  display: grid;
  font-size: 21px;
  line-height: 22px;
  margin-bottom: 24px;
  grid-template-columns: 24px auto;
  span {
    margin-left: 12px;
    font-size: 18px;
  }
`;

const StyledNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${COLORS.GRAY.G2};
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
    height: 100%;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    height: 194px;
  }
`;

const TagWrapper = styled.div`
  margin-top: -34px;
  position: absolute;
  margin-left: 10px;
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
  font-weight: 600;
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
  background: ${COLORS.GRAY.G8};
  padding: 16px;
  margin-bottom: 32px;
  div {
    margin-bottom: 8px;
  }
  @media (max-width: 768px) {
    margin-bottom: 5px;
  }
`;

const WTTDTSectionRichText = styled.div`
  ${({ collapsed }) => (collapsed ? `height: 50px;` : '')}
  overflow: hidden;
  color: ${COLORS.GRAY.G2};
  line-height: 22px;
  * {
    margin-top: 0;
  }
`;

const WTTDTToggle = styled.div`
  color: ${COLORS.BRAND.CANDY};
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
    tags,
    summary,
    why_summary,
    why_summary_heading,
    timing_heading,
    show_price,
    read_more_link,
    book_now_link,
  } = primary;
  const finalTags = tags ? tags.split(',') : [];
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
          <TagWrapper>
            <Tags
              tags={finalTags}
              color={COLORS.GRAY.G3}
              backgroundColor={COLORS.GRAY.G7}
            />
          </TagWrapper>
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
              <InfoTitle>{timing_heading || strings.TIMINGS}</InfoTitle>
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
          <div>{why_summary_heading || strings.WHY_TAKE_THIS_DAY_TRIP}</div>
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
              WTTDTCollapsed ? strings.MORE_DETAILS : strings.SHOW_LESS_TEXT
            }`}
          </WTTDTToggle>
        </WTTDTSection>
      ) : null}
      <PriceAndCTASection>
        <div>
          {tourData?.listingPrice && show_price ? (
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
                {strings.READ_MORE}
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
                fillType="fillGradient"
                paddingSides="0px"
              >
                {strings.BOOK_NOW_CTA}
              </BookNow>
            </a>
          ) : null}
        </div>
      </PriceAndCTASection>
    </StyledLargeListicle>
  );
};

export default LargeListicle;
