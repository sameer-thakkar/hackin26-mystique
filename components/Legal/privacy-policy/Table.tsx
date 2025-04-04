import React from 'react';
import {
  tableCellStyles,
  tableHeaderStyles,
  tableRowStyles,
  tableStyles,
} from './styles';
import type { TTable } from './types';

const Table = ({ tableData, index }: TTable) => {
  if (!tableData) return null;

  return (
    <div className="table-container" key={index}>
      <table className={tableStyles}>
        <thead>
          <tr>
            {tableData.headers.map((header, headerIndex) => (
              <th key={headerIndex} className={tableHeaderStyles}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={tableRowStyles}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={tableCellStyles}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
