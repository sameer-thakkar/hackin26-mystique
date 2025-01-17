import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  snapDrawerConfig: {
    isMountedOnTop: boolean;
    transform?: string | null;
    isCompleted?: boolean;
  };
  setSnapDrawerConfig: (state: {
    isMountedOnTop: boolean;
    transform?: string | null;
    isCompleted?: boolean;
  }) => void;
}

const productCardContext = createContext({} as ProductContextType);

export const useProductCard = () => useContext(productCardContext);

export const ProductCardProvider: React.FC<
  React.PropsWithChildren<
    PropsWithChildren<{
      drawerDefault?: string;
      onDrawerStateChanged?: (state: string) => void;
    }>
  >
> = ({
  children,
  drawerDefault = SWIPESHEET_STATES.HIDDEN,
  onDrawerStateChanged,
}) => {
  const [drawerState, setDrawerState] = useState(drawerDefault);
  const [pricingHeight, setPricingHeight] = useState(0);
  const [discountText, setDiscountText] = useState('');
  const [showPricingBar, setShowPricingBar] = useState(false);
  const [title, setTitle] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const [snapDrawerConfig, setSnapDrawerConfig] = useState({
    isMountedOnTop: false,
  });

  const { Provider: ProductCardContextProvider } = productCardContext;

  const setDrawerStateHandler = (state: string) => {
    setDrawerState(state);
    onDrawerStateChanged && onDrawerStateChanged(state);
  };

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
        setDrawerState: setDrawerStateHandler,
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
        snapDrawerConfig,
        setSnapDrawerConfig,
      }}
    >
      {children}
    </ProductCardContextProvider>
  );
};
