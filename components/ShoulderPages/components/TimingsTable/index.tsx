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
  isSubattraction,
  hideCollapse,
}: ITimingsTableProps) => {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);

  const filteredColumns = allColumns.filter((col) =>
    rows.some((row) => row[col.key])
  );
  const columns = isMobile ? allColumns.slice(0, 2) : filteredColumns;

  const toggleCollapse = () => !hideCollapse && setIsCollapsed(!isCollapsed);

  return (
    <TableContainer isCollapsed={isCollapsed} isSubattraction={isSubattraction}>
      <TableWrapper>
        <Conditional if={!isSubattraction}>
          <thead>
            <TableRow isCollapsed={isCollapsed} onClick={toggleCollapse}>
              {columns?.map((column, index) => (
                <TableHeaderCell key={index}>
                  <Conditional if={index === 0}>
                    <p>{`${columns[0].label} ${strings.CONTENT_PAGE.TIMINGS}`}</p>
                    <p>{`${strings.CONTENT_PAGE.DAYS} (${columns[0].label})`}</p>
                  </Conditional>
                  <Conditional if={index !== 0}>{column.label}</Conditional>
                </TableHeaderCell>
              ))}
            </TableRow>
            <Conditional if={!hideCollapse}>
              <IconWrapper isOpen={!isCollapsed} onClick={toggleCollapse}>
                <Chevron />
              </IconWrapper>
            </Conditional>
          </thead>
        </Conditional>
        <tbody>
          {rows?.map((row, rowIndex) => (
            <TableRow isActive={row.isActive} key={rowIndex}>
              {columns?.map((column, index) => (
                <TableCell key={index}>
                  {index === 2 && isSubattraction && row[allColumns[2]?.key]
                    ? `${strings.CONTENT_PAGE.LAST_ENTRY} `
                    : ''}
                  {`${row[column.key]}
                  ${
                    index === 0 &&
                    row.isActive &&
                    !(isSubattraction && isMobile)
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
