export const toBase64 = (s: string) =>
  typeof window === 'undefined'
    ? Buffer.from(s).toString('base64')
    : window.btoa(s);
