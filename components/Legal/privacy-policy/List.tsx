import React from 'react';
import Conditional from 'components/common/Conditional';
import { policyItem } from './styles';
import Table from './Table';
import type { TList, TTableData } from './types';

const List = ({ listItems, index }: TList) => {
  if (!listItems?.length) return null;

  return (
    <ol key={index}>
      {listItems?.map((item, itemIndex) => {
        const { text, tableData, subItems } = item;
        return (
          <li key={itemIndex} className={policyItem}>
            {text}
            <Conditional if={!!tableData}>
              <Table tableData={tableData as TTableData} index={itemIndex} />
            </Conditional>
            <Conditional if={!!subItems}>
              <ol>
                {subItems?.map((subItem, subItemIndex) => {
                  const { text, bulletPoints } = subItem;
                  return (
                    <li key={subItemIndex} className={policyItem}>
                      {text}
                      <Conditional if={!!bulletPoints}>
                        <ul>
                          {bulletPoints?.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className={policyItem}>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </Conditional>
                    </li>
                  );
                })}
              </ol>
            </Conditional>
          </li>
        );
      })}
    </ol>
  );
};

export default List;
