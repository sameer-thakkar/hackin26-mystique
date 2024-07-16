import React from 'react';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import { generateSidenavId } from 'utils/helper';
import COLORS from 'const/colors';
import { SLICE_TYPES } from 'const/index';
import { HALYARD } from 'const/ui-constants';
import { stringIdfy } from '../../utils/helper';
import { shortCodeSerializerWithParentProps } from '../../utils/shortCodes';
import RichContent from '../UI/RichContent';
import TitleTextCombo from '../UI/TitleTextCombo';

const StyledTable = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: auto;
  font-family: ${HALYARD.FONT_STACK};
  .heading {
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 40px;
  }
  @media (max-width: 768px) {
    .heading {
      margin-bottom: 0;
    }
    grid-gap: 24px;
  }
`;
const StyledRow = styled.div`
  background: ${COLORS.BRAND.WHITE};
  &:nth-of-type(2n) {
    background: ${COLORS.GRAY.G8};
    color: ${COLORS.GRAY.G2};
  }
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(auto-fit, minmax(2em, 1fr));
  @media (max-width: 768px) {
    &:nth-of-type(1) {
      display: none;
    }
    grid-template-columns: unset;
    grid-template-rows: repeat(
      ${({
        // @ts-expect-error TS(2339): Property 'rowCount' does not exist on type 'Pick<D... Remove this comment to see the full error message
        rowCount,
      }) => rowCount},
      auto
    );
    margin-top: 0;
  }
`;
const StyledColumn = styled.div`
  display: grid;
  padding: 14px 16px;
  strong {
    font-weight: 500;
  }
  p {
    margin: 0;
  }
  @media (max-width: 768px) {
    &:nth-of-type(1) {
      display: none;
    }
    background: ${COLORS.BRAND.WHITE};
    &:nth-of-type(2n) {
      background: ${COLORS.GRAY.G8};
    }
    &:nth-of-type(
        ${({
            // @ts-expect-error TS(2339): Property 'colCount' does not exist on type 'Pick<D... Remove this comment to see the full error message
            colCount,
          }) => colCount + 1}
      ) {
      grid-column: 1 / 3;
      grid-row: 1;
      font-size: 18px;
      padding-left: 0;
      padding-top: 0;
      background: ${COLORS.BRAND.WHITE};
      font-weight: 500;
    }
  }
`;

/**
 *
 *
 * A table on prismic, is a mix of two `slice types`.
 *
 * Steps to create a table.
 *
 * **Step 1:** We mark the beginning of a table by adding a `Table Start` slice. (additionally you can add a heading for your table here.)
 *
 * **Step 2:** Add any number of `Table Row` slices as required. (`Table Row` slice also controls number of columns in each row, can be left blank to skip a column)
 *
 * **Step 3:** Close the Table by adding the `Table End` slice
 *
 * > PS: On Mobile, The First Row gets transformed as First column, and first column becomes the heading for each row.[Use the canvas tab to visualize this.]
 */

const TableV2 = (props: any) => {
  const { rows, title, isMobile, description } = props;
  const headings = isMobile ? rows[0]?.columns : [];
  return (
    <StyledTable>
      <TitleTextCombo id={stringIdfy(title)}>
        <h2 id={generateSidenavId(title)}>{title}</h2>
        {description ? (
          <RichContent
            render={description}
            parentProps={{
              sectionName: title,
              sliceType: SLICE_TYPES.TABLE,
            }}
          />
        ) : null}
      </TitleTextCombo>
      {rows.map((row: any, rowIndex: number) => {
        if (isMobile && rowIndex === 0) return null;
        const actualColumns = [...headings, ...row.columns];
        return (
          // @ts-expect-error TS(2769): No overload matches this call.
          <StyledRow rowCount={headings.length} key={rowIndex}>
            {actualColumns.map((column, colIndex) => {
              return (
                // @ts-expect-error TS(2769): No overload matches this call.
                <StyledColumn colCount={row.columns.length} key={colIndex}>
                  <PrismicRichText
                    key={colIndex}
                    field={column.content}
                    components={(...defaultArgs: any) =>
                      shortCodeSerializerWithParentProps(defaultArgs, {
                        sectionName: title,
                        sliceType: SLICE_TYPES.TABLE,
                      })
                    }
                  />
                </StyledColumn>
              );
            })}
          </StyledRow>
        );
      })}
    </StyledTable>
  );
};

export default TableV2;
