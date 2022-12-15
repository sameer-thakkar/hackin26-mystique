import React from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import Button from 'UI/Button';
import COLORS from 'const/colors';
import { CTA_TYPE } from 'const/index';
import { CHEVRON_LEFT } from 'assets/SvgIcons';

interface StyledCTAWrapperProps {
  $isButtonCTA?: boolean;
}
const CTAWrapper = styled.div<StyledCTAWrapperProps>`
  margin-top: ${({ $isButtonCTA }) => ($isButtonCTA ? '24px' : '7px')};
  a {
    text-decoration: none;
    color: ${COLORS.BRAND.PURPS};
  }
  svg {
    margin-left: 4px;
    transform: rotate(180deg);
    height: 11px;
    width: 11px;
    path {
      stroke-width: 4px;
      stroke: ${COLORS.BRAND.PURPS};
    }
  }
`;

const RichTextCTA = (block) => {
  const anchorTagProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
  };
  const { cta_type, cta_link, cta_text } = block || {};

  return (
    <CTAWrapper $isButtonCTA={cta_type === CTA_TYPE.BUTTON}>
      <a href={cta_link?.url} {...anchorTagProps}>
        <Conditional if={cta_type === CTA_TYPE.TEXT}>{cta_text}</Conditional>
        <Conditional if={cta_type === CTA_TYPE.BUTTON}>
          <Button minWidth={'180px'} borderWidth={'1px'}>
            {cta_text}
          </Button>
        </Conditional>
        {CHEVRON_LEFT}
      </a>
    </CTAWrapper>
  );
};

export default RichTextCTA;
