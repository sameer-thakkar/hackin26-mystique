import Conditional from 'components/common/Conditional';
import { ITimingsTableProps } from 'components/ShoulderPages/interface';
import { strings } from 'const/strings';
import {
  LastEntry,
  TableCell,
  TableContainer,
  TableHeaderCell,
  TableRow,
  TableWrapper,
} from './styles';

const TimingsTable = ({
  rows,
  columns: allColumns,
  isMobile,
}: ITimingsTableProps) => {
  const filteredColumns = allColumns.filter((col) =>
    rows.some((row) => row[col.key])
  );
  const columns = isMobile ? allColumns.slice(0, 2) : filteredColumns;
  return (
    <TableContainer>
      <TableWrapper>
        <thead>
          <TableRow>
            {columns?.map((column, index) => (
              <TableHeaderCell key={index}>{column.label}</TableHeaderCell>
            ))}
          </TableRow>
        </thead>
        <tbody>
          {rows?.map((row, rowIndex) => (
            <TableRow isActive={row.isActive} key={rowIndex}>
              {columns?.map((column, index) => (
                <TableCell key={index}>
                  {row[column.key]}
                  <Conditional
                    if={isMobile && index == 1 && row[allColumns[2]?.key]}
                  >
                    <LastEntry>
                      {strings.CONTENT_PAGE.LAST_ENTRY}{' '}
                      {row[allColumns[2]?.key]}
                    </LastEntry>
                  </Conditional>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </TableWrapper>
    </TableContainer>
  );
};

export default TimingsTable;
