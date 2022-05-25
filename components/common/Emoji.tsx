import React from 'react';

type EmojiProps = {
  symbol: string;
  label?: string;
};

const Emoji = ({ symbol, label }: EmojiProps) => (
  <span
    className="emoji"
    role="img"
    aria-label={label ? label : ''}
    aria-hidden={label ? 'false' : 'true'}
  >
    {symbol}
  </span>
);

export default Emoji;
