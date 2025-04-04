import List from './List';
import { policyItem } from './styles';
import Table from './Table';
import type { TContentBlock } from './types';

export const renderContentBlock = (
  contentBlock: TContentBlock,
  contentIndex: number
) => {
  switch (contentBlock.type) {
    case 'paragraph':
      return (
        <p key={contentIndex} className={policyItem}>
          {contentBlock?.items?.[0]?.text}
        </p>
      );
    case 'list':
      return <List listItems={contentBlock.items} index={contentIndex} />;
    case 'table':
      return <Table tableData={contentBlock.tableData} index={contentIndex} />;
    default:
      return null;
  }
};
