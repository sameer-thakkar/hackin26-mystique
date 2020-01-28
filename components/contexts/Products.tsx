import React, { Component, createContext } from "react";

export const ProductsContext = createContext(null);

export class ProductsContextProvider extends Component<any, any> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ProductsContext.Provider value={{ allTours: this.props.allTours }}>
        {this.props.children}
      </ProductsContext.Provider>
    );
  }
}
