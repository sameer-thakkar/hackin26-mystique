import React, { Component } from 'react';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from '../../utils/shortCodes';
import styled from 'styled-components';

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
  subArrays = (arr) => {
    const { numberOfColumns } = this.props;
    const perChunk = numberOfColumns;
    const result = arr.reduce((resultArray, item, index) => {
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
        <h3>{title}</h3>
        <table className="description-table">
          <tbody>
            {tableColumns.map((column, index) => {
              return (
                <tr key={index}>
                  {column.map((item, index) => (
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
