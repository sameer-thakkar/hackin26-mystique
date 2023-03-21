import { CoralogixLogger } from 'coralogix-logger';

declare global {
  var coralogixLoggerInstance: CoralogixLogger;
  interface Window {
    dataLayer: Array<any>;
  }
}
