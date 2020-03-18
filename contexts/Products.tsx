import React, { Component, createContext } from 'react';

const ProductsContext = createContext(null);
export default ProductsContext;
export class ProductsContextProvider extends Component<any, any> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ProductsContext.Provider
        value={{ allTours: this.props.allTours, ready: this.props.ready }}
      >
        {this.props.children}
      </ProductsContext.Provider>
    );
  }
}
