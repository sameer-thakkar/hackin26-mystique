import { createContext, useContext, useEffect, useState } from 'react';
import { SWIPESHEET_STATES } from 'const/productCard';

interface ProductContextType {
  drawerState: string;
  setDrawerState: (state: string) => void;
  pricingHeight: number;
  setPricingHeight: (state: number) => void;
  discountText: string;
  setDiscountText: (state: string) => void;
  showPricingBar: boolean;
  setShowPricingBar: (state: boolean) => void;
  title: string;
  setTitle: (state: string) => void;
  headerHeight: number;
  setHeaderHeight: (state: number) => void;
}

const productCardContext = createContext({} as ProductContextType);

export const useProductCard = () => useContext(productCardContext);

export const ProductCardProvider: React.FC = ({ children }) => {
  const [drawerState, setDrawerState] = useState(SWIPESHEET_STATES.HIDDEN);
  const [pricingHeight, setPricingHeight] = useState(0);
  const [discountText, setDiscountText] = useState('');
  const [showPricingBar, setShowPricingBar] = useState(false);
  const [title, setTitle] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const { Provider: ProductCardContextProvider } = productCardContext;

  useEffect(() => {
    if (showPricingBar && drawerState === SWIPESHEET_STATES.HIDDEN) {
      setShowPricingBar(false);
      setHeaderHeight(0);
    }
  }, [showPricingBar, drawerState]);

  return (
    <ProductCardContextProvider
      value={{
        drawerState,
        setDrawerState,
        pricingHeight,
        setPricingHeight,
        discountText,
        setDiscountText,
        showPricingBar,
        setShowPricingBar,
        title,
        setTitle,
        headerHeight,
        setHeaderHeight,
      }}
    >
      {children}
    </ProductCardContextProvider>
  );
};
