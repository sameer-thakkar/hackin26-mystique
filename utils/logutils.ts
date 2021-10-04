export const traceError = (args) =>
  console.trace({ time: new Date().toUTCString(), ...args });
