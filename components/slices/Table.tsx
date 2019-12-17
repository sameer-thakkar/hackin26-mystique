import React, { Component } from "react";
import { RichText } from "prismic-reactjs";
import { shortCodeSerializer } from "../../utils/shortCodes";

export default class Table extends Component<any, any> {
  subArrays = arr => {
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
      <div className="table-container">
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
      </div>
    );
  }
}
