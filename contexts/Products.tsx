import React, { createContext } from 'react';

const ProductsContext = createContext(null);
export default ProductsContext;
export const ProductsContextProvider = ({
  ready,
  allTours,
  children
}: any) => {
  return (
    // @ts-expect-error TS(2322): Type '{ allTours: any; ready: any; }' is not assig... Remove this comment to see the full error message
    <ProductsContext.Provider value={{ allTours, ready }}>
      {children}
    </ProductsContext.Provider>
  );
};
