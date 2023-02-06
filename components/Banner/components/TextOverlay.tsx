import React, { MouseEventHandler } from 'react';
import Button from 'UI/Button';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';

import { ButtonWrapper } from '../__style';
import { ITextOverlay } from './interface';

const TextOverlay: React.FC<ITextOverlay> = (props) => {
  const { onClick, bannerHeading, hideCTA, bannerCtaText, isFirst } = props;

  const onButtonClick: MouseEventHandler<'button'> = (event) => {
    // Used to prevent touch end event on slider
    event.stopPropagation();

    onClick(event);
  };

  return (
    <div className="overlay-container">
      <div className={`mb-captions`}>
        <div className={`mb-caption active`}>
          <div className="caption">
            <Conditional if={isFirst}>
              <h1 dangerouslySetInnerHTML={{ __html: bannerHeading }} />
            </Conditional>
            <Conditional if={!isFirst}>
              <p dangerouslySetInnerHTML={{ __html: bannerHeading }} />
            </Conditional>
          </div>

          <Conditional if={!hideCTA}>
            <ButtonWrapper>
              <Button
                fillType="whiteBordered"
                // @ts-expect-error TS(2769): No overload matches this call.
                onClick={onButtonClick}
                fontSize={'1.125rem'}
              >
                {bannerCtaText || strings.BANNER_CTA}
              </Button>
            </ButtonWrapper>
          </Conditional>
        </div>
      </div>
    </div>
  );
};

export default TextOverlay;
