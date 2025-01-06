import React, { memo, useState } from 'react';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import { FilledLinkToWebField, RTNode } from '@prismicio/types';
import Conditional from 'components/common/Conditional';
import RichTextCTA from 'UI/RichTextCTA';
import { generateSidenavId } from 'utils/helper';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import COLORS from 'const/colors';
import { SLICE_TYPES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import ChevronDown from 'assets/chevronDown';
import type { ContentFrameworkDocumentDataBodyRichTextSliceItem } from '../../types.prismic';

const Wrapper = styled.div<{
  $isExpanded: boolean;
  $contentHeight: number | null;
  $hasCTA: boolean;
  $noParagraphMargin: boolean;
}>`
  position: relative;
  .rich-text {
    ${({ $isExpanded, $contentHeight }) =>
      !$isExpanded && `height: ${$contentHeight}px;`}
    ${({ $contentHeight }) => $contentHeight && `margin-bottom: -6px;`}
    ${({ $isExpanded }) => !$isExpanded && `overflow: hidden;`}
    ${({ $noParagraphMargin }) =>
      $noParagraphMargin &&
      `
      p {
        margin: 0;
      }
    `}
  }
  .fadeout {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 100%
    );
    ${({ $isExpanded }) => $isExpanded && `display: none;`}
  }
  .toggle {
    position: absolute;
    button {
      border: none;
      background: none;
      cursor: pointer;
      ${expandFontToken('Paragraph/Large')};
      color: ${COLORS.TEXT.CANDY_1};
      padding: 0;
    }
    svg {
      path {
        stroke: ${COLORS.TEXT.CANDY_1};
      }
      margin-bottom: -2px;
      padding: 0 7px;
      ${({ $isExpanded }) => $isExpanded && ` transform: rotate(180deg);`}
    }
  }
  @media (max-width: 768px) {
    .rich-text {
      height: ${({ $isExpanded, $contentHeight, $hasCTA }) =>
        $contentHeight && $hasCTA && !$isExpanded
          ? `${2 * $contentHeight}px`
          : '100%'};
      margin-bottom: unset;
    }
  }
`;

const RichTextWithCTAItem = ({
  isExpanded,
  block,
  handleClick,
  isMobile,
}: {
  isExpanded: boolean;
  block: ContentFrameworkDocumentDataBodyRichTextSliceItem;
  handleClick: () => void;
  isMobile: boolean;
}) => {
  const {
    content_height: contentHeight,
    cta_text,
    text: textArray,
    image_url,
    mobile_image_url,
    image_alt,
  } = block || {};
  const [imageId] = useState<string>(
    (Math.random() + 1).toString(36).substring(7)
  );
  const imageUrl: string | null = (image_url as FilledLinkToWebField)?.url;
  const mobileImageUrl: string | null = (
    mobile_image_url as FilledLinkToWebField
  )?.url;
  const finalImageUrl: string | null = isMobile
    ? mobileImageUrl ?? imageUrl
    : imageUrl;

  const headingArray = (textArray as RTNode[])?.reduce<string[]>((acc, el) => {
    el?.type === 'heading2' && acc.push(el?.text);

    return acc;
  }, []);

  const hasIframe = textArray?.some(
    (el) => el?.type === 'paragraph' && el?.text?.includes('{iframe')
  );

  /**
   * Image URL parameter is added to rich-text to allow embedding scorpio media
   * instead of Prismic's CDN image uploads.
   *
   * This is done ensure smooth migration of image fields from Prismic to Payload
   * since we don't want to move prismic URLs to payload.
   */
  if (finalImageUrl) {
    (textArray as RTNode[]).push({
      type: 'image',
      copyright: null,
      alt: image_alt,
      url: finalImageUrl,
      id: imageId,
      edit: {
        background: 'transparent',
        x: 0,
        y: 0,
        zoom: 1,
      },
      dimensions: {
        width: 1200,
        height: 750,
      },
    });
  }

  return (
    <Wrapper
      $isExpanded={isExpanded}
      $contentHeight={contentHeight}
      $hasCTA={!!cta_text}
      $noParagraphMargin={hasIframe}
    >
      <div className="rich-text" id={generateSidenavId(headingArray?.[0])}>
        <PrismicRichText
          field={textArray}
          components={(...defaultArgs: any) =>
            shortCodeSerializerWithParentProps(defaultArgs, {
              sectionName: headingArray?.[0],
              sliceType: SLICE_TYPES.RICH_TEXT,
            })
          }
        />
      </div>
      <Conditional if={cta_text}>
        <RichTextCTA {...block} />
      </Conditional>
      <Conditional if={contentHeight}>
        <div className="fadeout" />
        <span className="toggle">
          <button onClick={handleClick} className="view-more">
            {isExpanded ? strings.SHOW_LESS_TEXT : strings.VIEW_MORE}
            <ChevronDown />
          </button>
        </span>
      </Conditional>
    </Wrapper>
  );
};

const RichtextWithCTA = memo(
  (props: {
    childSlices: ContentFrameworkDocumentDataBodyRichTextSliceItem[];
    isMobile: boolean;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const handleClick = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <>
        {props?.childSlices?.map((block, index) => {
          return (
            <React.Fragment key={index}>
              <RichTextWithCTAItem
                block={block}
                isExpanded={isExpanded}
                handleClick={handleClick}
                isMobile={props.isMobile}
              />
            </React.Fragment>
          );
        })}
      </>
    );
  }
);

RichtextWithCTA.displayName = 'RichtextWithCTA';

export default RichtextWithCTA;
