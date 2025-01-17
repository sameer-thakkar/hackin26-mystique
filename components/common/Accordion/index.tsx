import React, { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { CSSProp } from 'styled-components';
import Minus from 'assets/minus';
import Plus from 'assets/plus';
import Conditional from '../Conditional';
import {
  AccordionBody,
  AccordionContainer,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
} from './styles';

interface AccordionItemProps {
  header: ReactNode;
  body: ReactNode;
  isExpandable?: boolean;
  defaultExpanded?: boolean;
  isCollapsible?: boolean;
}

interface AccordionProps {
  items: AccordionItemProps[];
  containerStyles?: CSSProp;
  containerClassName?: string;
  itemStyles?: CSSProp;
  itemClassName?: string;
  onExpand?: (item: AccordionItemProps) => void;
  onCollapse?: (item: AccordionItemProps) => void;
}

const Accordion: FC<React.PropsWithChildren<AccordionProps>> = ({
  items,
  containerStyles,
  containerClassName,
  itemStyles,
  itemClassName,
}) => {
  const [openStates, setOpenStates] = useState<boolean[]>(
    items.map(({ isExpandable, defaultExpanded }) =>
      defaultExpanded && isExpandable ? true : false
    )
  );
  const [heights, setHeights] = useState<number[]>([]);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const initialHeights = bodyRefs.current.map((el) => el?.scrollHeight || 0);
    setHeights(initialHeights);
  }, [items.length]);

  const toggleItem = (
    index: number,
    isExpandable: boolean,
    isCollapsible: boolean
  ) => {
    if (!isExpandable || !isCollapsible) return;
    setOpenStates((prevOpenStates) => {
      const newOpenStates = [...prevOpenStates];
      newOpenStates[index] = !newOpenStates[index];
      return newOpenStates;
    });
  };

  return (
    <AccordionContainer
      className={containerClassName}
      $containerStyles={containerStyles}
    >
      {items.map((item, index) => {
        const {
          header,
          body,
          isExpandable = true,
          isCollapsible = true,
        } = item;
        const isOpen = openStates[index];

        return (
          <AccordionItem
            key={index}
            className={itemClassName}
            $itemStyles={itemStyles}
          >
            <AccordionHeader
              onClick={() => toggleItem(index, isExpandable, isCollapsible)}
            >
              {header}
              <Conditional if={isExpandable && isCollapsible}>
                <AccordionIcon>
                  {isOpen ? (
                    <Minus height={16} width={16} />
                  ) : (
                    <Plus height={16} width={16} />
                  )}
                </AccordionIcon>
              </Conditional>
            </AccordionHeader>
            <AccordionBody
              ref={(el: any) => {
                bodyRefs.current[index] = el;
              }}
              $isOpen={isOpen}
              $height={isOpen ? heights[index] : 0}
            >
              {body}
            </AccordionBody>
          </AccordionItem>
        );
      })}
    </AccordionContainer>
  );
};

export default Accordion;
