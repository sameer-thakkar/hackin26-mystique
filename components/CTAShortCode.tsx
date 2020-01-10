import React from "react";

const CTAShortCode = props => {
  const { text, link } = props;
  return (
    <>
      <div className="short-code-cta-container">
        <a href={link} target="_blank">
          <div className="short-code-cta">
            <span className="short-code-cta-text">{text}</span>
          </div>
        </a>
      </div>
    </>
  );
};
export default CTAShortCode;
