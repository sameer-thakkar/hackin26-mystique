import type {
  AllDocumentTypes,
  ContentFrameworkDocumentDataBodyTicketCardShoulderPageSlice,
} from 'types.prismic';
import type { TCategoryTourListV1 } from 'utils/prismicUtils/interface';

export type TCategoryTourListParserV1 = {
  micrositeProductCardSliceWithData?: TCategoryTourListV1;
  shoulderPageTicketsCard?: ContentFrameworkDocumentDataBodyTicketCardShoulderPageSlice;
  productCardDocument?: AllDocumentTypes;
  hostname: string;
  lang: string;
  cookies?: Record<string, any>;
  localizedStrings?: Record<string, any>;
};
