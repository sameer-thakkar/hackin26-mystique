import type { KeyTextField, NumberField, SelectField } from '@prismicio/types';
import type {
  ContentFrameworkDocumentDataBodyTicketCardShoulderPageSlice,
  ContentPageDocument,
  MicrositeDocumentData,
  ProductCardsDocumentData,
} from 'types.prismic';
import type { TMbType } from '../interface';

export type TProductCardData = ContentFrameworkDocumentDataBodyTicketCardShoulderPageSlice & {
  data: ProductCardsDocumentData;
};

export type TContentPageDocument = ContentPageDocument & {
  data: {
    baseLangExperienceLimit: NumberField;
    baseLangPageTitle: KeyTextField;
    baseLangIsPoiMb: boolean;
    baseLangBannerAndFooterCombinations: SelectField<
      | 'Partnered and Sensitive'
      | 'Partnered and Non-Sensitive'
      | 'Non-Partnered and Sensitive'
      | 'Non-Partnered and Non-Sensitive',
      'filled'
    >;
    baseLangMicrositeData: MicrositeDocumentData;
    baseLangCategorisationMetadata: TCategorisationMetadata;
    mbType: TMbType;
    productCardData: TProductCardData;
  };
};
