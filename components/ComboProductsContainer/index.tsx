import { useEffect, useRef, useState } from 'react';
import { TComboProductsContainer } from 'components/ComboProductsContainer/interface';
import {
  Container,
  Decorator,
  DecoratorContainer,
  Heading,
  HorizontalCardsContainer,
} from 'components/ComboProductsContainer/styles';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { DiscountVerticalBanner, Sparkles } from 'assets/SvgIcons';

const ComboProductsContainer = ({ children }: TComboProductsContainer) => {
  const [viewEventRecorded, setViewEventRecorded] = useState(false);
  const ref = useRef(null);
  const isOnScreen = useOnScreen({ ref });

  useEffect(() => {
    if (isOnScreen && !viewEventRecorded) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: 'Combo Slice',
      });
      setViewEventRecorded(true);
    }
  }, [viewEventRecorded, isOnScreen]);

  return (
    <Container ref={ref}>
      <Heading>{strings.PC_EXP.COMBOS.HEADING}</Heading>
      <DecoratorContainer>
        <Decorator>
          <DiscountVerticalBanner />
          <span>{strings.PC_EXP.COMBOS.DESCRIPTOR_1}</span>
        </Decorator>
        <Decorator>
          <Sparkles />
          <span>{strings.PC_EXP.COMBOS.DESCRIPTOR_2}</span>
        </Decorator>
      </DecoratorContainer>
      <HorizontalCardsContainer>{children}</HorizontalCardsContainer>
    </Container>
  );
};

export default ComboProductsContainer;
