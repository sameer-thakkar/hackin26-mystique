import React from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from '../../utils/shortCodes';
import { COLORS, GRAPHIK } from '../../constants/ui-constants';
import { stringIdfy } from '../../utils/helper';

const StyledTable = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: auto;
  font-family: ${GRAPHIK.FONT_STACK};
  .heading {
    font-size: 26px;
    font-weight: ${GRAPHIK.SEMIBOLD};
    margin-bottom: 40px;
  }
`;
const StyledRow = styled.div`{
  background: ${COLORS.CHALK};
  &:nth-of-type(2n){
    background: ${COLORS.WHITE};
  }
  display: grid;
  grid-auto-flow: column;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(auto-fit, minmax(2em, 1fr));
  @media(max-width: 768px){
    &:nth-of-type(1){
      display: none;
    }
    grid-template-columns: unset;
    grid-template-rows: repeat(${({ rowCount }) => rowCount}, auto);
  }
`;
const StyledColumn = styled.div`
  display: grid;
  padding: 14px 16px;
  strong {
    font-weight: ${GRAPHIK.HEAVY};
  }
  p {
    margin: 0;
  }
  @media (max-width: 768px) {
    &:nth-of-type(1) {
      display: none;
    }
    &:nth-of-type(${({ colCount }) => colCount + 1}) {
      grid-column: 1 / 3;
      grid-row: 1;
    }
  }
`;

const TableV2 = props => {
  const { rows, title, isMobile } = props;
  const headings = isMobile ? rows[0]?.columns : [];
  return (
    <StyledTable>
      <div className="heading" id={stringIdfy(title)}>
        {title}
      </div>
      {rows.map((row, rowIndex) => {
        if (isMobile && rowIndex === 0) return null;
        const actualColumns = [...headings, ...row.columns];
        return (
          <StyledRow rowCount={headings.length}>
            {actualColumns.map((column, colIndex) => {
              return (
                <StyledColumn colCount={row.columns.length}>
                  <RichText
                    key={colIndex}
                    render={column.content}
                    htmlSerializer={shortCodeSerializer}
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
