import { Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import Drawer, { PanelAnchor } from 'components/common/Drawer';
import LazyComponent from 'components/common/LazyComponent';
import { strings } from 'const/strings';
import { MustSeeAttractionsSVG } from 'assets/poiFilterSVGs';
import { TDiscoverMoreDrawerProps } from './interface';
import { POICollectionInfoCard } from './POICollectionInfoCard';
import {
  collectionCardsContainerStyles,
  drawerBodyStyles,
  drawerHeaderStyles,
  headerTextStyles,
} from './styles';

export const DiscoverMoreDrawer = ({
  onClose,
  collectionsList,
  cityName,
}: TDiscoverMoreDrawerProps) => {
  return (
    <Drawer
      closeHandler={() => {
        onClose();
      }}
      className={css({
        maxHeight: '85vh',
      })}
      slideOutOnClose
      customHeader={() => (
        <div className={drawerHeaderStyles}>
          <PanelAnchor
            className={css({ width: '3.375rem!', margin: '0px!' })}
          />
        </div>
      )}
      coverHeaderInShadow
      noMargin
    >
      <div className={drawerBodyStyles}>
        <Text className={headerTextStyles}>
          {strings.formatString(
            strings.POI_COLLECTIONS_SECTION.CITY_YOUR_WAY,
            cityName
          )}
        </Text>

        <MustSeeAttractionsSVG
          className={css({
            gridRow: 'span 2',
          })}
        />

        <Text
          className={css({
            textStyle: 'Semantics/Heading/Medium',
            color: 'semantic.text.grey.2!',
          })}
        >
          {strings.POI_COLLECTIONS_SECTION.TOP_EXPERIENCE_PICKS}
        </Text>
      </div>

      <div className={collectionCardsContainerStyles}>
        {collectionsList.map((collection, index) => (
          <LazyComponent key={collection.url}>
            <POICollectionInfoCard collection={collection} index={index} />
          </LazyComponent>
        ))}
      </div>
    </Drawer>
  );
};
