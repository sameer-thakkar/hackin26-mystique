export const traceError = (args: any) =>
  // eslint-disable-next-line no-console
  console.trace({ time: new Date().toUTCString(), ...args });
