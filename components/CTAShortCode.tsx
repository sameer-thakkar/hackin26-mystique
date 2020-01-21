import React from "react";

const CTAShortCode = props => {
  const { text, link, align } = props;
  return (
    <>
      <div className={`short-code-cta-container ${align ? align : ""}`}>
        <a href={link} target="_blank">
          <div className="short-code-cta">
            <span className="short-code-cta-text">{text}</span>
          </div>
        </a>
        <style jsx>{`
          .center {
            text-align: center;
          }
          .right {
            text-align: right;
          }
        `}</style>
      </div>
    </>
  );
};
export default CTAShortCode;
