import React from 'react';
import styled from 'styled-components';
import Image from 'UI/Image';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';

const StyledSmallListicle = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  width: 305px !important;
  padding: 16px 16px 24px 16px;
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 8px;
  display: grid;
  grid-column-gap: 16px;
  grid-template-columns: 131px auto;
  grid-template-areas: 'image title' 'seating-chart seating-chart' 'links links';
`;

const ProductImage = styled.div`
  grid-area: image;
  width: 131px !important;
  height: 82px;
  img {
    width: 100%;
    object-fit: cover;
  }
`;

const Title = styled.div`
  grid-area: title;
`;

const ShowText = styled.div`
  color: ${COLORS.BRAND.PURPS};
  font-size: 10px;
  line-height: 10px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const TheatreText = styled.div`
  margin-top: 8px;
  font-size: 20px;
  line-height: 22px;
`;

const SeatingChartImage = styled.div`
  grid-area: seating-chart;
  width: 305px;
  height: 191px;
  margin: 16px 0 8px 0;
  img {
    object-fit: cover;
    width: 100%;
  }
`;

const Links = styled.div`
  grid-area: links;
  a {
    font-size: 12px;
    line-height: 22px;
    color: ${COLORS.BRAND.CANDY};
    margin-bottom: 4px;
    :last-child {
      margin-top: -4px;
    }
  }
`;

type SmallListicleProps = {
  primary: any;
  items: any[];
  currentLanguage?: string;
  tourData: any;
};

const SmallListicle: React.FC<SmallListicleProps> = ({
  primary,
  items,
  tourData,
}) => {
  const {
    title,
    theatre_name,
    book_now_link,
    seating_chart_link,
    seating_chart_image,
    seating_chart_image_url,
    seating_chart_image_alt,
  } = primary;

  const productImage = {
    url: items[0]?.image.url || tourData?.imageUploads[0]?.url,
    alt: items[0]?.image.alt || tourData?.imageUploads[0]?.alt,
  };

  const seatingChartImage = {
    url: seating_chart_image_url?.url || seating_chart_image?.url,
    alt: seating_chart_image_alt || seating_chart_image?.alt || 'Seating Chart',
  };

  return (
    <StyledSmallListicle>
      {productImage.url ? (
        <ProductImage>
          <Image
            url={productImage.url}
            alt={productImage.alt}
            width={131}
            height={82}
          ></Image>
        </ProductImage>
      ) : null}
      <Title>
        <ShowText>{title || tourData?.name}</ShowText>
        <TheatreText>{theatre_name}</TheatreText>
      </Title>
      <SeatingChartImage>
        <Image
          url={seatingChartImage.url}
          alt={seatingChartImage.alt}
          height={191}
          width={305}
        />
      </SeatingChartImage>
      {seating_chart_link?.url || book_now_link?.url ? (
        <Links>
          {seating_chart_link?.url ? (
            <a
              href={seating_chart_link.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {strings.LISTICLES.SEATING_CHART}
            </a>
          ) : null}
          <br />
          {book_now_link?.url ? (
            <a
              href={book_now_link.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {strings.BOOK_NOW_CTA}
            </a>
          ) : null}
        </Links>
      ) : null}
    </StyledSmallListicle>
  );
};

export default SmallListicle;
