import type { NextApiRequest } from 'next';
import type { SelectField, Slice } from '@prismicio/types';
import type {
  AllDocumentTypes,
  MicrositeDocumentDataBodyTourListCategoryV1SliceItem,
  MicrositeDocumentDataBodyTourListCategoryV1SlicePrimary,
  ProductCardsDocument,
  Simplify,
} from 'types.prismic';

export type TGetContentType = Pick<TGetDocument, 'req' | 'uid'> & {
  type: AllDocumentContentTypes;
};

export type AllDocumentContentTypes = {
  [K in keyof AllDocumentTypes]: AllDocumentTypes['type'];
}[keyof AllDocumentTypes];

export type TGetDocument = {
  req: NextApiRequest;
  uid: string;
  lang?: string | null;
  host?: string;
  isDev: boolean;
  documentData?: Record<string, any>;
  baseLangMicrositeData?: Record<string, any>;
};

export type TRedirectInfo = {
  redirectInfo: {
    url: string;
    type: '302' | '301';
  };
};

export type TGetPrismicDocument = Omit<TGetDocument, 'host'> & {
  isDev?: boolean;
  contentType: AllDocumentContentTypes;
};

export type TDocumentResponse<T> = {
  ContentType?: string;
  CMSContent?: T;
  statusCode?: number;
  redirectInfo?: {
    url: string;
    type: number;
  };
  shouldHaveShorterTtl?: boolean;
};

export type TModifiedMicrositeDocumentDataBodyTourListCategoryV1SlicePrimary =
  Simplify<
    Omit<
      MicrositeDocumentDataBodyTourListCategoryV1SlicePrimary,
      'product_cards'
    > & {
      product_cards: Simplify<ProductCardsDocument>;
    }
  >;

export type TCategoryTourListV1 = Slice<
  'tour_list_category_v1',
  TModifiedMicrositeDocumentDataBodyTourListCategoryV1SlicePrimary,
  Simplify<MicrositeDocumentDataBodyTourListCategoryV1SliceItem>
>;

export type TMbType = SelectField<
  | 'A1 - Collection MB'
  | 'A1 - City Guide'
  | 'A1 - Home Page'
  | 'A1 - Sub Category MB'
  | 'A1 - Category MB'
  | 'A2 - Sub Category MB'
  | 'A2 - Category MB'
  | 'B1 - Global MB'
  | 'B1 - Global Home Page'
  | 'C1 - Collection MB'
>;
