import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import { legacyBooleanCheck } from 'utils';
import Button from '../UI/Button';

const CTAWrapper = styled.div`
  margin: 30px 0px;
  text-align: ${({
    // @ts-expect-error TS(2339): Property 'align' does not exist on type 'Pick<Deta... Remove this comment to see the full error message
    align,
  }) => align};
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
 * CTAProps is an object with a text, link, align, fill, type, download, onclick_text, backink and embed property. The text and link
 * properties are required, and the rest are optional.
 * @example - {cta text="Read More" link="https://www.headout.com/" type="fillGradient" align="center"}
 * @property {string} text - The text that will be displayed in the button
 * @property {string} link - The URL to link to.
 * @property {string} align - left, right, center
 * @property {string} fill - The background color of the button. If fill is 'true' we use 'fillGradient'.
 * @property {string} type - The type of button. 'bordered' (default), 'whiteBordered', 'fill', 'fillGradient'.
 * @property {string} download - If you want to download a file, you can set this to 'true'.
 * @property {string} embed - If you want to generate embed code, you can set this to 'true'.
 * @property {string} backlink - The URL to which the embed code will link back to.
 *  * @property {string} onclick_text - The text that appears for 900 ms after clicking on the CTA.
 */

type CTAProps = {
  text: string;
  link: string;
  align?: string;
  fill?: string;
  type?: string;
  download?: string;
  embed?: string;
  backlink?: string;
  onclick_text?: string;
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
  embed,
  backlink,
  onclick_text,
}: CTAProps) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const isDownload = legacyBooleanCheck(download);
  const isEmbed = legacyBooleanCheck(embed);
  const anchorTagProps = isDownload
    ? {
        download: true,
      }
    : {
        target: '_blank',
        rel: 'noopener noreferrer',
      };

  useEffect(() => {
    async function fetchImageBlob(url: any) {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      setBlobUrl(blobUrl);
    }
    if (isDownload) fetchImageBlob(url);
  }, [url]);

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(
      `<a href="${backlink}"><img src="${url}" style="width:100%;height:100%;"></a>`
    );
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 800);
  };

  return (
    <>
      <CTAWrapper {...{ align }}>
        <Conditional if={isEmbed}>
          <Button
            onClick={() => {
              copyEmbedCode();
            }}
          >
            {!isCopied ? text : onclick_text}
          </Button>
        </Conditional>
        <Conditional if={!isEmbed}>
          {/* @ts-expect-error TS(2322): Type 'string | null' is not assignable to type 'st... Remove this comment to see the full error message */}
          <a href={isDownload ? blobUrl : url} {...anchorTagProps}>
            <Conditional if={isDownload}>{text}</Conditional>
            <Conditional if={!isDownload}>
              {/* @ts-expect-error TS(2769): No overload matches this call. */}
              <Button fillType={fill ? 'fillGradient' : type}>{text}</Button>
            </Conditional>
          </a>
        </Conditional>
      </CTAWrapper>
    </>
  );
};

export default CTA;
