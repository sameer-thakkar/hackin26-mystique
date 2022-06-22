import React from 'react';
import { RichText } from 'prismic-reactjs';
import Conditional from 'components/common/Conditional';
import RichTextCTA from 'UI/RichTextCTA';
import { shortCodeSerializer } from 'utils/shortCodes';

const RichtextWithCTA = (props) => {
  return (
    <>
      {props.slices.map((block, index) => (
        <>
          <RichText
            key={index}
            render={block?.text}
            htmlSerializer={shortCodeSerializer}
          />
          <Conditional if={block?.cta_text}>
            <RichTextCTA {...block} />
          </Conditional>
        </>
      ))}
    </>
  );
};
export default RichtextWithCTA;
