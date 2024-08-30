import type { KeyTextField, SelectField } from '@prismicio/types';
import type {
  MicrositeDocument,
  MicrositeDocumentData,
  MicrositeDocumentDataBodyTourListCategorySlice,
  MicrositeDocumentDataBodyTourListCategoryV1Slice,
  Simplify,
  TopAttractionsDocumentData,
} from 'types.prismic';
import { TMbType } from '../interface';

export type TCategorisationMetadata = Pick<
  Simplify<MicrositeDocumentData & { subattraction_type?: string }>,
  | 'tagged_city'
  | 'tagged_country'
  | 'tagged_collection'
  | 'tagged_category'
  | 'tagged_sub_category'
  | 'tagged_mb_type'
  | 'tagged_page_type'
  | 'primary_tag'
  | 'shoulder_page_type'
  | 'shoulder_page_custom_label'
  | 'tagged_content_type'
>;

export type TMicrositeDocument = MicrositeDocument & {
  data: {
    localisedCategoryTourListV1: MicrositeDocumentDataBodyTourListCategoryV1Slice;
    currentPageCategoryTourListV1: MicrositeDocumentDataBodyTourListCategoryV1Slice;
    categoryTourListV2?: MicrositeDocumentDataBodyTourListCategorySlice;
    topAttractionsData?: Simplify<TopAttractionsDocumentData>;
    baseLangPageTitle: KeyTextField;
    baseLangIsPoiMb: boolean;
    baseLangBannerAndFooterCombinations: SelectField<
      | 'Partnered and Sensitive'
      | 'Partnered and Non-Sensitive'
      | 'Non-Partnered and Sensitive'
      | 'Non-Partnered and Non-Sensitive',
      'filled'
    >;
    baseLangCategorisationMetadata: TCategorisationMetadata;
    mbType: TMbType;
    customBanner?: Record<string, any>;
    baseLangCustomBanner?: Record<string, any>;
  };
  subattractionsContentPageData?: Record<string, any>;
};

export type TResolvedDocumentResponseM<T> = {
  CMSContent: T;
  ContentType: string;
  shouldPageHaveShorterTtl: boolean;
};
