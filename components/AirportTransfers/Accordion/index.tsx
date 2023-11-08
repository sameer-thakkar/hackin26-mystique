import { useEffect, useState } from 'react';
import Conditional from 'components/common/Conditional';
import Chevron from 'UI/Chevron';
import { IAccordionProps } from './interface';
import {
  AccordionWrapper,
  ContentBlock,
  HeaderWrapper,
  IconWrapper,
} from './styles';

const Accordion = ({
  header,
  children,
  customIcon,
  isAccordionPanelOpen,
  clickEvent,
  ignoredElementsForClickBubbling = ['a', 'button', 'input', 'iframe'],
  clickableRegion = 'whole',
  isDisabled = false,
  isDesktop = true,
  openHandler,
  isFirst = false,
  isLast = false,
}: IAccordionProps) => {
  const [isOpen, setOpen] = useState(false || !!isAccordionPanelOpen);

  useEffect(() => {
    setOpen(!!isAccordionPanelOpen);
  }, [isAccordionPanelOpen]);

  const handleClick = (e: any) => {
    if (!isDisabled) {
      if (ignoredElementsForClickBubbling.includes(e.target.localName)) {
        return;
      }
      setOpen((c) => !c);
      if (openHandler) {
        openHandler.handleSelection(openHandler.currentStep, !isOpen);
      }
      clickEvent?.({ accordionState: isOpen });
    }
  };
  return (
    <AccordionWrapper
      isOpen={isOpen}
      isWholeAccordionClickable={clickableRegion === 'whole'}
      onClick={
        isDisabled || clickableRegion !== 'whole' ? undefined : handleClick
      }
      isDisabled={isDisabled}
      isDesktop={isDesktop}
    >
      <HeaderWrapper
        role="button"
        isDisabled={isDisabled}
        isDesktop={isDesktop}
        isOpen={isOpen}
      >
        {header}

        <Conditional if={!isDisabled}>
          <IconWrapper isOpen={isOpen} isDesktop={isDesktop} isFirst={isFirst}>
            {customIcon ? customIcon : <Chevron />}
          </IconWrapper>
        </Conditional>
      </HeaderWrapper>

      <ContentBlock
        isOpen={isOpen}
        isDesktop={isDesktop}
        isLast={isLast}
        isFirst={isFirst}
      >
        {children}
      </ContentBlock>
    </AccordionWrapper>
  );
};

export default Accordion;
