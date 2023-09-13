import React, { useLayoutEffect, useState } from 'react';
import Conditional from 'components/common/Conditional';
import { ITableV3Props } from 'components/slices/TableV3/interfaces';
import {
  BoosterBackgroundWrapper,
  BoosterTextColumnWrapper,
  BoosterTextWrapper,
  DiscountTextWrapper,
  FinalPrice,
  FinalPriceBoosterWrapper,
  ImageContentWrapper,
  ImageSubTextContentWrapper,
  ImageTextColumnWrapper,
  ImageTextContentWrapper,
  ImageTextSubTextColumnWrapper,
  ImageTextWrapper,
  ImageWrapper,
  LinkSvgIconWrapper,
  NumericImageText,
  NumericImageTextWrapper,
  NumericSubNumericWrapper,
  NumericText,
  NumericTextWrapper,
  NumericWrapper,
  ScratchPrice,
  ScratchPriceWrapper,
  StyledColumn,
  StyledRow,
  StyledTable,
  StyledTableWrapper,
  SubNumericWrapper,
  SubTextWrapper,
  TextBoldWrapper,
  TextOnlyWrapper,
  TextWrapper,
} from 'components/slices/TableV3/styles';
import Image from 'UI/Image';
import TitleTextCombo from 'UI/TitleTextCombo';
import { stringIdfy } from 'utils/helper';
import {
  BOOSTER_BACKGROUND_COLOR_CODE_MAPPING,
  TABLE_V3_COLUMN_TYPE,
  TABLE_V3_SVG_ICONS,
  TABLE_V3_SVG_MAPPING,
  TABLE_V3_TEXT_TYPE,
} from 'const/index';

export const getMaxWidth = (column: number) => {
  switch (column) {
    case 2:
      return { mweb: 50, desktop: 35 };
    case 3:
      return { mweb: 100, desktop: 55 };
    case 4:
    case 5:
      return { mweb: 100, desktop: 75 };
    default:
      return { mweb: 100, desktop: 100 };
  }
};

