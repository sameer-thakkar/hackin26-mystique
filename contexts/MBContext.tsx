import React, { createContext } from 'react';

export const MBContext = createContext({
  uid: null,
  lang: null,
  language_full: null,
  nakedDomain: null,
  buttons: null,
});

export const MBContextProvider = (props) => {
  const { uid, lang, microsite, host } = props;
  const buttons = {
    see_more_text: microsite?.see_more_text,
  };
  const nakedDomain = !host.includes('localhost')
    ? host.replace('stage.', '').split('.').slice(1).join('.')
    : host;

  return (
    <MBContext.Provider
      value={{
        uid,
        lang: lang.split('-')[0],
        language_full: lang,
        nakedDomain,
        buttons: buttons,
      }}
    >
      {props.children}
    </MBContext.Provider>
  );
};
