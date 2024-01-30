import React from 'react';
import { AvailableTodayBoosterWrapper } from 'components/Product/styles';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import Calendar from 'assets/calendar';

export const AvailableTodayBooster = () => {
  return (
    <AvailableTodayBoosterWrapper>
      <Calendar strokeColor={COLORS.TEXT.OKAY_GREEN_3} />
      {strings.AVAILABLE} {strings.TODAY}
    </AvailableTodayBoosterWrapper>
  );
};
