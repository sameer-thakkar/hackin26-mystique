import React, { Component } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import styled from 'styled-components';
import { generateSidenavId } from 'utils/helper';
import { shortCodeSerializer } from '../../utils/shortCodes';

const StyledTableV1 = styled.div`
  .description-table {
    table-layout: fixed;
    width: 100%;
    border: 1px solid #444444;
    border-spacing: 0;
  }

  .description-table td {
    width: auto;
    height: auto;
    max-width: 100%;
    word-break: break-word;
    padding: 0px 10px;
    border: 1px solid #444444;
    vertical-align: baseline;
  }

  @media (max-width: 768px) {
    overflow: auto;
    .description-table {
      table-layout: auto;
    }
    .description-table td {
      word-break: unset;
    }
  }
`;
export default class Table extends Component<any, any> {
  subArrays = (arr: any) => {
    const { numberOfColumns } = this.props;
    const perChunk = numberOfColumns;
    const result = arr.reduce((resultArray: any, item: any, index: number) => {
      const chunkIndex = Math.floor(index / perChunk);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);
    return result;
  };
  render() {
    const { title, columnsData } = this.props;
    const tableColumns = this.subArrays(columnsData);
    return (
      <StyledTableV1>
        <h2 id={generateSidenavId(title)}>{title}</h2>
        <table className="description-table">
          <tbody>
            {tableColumns.map((column: any, index: number) => {
              return (
                <tr key={index}>
                  {column.map((item: any, index: number) => (
                    <td key={index}>
                      <RichText
                        render={item.column}
                        htmlSerializer={shortCodeSerializer}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </StyledTableV1>
    );
  }
}
