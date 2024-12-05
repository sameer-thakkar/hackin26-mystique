import type { ContentFrameworkDocumentDataBodyTicketCardShoulderPageSlice } from 'types.prismic';
import type { TCategoryTourListV1 } from 'utils/prismicUtils/interface';

export type TCategoryTourListParserV1 = {
  micrositeProductCardSliceWithData?: TCategoryTourListV1;
  currentMicrositeProductCardSliceWithData?: TCategoryTourListV1;
  shoulderPageTicketsCard?: ContentFrameworkDocumentDataBodyTicketCardShoulderPageSlice;
  hostname: string;
  lang: string;
  cookies?: Record<string, any>;
  localizedStrings?: Record<string, any>;
  isLookerWebhookCall?: boolean;
  runRankingExperiment?: boolean;
};
