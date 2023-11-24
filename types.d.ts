import { DefaultClient } from 'prismic-javascript/types/client';
import { CoralogixLogger } from 'coralogix-logger';

declare global {
  var coralogixLoggerInstance: CoralogixLogger;
  var prismicClient: DefaultClient & { timestamp: number };
  interface Window {
    dataLayer: Array<any>;
  }
  interface Highlight {
    type: string;
    content: Object;
    spans: Array<Object>;
    text: string;
  }

  interface IUrlSlugs {
    [key: string]: string;
  }
}
