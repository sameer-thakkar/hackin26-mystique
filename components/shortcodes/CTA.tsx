import Conditional from 'components/common/Conditional';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { legacyBooleanCheck } from 'utils';

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
 * CTAProps is an object with a text, link, align, fill, type, and download property. The text and link
 * properties are required, and the rest are optional.
 * @example - {cta text="Read More" link="https://www.headout.com/" type="fillGradient" align="center"}
 * @property {string} text - The text that will be displayed in the button
 * @property {string} link - The URL to link to.
 * @property {string} align - left, right, center
 * @property {string} fill - The background color of the button. If fill is 'true' we use 'fillGradient'.
 * @property {string} type - The type of button. 'bordered' (default), 'whiteBordered', 'fill', 'fillGradient'.
 * @property {string} download - If you want to download a file, you can set this to 'true'.
 */

type CTAProps = {
  text: string;
  link: string;
  align?: string;
  fill?: string;
  type?: string;
  download?: string;
};

/**
 * It's a React component that renders a button or a link depending on the value of the `download` prop
 * @param {CTAProps}  - `text` - The text that will be displayed on the button.
 * @returns A component that renders a button or a link depending on the value of the download prop.
 */

const CTA = ({
  text,
  link: url,
  align = 'left',
  fill,
  type,
  download,
}: CTAProps) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const isDownload = legacyBooleanCheck(download);
  const anchorTagProps = isDownload
    ? {
        download: true,
      }
    : {
        target: '_blank',
        rel: 'noopener noreferrer',
      };

  useEffect(() => {
    async function fetchImageBlob(url) {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      setBlobUrl(blobUrl);
    }
    fetchImageBlob(url);
  }, [url]);

  return (
    <>
      <CTAWrapper {...{ align }}>
        <a href={isDownload ? blobUrl : url} {...anchorTagProps}>
          <Conditional if={isDownload}>{text}</Conditional>
          <Conditional if={!isDownload}>
            <Button fillType={fill ? 'fillGradient' : type}>{text}</Button>
          </Conditional>
        </a>
      </CTAWrapper>
    </>
  );
};

export default CTA;
