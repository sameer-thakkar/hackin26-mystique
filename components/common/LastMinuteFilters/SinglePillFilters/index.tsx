import { useRef, useState } from 'react';
import { Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import Drawer, { PanelAnchor } from 'components/common/Drawer';
import { scrollToProductsContainerTop } from 'components/common/POIFilters/utils';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import ChevronDown from 'assets/chevronDown';
import CloseIcon from 'assets/closeIcon';
import Radioicon from 'assets/radioicon';
import { FiltersContainer } from '../styles';
import { TSinglePillFiltersProps } from './interface';
import {
  chevronIconStyle,
  drawerHeaderStyle,
  filterButtonStyle,
  filterOptionStyle,
  iconWrapperStyle,
  panelAnchorStyle,
} from './styles';

export const SinglePillFilters = ({
  dateTimeFilters,
  selectedDateTimeFilterIndex,
  onFilterChange,
  inventoryData,
  poiFilteredTours,
}: TSinglePillFiltersProps) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const buttonRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    setIsFilterDrawerOpen(true);

    if (buttonRef.current) {
      const scrollParent = buttonRef.current.closest('#POI_FILTERS');

      scrollParent?.scrollTo({
        left: -scrollParent.scrollLeft,
        behavior: 'smooth',
      });
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.FILTER_APPLIED,
      [ANALYTICS_PROPERTIES.FILTER_TYPE]: 'Date filter',
    });
  };

  const handleFilterOptionClick = (index: number, closeHandler: () => void) => {
    onFilterChange({
      dateTimeFilter: {
        clickedIndex: index,
        isUserAction: true,
        deSelect: index === selectedDateTimeFilterIndex,
      },
    });

    setTimeout(() => {
      closeHandler();
    }, 200);

    scrollToProductsContainerTop(true);
  };

  const isDateAvailable = (date: string | null) => {
    if (!date) return true;
    const filteredTours = poiFilteredTours?.filter(
      ({ tgid }) => inventoryData[tgid]?.dates?.[date]
    );

    return !!filteredTours.length;
  };

  return (
    <>
      <FiltersContainer
        className={css({
          paddingRight: '0px!',
        })}
      >
        <div
          className={filterButtonStyle}
          tabIndex={0}
          onClick={handleButtonClick}
          role="button"
          ref={buttonRef}
        >
          <Text
            textStyle={'Semantics/UI Label/Regular (Heavy)'}
            color={'white'}
            className={css({
              paddingY: '1px',
              transform: 'translateY(-0.25px)',
            })}
          >
            {dateTimeFilters[selectedDateTimeFilterIndex].display_name}
          </Text>
          <ChevronDown className={chevronIconStyle} />
        </div>
      </FiltersContainer>

      <Conditional if={isFilterDrawerOpen}>
        <Drawer
          showPanelAnchor={false}
          noMargin
          slideOutOnClose
          closeHandler={() => setIsFilterDrawerOpen(false)}
          coverHeaderInShadow
          className={css({
            height: 'max-content!',
            position: 'relative',
          })}
          customHeader={(closeHandler) => (
            <div className={drawerHeaderStyle}>
              <PanelAnchor className={panelAnchorStyle} />
              <Text
                className={css({
                  marginTop: 'space.4',
                  fontSize: 'font.size.18',
                  color: 'core.grey.800',
                  fontFamily: 'font.family.hd',
                  letterSpacing: 'ls.6',
                  lineHeight: 'lh.24',
                  fontWeight: 'font.weight.500',
                })}
              >
                {strings.FILTERS.DATE_SELECTION}
              </Text>

              <span className={iconWrapperStyle}>
                <CloseIcon
                  className={css({
                    height: '12px',
                    width: '12px',
                  })}
                  onClick={closeHandler}
                />
              </span>
            </div>
          )}
          contents={(closeHandler) => (
            <div
              className={css({
                paddingBottom: 'space.16',
              })}
            >
              {dateTimeFilters.map((filter, index) => (
                <div
                  key={filter.key}
                  className={filterOptionStyle}
                  onClick={() => {
                    if (!isDateAvailable(filter.value)) return;

                    handleFilterOptionClick(index, closeHandler);
                  }}
                  role="button"
                  tabIndex={-1}
                  data-is-available={isDateAvailable(filter.value)}
                >
                  <Text
                    textStyle={'Semantics/UI Label/Large (Heavy)'}
                    className="option-text"
                  >
                    {filter.display_name}
                  </Text>

                  <Radioicon
                    isActive={
                      selectedDateTimeFilterIndex === index &&
                      isDateAvailable(filter.value)
                    }
                    className="radio"
                  />
                </div>
              ))}
            </div>
          )}
        ></Drawer>
      </Conditional>
    </>
  );
};
