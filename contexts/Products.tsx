import React, { createContext } from 'react';

const ProductsContext = createContext(null);
export default ProductsContext;
export const ProductsContextProvider = ({ ready, allTours, children }) => {
  return (
    <ProductsContext.Provider value={{ allTours, ready }}>
      {children}
    </ProductsContext.Provider>
  );
};
