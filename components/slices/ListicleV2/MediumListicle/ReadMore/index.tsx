import { useLayoutEffect, useState } from 'react';
import { IReadMoreProps } from 'components/slices/ListicleV2/MediumListicle/ReadMore/interfaces';
import {
  ReadMoreBox,
  ReadMoreIconWrapper,
  ReadMoreTextWrapper,
  ReadMoreWrapper,
} from 'components/slices/ListicleV2/MediumListicle/ReadMore/styles';
import { SETTINGS_TYPE } from 'const/index';
import { strings } from 'const/strings';

const ReadMore = ({ text, onClick, icon, settings, index }: IReadMoreProps) => {
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    const imageHeight = 214;
    const listicleContentContainer = document.querySelector(
      `.medium-listicle-container-${index}`
    );
    if (listicleContentContainer) {
      setTop(listicleContentContainer.scrollHeight + imageHeight - 20);
    }
  }, []);

  return (
    <ReadMoreBox isReadMore={text === strings.READ_MORE} top={top}>
      <ReadMoreWrapper
        onClick={onClick}
        isReadMore={text === strings.READ_MORE}
        isSettingsTwo={settings === SETTINGS_TYPE.SETTINGS_TWO}
      >
        <ReadMoreTextWrapper isReadMore={text === strings.READ_MORE}>
          {text}
        </ReadMoreTextWrapper>
        <ReadMoreIconWrapper>{icon}</ReadMoreIconWrapper>
      </ReadMoreWrapper>
    </ReadMoreBox>
  );
};
export default ReadMore;
