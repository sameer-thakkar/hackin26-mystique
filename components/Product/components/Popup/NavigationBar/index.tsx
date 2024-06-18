import React from 'react';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import {
  NavigationContainer,
  NavigationLink,
  NavigationParent,
} from './styles';

type Props = {
  tabs?: any[];
  currentActiveIndex: number;
  onItemClick: (index: number) => void;
  isVisible?: boolean;
  isReviewsSectionPresent?: boolean;
  isItinerarySectionPresent?: boolean;
};

const NavigationBar = ({
  tabs = [],
  currentActiveIndex,
  isVisible,
  onItemClick,
  isReviewsSectionPresent = false,
  isItinerarySectionPresent = false,
}: Props) => {
  const reviewSectionIndex = tabs.length + (isItinerarySectionPresent ? 1 : 0);

  return (
    <NavigationParent $isVisible={isVisible}>
      <NavigationContainer $isVisible={isVisible}>
        {tabs?.slice(0, 1)?.map(({ heading }, index) => (
          <NavigationLink
            key="navigation-bar-item-0"
            $isSelected={currentActiveIndex === 0}
            onClick={() => onItemClick(index)}
            data-navigation-bar-index={0}
          >
            {heading}
          </NavigationLink>
        ))}

        <Conditional if={isItinerarySectionPresent}>
          <NavigationLink
            key={`itinerary-section-${1}`}
            $isSelected={currentActiveIndex === 1}
            onClick={() => onItemClick(1)}
            data-navigation-bar-index={1}
          >
            {strings.ITINERARY.TAB}
            <div className="new-tag">{strings.NEW}</div>
          </NavigationLink>
        </Conditional>

        {tabs?.slice(1)?.map(({ heading }, index) => {
          const finalIndex = index + 1 + (isItinerarySectionPresent ? 1 : 0);
          return (
            <NavigationLink
              key={`navigation-bar-item-${finalIndex}`}
              $isSelected={currentActiveIndex === finalIndex}
              onClick={() => onItemClick(finalIndex)}
              data-navigation-bar-index={finalIndex}
            >
              {heading}
            </NavigationLink>
          );
        })}
        <Conditional if={isReviewsSectionPresent}>
          <NavigationLink
            $isSelected={currentActiveIndex === reviewSectionIndex}
            onClick={() => onItemClick(reviewSectionIndex)}
            data-navigation-bar-index={reviewSectionIndex}
          >
            {strings.SHOW_PAGE_V2.CONTENT_TABS.Reviews}
          </NavigationLink>
        </Conditional>
      </NavigationContainer>
    </NavigationParent>
  );
};

export default NavigationBar;
