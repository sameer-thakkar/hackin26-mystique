import { Suspense, useContext, useEffect, useRef, useState } from 'react';
import { EReviewSortType } from 'types/reviews';
import { Dropdown, Filters, Icon } from '@headout/eevee';
import ChevronDown from '@headout/onix/web/ui/chevron/stroke/ChevronDown';
import { css } from '@headout/pixie/css';
import { MBContext } from 'contexts/MBContext';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import CrossiconSvg from 'assets/crossiconSvg';
import { RadioButton } from './RadioButton';
import {
  desktopOverlayStyles,
  filterContainerStyles,
  filterIconStyles,
  StyledBackdrop,
  StyledOverlayContainer,
} from './styles';
import { TSortingDropdownProps, TSortingOverlayProps } from './types';
import { getSortTypeLabel } from './utils';

const OverlayContents = ({
  changeRenderOverlayState,
  children,
}: TSortingOverlayProps) => {
  const [showOverlay, changeOverlayState] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      changeOverlayState(true);
    }, 10);
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  const close = () => {
    if (!showOverlay) return;
    changeOverlayState(false);
    setTimeout(() => {
      changeRenderOverlayState(false);
    }, 350);
  };

  useCaptureClickOutside(ref, close);

  return (
    <>
      <StyledBackdrop $isOpen={showOverlay} onClick={close} />
      <StyledOverlayContainer
        $isOpen={showOverlay}
        ref={ref}
        data-qa-marker="qaid-review-sorting-dropdown-options-container"
      >
        <div className="overlay-heading">
          {strings.REVIEWS_SECTION.SORTING.SORT_BY}
          <button className="overlay-cross" onClick={close}>
            <CrossiconSvg />
          </button>
        </div>
        <div className="overlay-contents">{children}</div>
      </StyledOverlayContainer>
    </>
  );
};

const SortingDropdown = ({
  isDesktop,
  onSortTypeChange,
  productDetails,
  currentSortType,
}: TSortingDropdownProps) => {
  const [open, setOpen] = useState(false);
  const selectedIndex = Object.values(EReviewSortType).indexOf(currentSortType);
  const { lang } = useContext(MBContext);

  const closeDropdown = () => setOpen(false);

  const onFilterClick = (checked: boolean, index: number) => {
    if (checked) {
      const sortType = Object.values(EReviewSortType)[index];
      onSortTypeChange(sortType);

      trackEvent({
        eventName: ANALYTICS_EVENTS.REVIEW_SORT_BY_CLICKED,
        [ANALYTICS_PROPERTIES.SORTING_CRITERA]: sortType,
        [ANALYTICS_PROPERTIES.TGID]: productDetails.tgid,
        [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
        [ANALYTICS_PROPERTIES.PLATFORM_NAME]: productDetails.isDesktop
          ? 'DESKTOP'
          : 'MOBILE',
        [ANALYTICS_PROPERTIES.NUMBER_OF_REVIEWS]:
          productDetails.numberOfReviews,
        [ANALYTICS_PROPERTIES.AVERAGE_RATING]:
          productDetails.reviewsDetails.averageRating,
      });
      setOpen(false);
    }
  };

  const iconStyles = filterIconStyles({ open });

  return (
    <Dropdown.Root open={open}>
      <Suspense>
        <Dropdown.Trigger asChild>
          <div
            className={filterContainerStyles}
            data-qa-marker="qaid-review-sorting-dropdown-trigger"
          >
            <Filters
              variant="chip selector"
              text={getSortTypeLabel(selectedIndex)}
              state="default"
              size="small"
              trailingIcon={<Icon svg={ChevronDown} className={iconStyles} />}
              onClick={() => {
                if (!open)
                  trackEvent({
                    eventName: ANALYTICS_EVENTS.SORT_BY_POPUP_SHOWN,
                    [ANALYTICS_PROPERTIES.TGID]: productDetails.tgid,
                    [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
                    [ANALYTICS_PROPERTIES.PLATFORM_NAME]:
                      productDetails.isDesktop ? 'DESKTOP' : 'MOBILE',
                    [ANALYTICS_PROPERTIES.NUMBER_OF_REVIEWS]:
                      productDetails.numberOfReviews,
                    [ANALYTICS_PROPERTIES.AVERAGE_RATING]:
                      productDetails.reviewsDetails.averageRating,
                  });
                setOpen(!open);
              }}
              isDropdownOpen={open}
            />
          </div>
        </Dropdown.Trigger>
      </Suspense>

      <Dropdown.Portal>
        {isDesktop ? (
          <Dropdown.Content
            onEscapeKeyDown={closeDropdown}
            onInteractOutside={closeDropdown}
            align="start"
            className={desktopOverlayStyles}
            data-qa-marker="qaid-review-sorting-dropdown-options-container"
          >
            {Object.values(EReviewSortType).map((category, index) => (
              <Dropdown.Item key={category}>
                <RadioButton
                  checked={selectedIndex === index}
                  id={category}
                  name={getSortTypeLabel(index)}
                  value={category}
                  label={getSortTypeLabel(index)}
                  className={css(
                    // to make this single select.
                    selectedIndex === index && {
                      touchAction: 'none',
                      pointerEvents: 'none',
                    }
                  )}
                  onChange={(checked) => onFilterClick(checked, index)}
                  radioPosition="back"
                  spacedOut
                />
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        ) : (
          <OverlayContents changeRenderOverlayState={setOpen}>
            {Object.values(EReviewSortType).map((category, index) => (
              <RadioButton
                key={category}
                checked={selectedIndex === index}
                id={category}
                radioPosition="back"
                value={category}
                label={getSortTypeLabel(index)}
                name={getSortTypeLabel(index)}
                className={css(
                  // to make this single select.
                  selectedIndex === index && {
                    touchAction: 'none',
                    pointerEvents: 'none',
                  }
                )}
                onChange={(checked) => onFilterClick(checked, index)}
                spacedOut
              />
            ))}
          </OverlayContents>
        )}
      </Dropdown.Portal>
    </Dropdown.Root>
  );
};

export default SortingDropdown;
