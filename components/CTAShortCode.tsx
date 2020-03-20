import React from 'react';
import { COLORS } from '../constants/ui-constants';

const CTAShortCode = props => {
  const { text, link, align, fill } = props;
  return (
    <>
      <div className={`short-code-cta-container ${align ? align : ''} `}>
        <a href={link} target="_blank">
          <div className={`short-code-cta ${fill ? 'fill' : ''}`}>
            <span className="short-code-cta-text">{text}</span>
          </div>
        </a>
        <style jsx>{`
          .short-code-cta-container a {
            text-decoration: none;
          }
          .center {
            text-align: center;
          }
          .right {
            text-align: right;
          }
          .fill {
            background: ${COLORS.RHAPSODY};
            background: ${COLORS.RHAPSODY_GRADIENT};
            color: ${COLORS.WHITE};
          }
        `}</style>
      </div>
    </>
  );
};
export default CTAShortCode;
