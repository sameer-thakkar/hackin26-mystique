export type TTableData = {
  headers: string[];
  rows: Array<string[]>;
};

type TSubItem = {
  text: string;
  bulletPoints?: Array<string>;
};

export type TContentItem = {
  text: string;
  tableData?: TTableData;
  subItems?: Array<TSubItem>;
};

export type TContentBlock = {
  type: string;
  items?: Array<TContentItem>;
  tableData?: TTableData;
};

export type TList = {
  listItems: Array<TContentItem> | undefined;
  index: number;
};

export type TTable = {
  tableData: TTableData | undefined;
  index: number;
};
