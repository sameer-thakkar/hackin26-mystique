import React from 'react';
import { Text } from '@headout/eevee';
import Conditional from 'components/common/Conditional';
import { DiscountTagOpener } from 'assets/discountTag';
import {
  discountTagContainer,
  discountTagTransformStyle,
  discountTextContainer,
  discountTextStyle,
} from './styles';
import type { TDiscountTag } from './types';

const DiscountTag = ({
  discountText,
  showAngledTag = true,
  shouldPointLeft = false,
}: TDiscountTag) => {
  return (
    <div
      className={discountTagContainer}
      data-qa-marker="discount-tag"
      data-show-angled-tag={showAngledTag}
      data-point-left={shouldPointLeft}
    >
      <Conditional if={showAngledTag && shouldPointLeft}>
        <DiscountTagOpener />
      </Conditional>
      <div
        className={discountTextContainer}
        data-show-angled-tag={showAngledTag}
        data-point-left={shouldPointLeft}
      >
        <Text
          className={discountTextStyle}
          textStyle="Semantics/UI Label/Small (Heavy)"
          color="semantic.surface.light.white"
        >
          {discountText}
        </Text>
      </div>
      <Conditional if={showAngledTag && !shouldPointLeft}>
        <DiscountTagOpener className={discountTagTransformStyle} />
      </Conditional>
    </div>
  );
};

export default DiscountTag;
