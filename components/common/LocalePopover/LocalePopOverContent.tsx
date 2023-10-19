import React from 'react';
import Conditional from 'components/common/Conditional';
import { ILocalePopOverContent } from 'components/common/LocalePopover/interface';
import { StyledContentValue } from 'components/common/LocalePopover/styles';
import COLORS from 'const/colors';
import { TickSvg } from 'assets/SvgIcons';

function LocalePopOverContent({ section }: ILocalePopOverContent) {
  return (
    <>
      {section.options?.map((item: any) => {
        return (
          <StyledContentValue
            key={item.code}
            $isSelected={item.value === section.currentValue}
            {...item.itemProps}
            onClick={(event) => {
              section.onClick(event, item);
            }}
          >
            <div className="text-content">
              <div className="main-text">{item.label}</div>
              <div className="sub-text">{item.subLabel}</div>
            </div>
            <Conditional if={item.value === section.currentValue}>
              <TickSvg strokeColor={COLORS.BRAND.PURPS} />
            </Conditional>
          </StyledContentValue>
        );
      })}
    </>
  );
}

export default LocalePopOverContent;