const TableV3 = ({
  title,
  slices,
  displaySerialNum,
  serialNumHeading,
}: ITableV3Props) => {
  const [width, setWidth] = useState(0);
  const columns = slices?.length + (displaySerialNum ? 1 : 0);

  let tableData: Array<Array<any>> = [];

  let maxRows = slices[0]?.items?.length;
  slices?.forEach((item) => (maxRows = Math.max(maxRows, item?.items?.length)));

  for (let i = 0; i < maxRows; i++) {
    slices.forEach((item) => {
      if (!tableData[i]) {
        tableData[i] = [item?.items[i]];
      } else {
        tableData[i] = tableData[i].concat(item?.items[i]);
      }
    });
  }

  tableData = [slices.map((item) => item?.primary)].concat(tableData);

  // If from prismic we have chosen to display the serial numbering, then in that case add one more column for that
  if (displaySerialNum) {
    tableData?.forEach((item, index) => {
      if (index === 0) item.unshift(serialNumHeading);
      else item.unshift(index);
    });
  }

  const getColumnData = ({
    columnData,
    colIndex,
  }: {
    columnData: Record<any, any>;
    colIndex: number;
  }) => {
    const requiredColumn = tableData[0][colIndex];
    const { text_type } = requiredColumn || {};
    const {
      text,
      booster_text,
      primary_number_text,
      sub_primary_number_text,
      link_url,
      link_text,
      image_alt_text,
      image_link,
      booster_background_color,
      scratched_price,
      final_price,
      text_on_right,
      sub_text,
      svg_icon,
    } = columnData || {};
    const { url } = link_url || {};
    const { url: imageUrl } = image_link || {};

    switch (requiredColumn?.column_type) {
      case TABLE_V3_COLUMN_TYPE.TEXT_ONLY:
        return (
          <TextOnlyWrapper>
            <Conditional if={text_type === TABLE_V3_TEXT_TYPE.TEXT}>
              <TextWrapper>
                <div>{text}</div>
              </TextWrapper>
            </Conditional>

            <Conditional if={text_type === TABLE_V3_TEXT_TYPE.SUB_TEXT}>
              <SubTextWrapper>
                <div>{text}</div>
              </SubTextWrapper>
            </Conditional>

            <Conditional if={text_type === TABLE_V3_TEXT_TYPE.TEXT_BOLD}>
              <TextBoldWrapper>
                <div>{text}</div>
              </TextBoldWrapper>
            </Conditional>
          </TextOnlyWrapper>
        );

      case TABLE_V3_COLUMN_TYPE.BOOSTER_TEXT: {
        const background =
          // @ts-expect-error TS(2339)
          BOOSTER_BACKGROUND_COLOR_CODE_MAPPING[booster_background_color];
        return (
          <BoosterTextColumnWrapper>
            <BoosterTextWrapper>{text}</BoosterTextWrapper>
            <BoosterBackgroundWrapper background={background}>
              {booster_text}
            </BoosterBackgroundWrapper>
          </BoosterTextColumnWrapper>
        );
      }

      case TABLE_V3_COLUMN_TYPE.LINK_ICON:
        return (
          <LinkSvgIconWrapper>
            <Conditional if={svg_icon === TABLE_V3_SVG_ICONS.PLUS}>
              <div>{TABLE_V3_SVG_MAPPING[svg_icon]}</div>
            </Conditional>
            <div>
              <a href={url} rel="nofollow noreferrer" target="_blank">
                {link_text}
              </a>
            </div>
            <Conditional if={svg_icon === TABLE_V3_SVG_ICONS.EXTERNAL_LINK}>
              <div>{TABLE_V3_SVG_MAPPING[svg_icon]}</div>
            </Conditional>
          </LinkSvgIconWrapper>
        );

      case TABLE_V3_COLUMN_TYPE.SCRATCH_PRICE:
        return (
          <ScratchPriceWrapper>
            <ScratchPrice>{scratched_price}</ScratchPrice>
            <FinalPriceBoosterWrapper>
              <FinalPrice>{final_price}</FinalPrice>
              <DiscountTextWrapper>{booster_text}</DiscountTextWrapper>
            </FinalPriceBoosterWrapper>
          </ScratchPriceWrapper>
        );

      case TABLE_V3_COLUMN_TYPE.NUMERIC_SUB_NUMERIC:
        return (
          <NumericSubNumericWrapper>
            <NumericWrapper>{primary_number_text}</NumericWrapper>
            <SubNumericWrapper>{sub_primary_number_text}</SubNumericWrapper>
          </NumericSubNumericWrapper>
        );

      case TABLE_V3_COLUMN_TYPE.IMAGE_TEXT:
        return (
          <ImageTextColumnWrapper>
            <Conditional if={text_on_right}>
              <Conditional if={imageUrl}>
                <ImageWrapper>
                  <Image url={imageUrl} alt={image_alt_text} fill={true} />
                </ImageWrapper>
              </Conditional>
              <Conditional if={svg_icon}>
                <div>{TABLE_V3_SVG_MAPPING[svg_icon]}</div>
              </Conditional>
            </Conditional>

            <ImageTextWrapper>{text}</ImageTextWrapper>

            <Conditional if={!text_on_right}>
              <Conditional if={imageUrl}>
                <ImageWrapper>
                  <Image url={imageUrl} alt={image_alt_text} fill={true} />
                </ImageWrapper>
              </Conditional>
              <Conditional if={svg_icon}>
                <div>{TABLE_V3_SVG_MAPPING[svg_icon]}</div>
              </Conditional>
            </Conditional>
          </ImageTextColumnWrapper>
        );

      case TABLE_V3_COLUMN_TYPE.IMAGE_TEXT_SUBTEXT:
        return (
          <ImageTextSubTextColumnWrapper>
            <Conditional if={text_on_right}>
              <Conditional if={imageUrl}>
                <ImageWrapper>
                  <Image url={imageUrl} alt={image_alt_text} fill={true} />
                </ImageWrapper>
              </Conditional>
              <Conditional if={svg_icon}>
                <div>{TABLE_V3_SVG_MAPPING[svg_icon]}</div>
              </Conditional>
            </Conditional>

            <ImageContentWrapper>
              <ImageTextContentWrapper>{text}</ImageTextContentWrapper>
              <ImageSubTextContentWrapper>
                {sub_text}
              </ImageSubTextContentWrapper>
            </ImageContentWrapper>

            <Conditional if={!text_on_right}>
              <Conditional if={imageUrl}>
                <ImageWrapper>
                  <Image url={imageUrl} alt={image_alt_text} fill={true} />
                </ImageWrapper>
              </Conditional>
              <Conditional if={svg_icon}>
                <div>{TABLE_V3_SVG_MAPPING[svg_icon]}</div>
              </Conditional>
            </Conditional>
          </ImageTextSubTextColumnWrapper>
        );

      case TABLE_V3_COLUMN_TYPE.NUMERIC_IMAGE_TEXT:
        return (
          <NumericImageTextWrapper>
            <NumericWrapper>{primary_number_text}</NumericWrapper>
            <Conditional if={imageUrl}>
              <ImageWrapper>
                <Image url={imageUrl} alt={image_alt_text} fill={true} />
              </ImageWrapper>
            </Conditional>
            <Conditional if={svg_icon}>
              <div>{TABLE_V3_SVG_MAPPING[svg_icon]}</div>
            </Conditional>

            <NumericImageText>{text}</NumericImageText>
          </NumericImageTextWrapper>
        );

      case TABLE_V3_COLUMN_TYPE.NUMERIC_TEXT:
        return (
          <NumericTextWrapper>
            <NumericWrapper>{primary_number_text}</NumericWrapper>
            <NumericText>{text}</NumericText>
          </NumericTextWrapper>
        );

      default:
        return '';
    }
  };

  useLayoutEffect(() => {
    const colIndexWidth = document.querySelector(
      `.${stringIdfy(title)}-serial-num`
    )?.clientWidth;
    if (colIndexWidth) setWidth(colIndexWidth - 16);
  }, []);

  return (
    <>
      <TitleTextCombo>
        <h2>{title}</h2>
      </TitleTextCombo>

      <StyledTableWrapper className="table-wrapper">
        <StyledTable columns={columns}>
          {tableData?.map((row: Array<any>, rowIndex: number) => {
            return (
              <StyledRow
                key={rowIndex}
                cols={columns}
                displaySerialNum={displaySerialNum}
                className={rowIndex === 0 ? 'table-heading' : ''}
              >
                {row.map((item, colIndex: number) => {
                  return (
                    <StyledColumn
                      key={colIndex}
                      isSerialNum={
                        colIndex === 0 && displaySerialNum && rowIndex > 0
                      }
                      // @ts-expect-error TS(2339)
                      width={
                        colIndex === 0 &&
                        rowIndex !== 0 &&
                        displaySerialNum &&
                        width
                      }
                      className={
                        rowIndex === 0 && colIndex === 0 && displaySerialNum
                          ? `${stringIdfy(title)}-serial-num table-heading-data`
                          : rowIndex === 0 && colIndex >= 0
                          ? 'table-heading-data'
                          : ''
                      }
                    >
                      <Conditional if={colIndex === 0 && displaySerialNum}>
                        {item}
                      </Conditional>
                      <Conditional if={rowIndex === 0 && colIndex > 0}>
                        {item?.column_heading}
                      </Conditional>
                      <Conditional
                        if={
                          rowIndex === 0 && colIndex === 0 && !displaySerialNum
                        }
                      >
                        {item?.column_heading}
                      </Conditional>
                      <Conditional if={rowIndex !== 0 && colIndex >= 0}>
                        {getColumnData({ columnData: item, colIndex })}
                      </Conditional>
                    </StyledColumn>
                  );
                })}
              </StyledRow>
            );
          })}
        </StyledTable>
      </StyledTableWrapper>
    </>
  );
};

export default TableV3;
