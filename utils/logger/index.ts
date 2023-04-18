import { LOG_LEVELS } from 'constants/logs';

const shouldSendLogs = () => {
  return process.env.NODE_ENV === 'production';
};
interface ILogData {
  level?: String;
  message?: String;
  err?: unknown;
}

export const sendLog = async ({
  level = LOG_LEVELS.ERROR,
  message,
  err,
}: ILogData) => {
  let text = message;
  if (err instanceof Error) {
    text = err.stack;
  }
  if (typeof window === 'undefined' && shouldSendLogs()) {
    const [
      { getCoralogixLoggerInstance, getCoralogixSeverity },
      { Log },
    ] = await Promise.all([
      import(/* webpackChunkName: 'coralogix-module' */ './coralogix'),
      import(/* webpackChunkName: 'coralogix-logger' */ 'coralogix-logger'),
    ]);

    const log = new Log({
      severity: getCoralogixSeverity(level),
      text: text,
    });
    getCoralogixLoggerInstance().addLog(log);
  }
};
