import React from 'react';

type Props = {
  id?: string;
  className?: string;
  onClick?: (...args: any[]) => any;
  children?: React.ReactNode;
  style?: any;
  testId?: string;
};

/**
 * Localized span component
 * Disable google-translate by default
 */
const LSpan = ({ id, className, onClick, children, style, testId }: Props) => (
  <span
    {...(testId && { 'data-testid': testId })}
    id={id}
    role="button"
    tabIndex={0}
    className={`notranslate ${className || ''}`}
    onClick={onClick}
    style={style}
  >
    {children}
  </span>
);

export default LSpan;
