import { CTA_TYPE } from 'constants/index';

import Conditional from 'components/common/Conditional';
import React from 'react';
import styled from 'styled-components';
import Button from 'UI/Button';
import COLORS from 'const/colors';

const CTAWrapper = styled.div`
  margin: 7px 0px;
  a {
    text-decoration: none;
    color: ${COLORS.BRAND.PURPS};
  }
`;

const RichTextCTA = (block) => {
  const anchorTagProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
  };
  const { cta_type, cta_link, cta_text } = block || {};

  return (
    <CTAWrapper>
      <a href={cta_link?.url} {...anchorTagProps}>
        <Conditional if={cta_type === CTA_TYPE.TEXT}>{cta_text}</Conditional>
        <Conditional if={cta_type === CTA_TYPE.BUTTON}>
          <Button minWidth={'180px'} borderWidth={'1px'}>
            {cta_text}
          </Button>
        </Conditional>
      </a>
    </CTAWrapper>
  );
};

export default RichTextCTA;
