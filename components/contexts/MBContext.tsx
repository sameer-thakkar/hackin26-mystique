import React, { createContext } from "react";

export const MBContext = createContext({
  uid: null,
  lang: null,
  language_full: null,
  nakedDomain: null
});

export const MBContextProvider = props => {
  const { uid, lang } = props;
  const nakedDomain = uid
    .replace("stage.", "")
    .split(".")
    .slice(1, 3)
    .join(".");
  return (
    <MBContext.Provider
      value={{
        uid,
        lang: lang.split("-")[0],
        language_full: lang,
        nakedDomain
      }}
    >
      {props.children}
    </MBContext.Provider>
  );
};
