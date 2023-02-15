import { LOG_LEVELS } from 'constants/logs';

import { Log } from 'coralogix-logger';

import {
  getCoralogixLoggerInstance,
  getCoralogixSeverity,
  shouldSendCoralogixLogs,
} from './coralogix';

interface ILogData {
  level?: String;
  message?: String;
  err?: unknown;
}

export const sendLog = ({
  level = LOG_LEVELS.ERROR,
  message,
  err,
}: ILogData) => {
  let text = message;
  if (err instanceof Error) {
    text = err.stack;
  }
  if (shouldSendCoralogixLogs()) {
    const log = new Log({
      severity: getCoralogixSeverity(level),
      text: text,
    });
    getCoralogixLoggerInstance().addLog(log);
  }
};
