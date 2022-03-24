import React from 'react';
import styled from 'styled-components';

import Button from '../UI/Button';

const CTAWrapper = styled.div`
  margin: 30px 0px;
  text-align: ${({ align }) => align};
  a {
    text-decoration: none;
  }
  @media (max-width: 768px) {
    button {
      font-size: 14px;
    }
  }
`;

/**
 *
 * Use the `cta` shortcode to embed a button with a link in any Rich Text field.
 *
 * Example Use:
 *
 * ```js
 * {cta text="Read More" link="https://www.headout.com/" type="fillGradient" align="center"}
 * ```
 *
 * Properties available:
 *
 * - `text`
 *  - The text inside the button (CTA)
 * - `link`
 *  - The link the CTA points too (regular link not a hyperlink)
 * - `type`
 *  - The type of button that will appear. Can be <a href="http://headout.github.io/mystique?path=/docs/ui-button--bordered">bordered</a>, <a href="http://headout.github.io/mystique?path=/docs/ui-button--fill">fill</a>, <a href="http://headout.github.io/mystique?path=/docs/ui-button--fill-gradient">fillGradient</a>, <a href="http://headout.github.io/mystique?path=/docs/ui-button--white-bordered">whiteBordered</a> (bordered is default)
 * - `align`
 *  - The alignment of the button. Can be 'center', 'left' or 'right'
 */

const CTA = (props) => {
  const { text, link, align, fill, type } = props;
  return (
    <CTAWrapper {...{ align }}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <Button fillType={fill ? 'fillGradient' : type}>{text}</Button>
      </a>
    </CTAWrapper>
  );
};

export default CTA;
