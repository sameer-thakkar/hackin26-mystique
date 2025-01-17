import type Prismic from '@prismicio/client';
import { CoralogixLogger } from 'coralogix-logger';
import type { AllDocumentTypes } from 'types.prismic';

declare global {
  var coralogixLoggerInstance: CoralogixLogger;
  var prismicClient: Prismic.Client<AllDocumentTypes> & { __initTime: number };

  interface Window {
    dataLayer: Array<any>;
  }
  interface THighlight {
    type: string;
    content: Object;
    spans: Array<Object>;
    text: string;
  }

  interface IUrlSlugs {
    [key: string]: string;
  }
}
