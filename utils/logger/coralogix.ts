import { LOG_LEVELS } from 'constants/logs';

import { CoralogixLogger, LoggerConfig, Severity } from 'coralogix-logger';

export const getCoralogixSeverity = (level: String) => {
  let logSeverity: Severity;
  switch (level) {
    case LOG_LEVELS.ERROR:
      logSeverity = Severity.error;
      break;
    default:
      logSeverity = Severity.warning;
  }
  return logSeverity;
};

export const getCoralogixLoggerInstance = (): CoralogixLogger => {
  if (global['coralogixLoggerInstance'])
    return global['coralogixLoggerInstance'];

  const config = new LoggerConfig({
    applicationName: 'mystique',
    privateKey: 'b482206c-896b-9c5c-76d9-96b5cbf43f24',
    subsystemName: process.env.NODE_ENV,
  });

  CoralogixLogger.configure(config);
  const coralogixLoggerInstance: CoralogixLogger = new CoralogixLogger(
    'Mystique logs'
  );

  global['coralogixLoggerInstance'] = coralogixLoggerInstance;
  return coralogixLoggerInstance;
};
