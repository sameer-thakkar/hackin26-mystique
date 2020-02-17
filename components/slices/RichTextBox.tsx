import React from 'react';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from '../../utils/shortCodes';

const RichTextBox = props => {
  return (
    <div className="rich-text-box-wrapper">
      {props.slices.map((block, index) => (
        <div className="rich-text-box">
          <RichText
            key={index}
            render={block.content}
            htmlSerializer={shortCodeSerializer}
          />
        </div>
      ))}
    </div>
  );
};
export default RichTextBox;
