import { SWEIPESHEET_CROSS } from 'assets/SvgIcons';
import Conditional from 'components/common/Conditional';
import { TooltipProps } from 'components/common/Tooltip/interface';
import {
  TooltipContainer,
  Trigger,
  Content,
  TooltipSwipeSheet,
  TooltipOverlay,
  CloseIcon,
} from 'components/common/Tooltip/styles';
import React, { useState } from 'react';
import { isMobile } from 'utils/helper';

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
