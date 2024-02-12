import type { NumberField } from '@prismicio/types';
import type { TCategoryTourListParserV2 } from '../categoryTourListParserV2/interface';

export type TMomPageParser = TCategoryTourListParserV2 & {
  uid: string;
  taggedCollection: NumberField;
};
