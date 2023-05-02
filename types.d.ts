import { CoralogixLogger } from 'coralogix-logger';

declare global {
  var coralogixLoggerInstance: CoralogixLogger;
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
