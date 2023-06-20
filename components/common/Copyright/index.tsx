import React from 'react';
import Emoji from 'components/common/Emoji';
import { StyledCopyrightContainer } from 'components/common/Copyright/styles';
import { strings } from 'const/strings';

const Copyright = () => {
  return (
    <StyledCopyrightContainer>
      <div>{strings.FOOTER.COPYRIGHT}</div>
      <div>
        {strings.FOOTER.MADE_WITH}
        <Emoji symbol="❤️" label="red-heart" />
        {strings.FOOTER.ALL_OVER_THE}
        <Emoji symbol="🌎" label="globe" />
      </div>
    </StyledCopyrightContainer>
  );
};

export default Copyright;
