import React, { useState } from 'react';
import Conditional from 'components/common/Conditional';
import { TooltipProps } from 'components/common/Tooltip/interface';
import {
  CloseIcon,
  Content,
  TooltipContainer,
  TooltipOverlay,
  TooltipSwipeSheet,
  Trigger,
} from 'components/common/Tooltip/styles';
import { isMobile } from 'utils/helper';
import { SWEIPESHEET_CROSS } from 'assets/SvgIcons';

const Tooltip = ({
  trigger,
  heading,
  content,
  showClose = true,
  onHover = () => {},
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
      <Trigger onClick={handleOpen}>{trigger}</Trigger>
      <Conditional if={swipeSheetOpen}>
        <TooltipOverlay onClick={handleClose} />
        <TooltipSwipeSheet topMargin={!heading}>
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
        </TooltipSwipeSheet>
      </Conditional>
    </>
  ) : (
    <TooltipContainer>
      <Trigger onMouseEnter={onHover}>{trigger}</Trigger>
      <Content className="tooltip">
        <div className="tooltip-heading">{heading}</div>
        <div
          className="tooltip-content"
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </Content>
    </TooltipContainer>
  );
};

export default Tooltip;
