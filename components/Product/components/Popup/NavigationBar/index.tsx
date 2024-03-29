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
};

const NavigationBar = ({
  tabs,
  currentActiveIndex,
  isVisible,
  onItemClick,
  isReviewsSectionPresent = false,
}: Props) => {
  return (
    <NavigationParent $isVisible={isVisible}>
      <NavigationContainer $isVisible={isVisible}>
        {tabs?.map(({ heading }, index) => (
          <NavigationLink
            key={index}
            $isSelected={currentActiveIndex === index}
            onClick={() => onItemClick(index)}
          >
            {heading}
          </NavigationLink>
        ))}
        <Conditional if={isReviewsSectionPresent}>
          <NavigationLink
            $isSelected={currentActiveIndex === tabs?.length}
            onClick={() => onItemClick(tabs?.length ?? 0)}
          >
            {strings.LTT_SHOW_PAGE.CONTENT_TABS.Reviews}
          </NavigationLink>
        </Conditional>
      </NavigationContainer>
    </NavigationParent>
  );
};

export default NavigationBar;
