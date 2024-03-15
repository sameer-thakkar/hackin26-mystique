import { useState } from 'react';
import Conditional from 'components/common/Conditional';
import { ITimingsTableProps } from 'components/ShoulderPages/interface';
import Chevron from 'UI/Chevron';
import { strings } from 'const/strings';
import {
  IconWrapper,
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
  initiallyCollapsed = false,
}: ITimingsTableProps) => {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);

  const filteredColumns = allColumns.filter((col) =>
    rows.some((row) => row[col.key])
  );
  const columns = isMobile ? allColumns.slice(0, 2) : filteredColumns;
  const daysHeader = `${strings.CONTENT_PAGE.DAYS} (${columns[0].label})`;

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <TableContainer isCollapsed={isCollapsed}>
      <TableWrapper>
        <thead>
          <TableRow isCollapsed={isCollapsed} onClick={toggleCollapse}>
            <Conditional if={isCollapsed}>
              <TableHeaderCell>{`${columns[0].label} ${strings.CONTENT_PAGE.TIMINGS}`}</TableHeaderCell>
              <TableHeaderCell />
              <Conditional if={!isMobile}>
                <TableHeaderCell />
              </Conditional>
            </Conditional>
            <Conditional if={!isCollapsed}>
              {columns?.map((column, index) => (
                <TableHeaderCell key={index}>
                  {index == 0 ? daysHeader : column.label}
                </TableHeaderCell>
              ))}
            </Conditional>
          </TableRow>
          <IconWrapper isOpen={!isCollapsed} onClick={toggleCollapse}>
            <Chevron />
          </IconWrapper>
        </thead>
        <tbody>
          {rows?.map((row, rowIndex) => (
            <TableRow isActive={row.isActive} key={rowIndex}>
              {columns?.map((column, index) => (
                <TableCell key={index}>
                  {`${row[column.key]}${
                    index == 0 && row.isActive
                      ? ` (${strings.CONTENT_PAGE.TODAY})`
                      : ''
                  }`}
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
