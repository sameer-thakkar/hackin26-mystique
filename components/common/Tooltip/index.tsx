import React, { useState } from 'react';
import { Button } from '@headout/aer';
import Conditional from 'components/common/Conditional';
import { TooltipProps } from 'components/common/Tooltip/interface';
import {
  ButtonWrapper,
  CloseIcon,
  Content,
  TooltipContainer,
  TooltipOverlay,
  TooltipSwipeSheet,
  Trigger,
} from 'components/common/Tooltip/styles';
import { isMobile } from 'utils/helper';
import { strings } from 'const/strings';
import { SWEIPESHEET_CROSS } from 'assets/SvgIcons';

const Tooltip = ({
  trigger,
  heading,
  content,
  showClose = true,
  onHover = () => {},
  triggerClassName,
  showHeadingForDesktop,
  showCTA = false,
}: TooltipProps) => {
  const [swipeSheetOpen, setSwipeSheetOpen] = useState(false);
  const mobile = isMobile();

  const handleClose = () => setSwipeSheetOpen(false);
  const handleOpen = () => {
    setSwipeSheetOpen(true);
    onHover();
  };
  return mobile ? (
    <>
      <Trigger onClick={handleOpen} className={`trigger ${triggerClassName}`}>
        {trigger}
      </Trigger>
      <Conditional if={swipeSheetOpen}>
        <TooltipOverlay onClick={handleClose} />
        <TooltipSwipeSheet topMargin={!heading} className="tooltip-swipesheet">
          <Conditional if={heading}>
            <div className="swipe-sheet-header">{heading}</div>
            <hr />
          </Conditional>
          <Conditional if={showClose}>
            <CloseIcon onClick={handleClose}>{SWEIPESHEET_CROSS}</CloseIcon>
          </Conditional>
          <div
            className="swipe-sheet-content"
            dangerouslySetInnerHTML={{ __html: content || '' }}
          />
          <Conditional if={showCTA}>
            <ButtonWrapper>
              <Button
                tabIndex={0}
                size="medium"
                color="purps"
                variant="primary"
                onClick={handleClose}
                text={strings.HOHO.GOT_IT}
              />
            </ButtonWrapper>
          </Conditional>
        </TooltipSwipeSheet>
      </Conditional>
    </>
  ) : (
    <TooltipContainer className="tooltip-container">
      <Trigger onMouseEnter={onHover} className={`trigger ${triggerClassName}`}>
        {trigger}
      </Trigger>
      <Content className="tooltip">
        <Conditional if={heading && showHeadingForDesktop}>
          <div className="tooltip-heading">{heading}</div>
        </Conditional>
        <div
          className="tooltip-content"
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </Content>
    </TooltipContainer>
  );
};

export default Tooltip;
