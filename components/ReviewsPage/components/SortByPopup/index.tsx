import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { FILTER_RATING_TO_API_PARAM_MAPPING, QUERY_PARAMS } from 'const/index';
import { strings } from 'const/strings';
import ChevronDown from 'assets/chevronDown';
import { TSortSelectorProps } from './interface';
import {
  DrawerOptions,
  DrawerStyles,
  Option,
  OptionsPopup,
  PopupContainer,
  SelectedValue,
  Toggle,
} from './styles';

const getDefaultFitlerRating = () => {
  const option = Object.keys(FILTER_RATING_TO_API_PARAM_MAPPING).find(
    (selector) => FILTER_RATING_TO_API_PARAM_MAPPING[selector].default
  );
  return FILTER_RATING_TO_API_PARAM_MAPPING[option as string];
};

const SortSelector: React.FC<React.PropsWithChildren<TSortSelectorProps>> = ({
  isMobile,
}) => {
  const router = useRouter();
  const popupRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const defaultOption = useMemo(getDefaultFitlerRating, [
    FILTER_RATING_TO_API_PARAM_MAPPING,
  ]);
  const [selectedOption, setSelectedOption] = useState(
    () =>
      FILTER_RATING_TO_API_PARAM_MAPPING[
        router.query[QUERY_PARAMS.FILTER_REVIEWS] as string
      ] ?? defaultOption
  );

  const { SORT_BY } = strings;

  const handleOptionClick = (option: Record<string, any>) => {
    const { query, pathname } = router;
    const sortSelectoryQueryParam = {
      [QUERY_PARAMS.FILTER_REVIEWS]: option.value,
    };
    setSelectedOption(option);
    setShowPopup(false);
    router.replace(
      {
        pathname,
        query: { ...query, ...sortSelectoryQueryParam },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  useCaptureClickOutside(
    popupRef,
    () => {
      setShowPopup(false);
    },
    []
  );

  const toggleJSX = (
    <>
      {selectedOption.label}
      <ChevronDown />
    </>
  );

  const OptionJSX = () => (
    <>
      {Object.keys(FILTER_RATING_TO_API_PARAM_MAPPING).map((option) => {
        const filterRatingValue = FILTER_RATING_TO_API_PARAM_MAPPING[option];
        return (
          <Option
            key={filterRatingValue.value}
            onClick={() => handleOptionClick(filterRatingValue)}
          >
            <span>{filterRatingValue.label}</span>
            <input
              name="sort-by"
              type="radio"
              checked={filterRatingValue.label === selectedOption.label}
              aria-labelledby={filterRatingValue.label}
            />
          </Option>
        );
      })}
    </>
  );

  return (
    <>
      <PopupContainer ref={popupRef}>
        <SelectedValue onClick={() => setShowPopup(!showPopup)}>
          <span>{`${SORT_BY}: `} </span>
          <Toggle $expanded={showPopup}>{toggleJSX}</Toggle>
        </SelectedValue>
        <Conditional if={showPopup && !isMobile}>
          <OptionsPopup>
            <OptionJSX />
          </OptionsPopup>
        </Conditional>
        <Conditional if={showPopup && isMobile}>
          <Drawer
            $drawerStyles={DrawerStyles}
            heading={SORT_BY}
            container={popupRef.current}
          >
            <DrawerOptions>
              <OptionJSX />
            </DrawerOptions>
          </Drawer>
        </Conditional>
      </PopupContainer>
    </>
  );
};

export default SortSelector;
