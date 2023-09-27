interface IGetUid {
  doc: Record<string, any>;
  lang?: string;
}

export const getUidFromRootLevel = ({ doc }: IGetUid) => {
  return doc.uid;
};
