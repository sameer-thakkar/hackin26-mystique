import React, { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { strings } from 'const/strings';
import COLORS from 'const/colors';
import { expandFontToken } from 'const/typography';
import Image from 'UI/Image';
import Button from 'UI/Button';
import { CHEVRON_LEFT } from 'assets/SvgIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  FALLBACK_IMAGE,
  FALLBACK_IMAGES,
} from 'const/index';
import Conditional from 'components/common/Conditional';
import { trackEvent } from 'utils/analytics';
import { checkIfGpMotorTicketsMB } from 'utils/helper';
import type { SwiperProps } from 'swiper/react';
import { FONTS } from 'const/fonts';
import { MBContext } from 'contexts/MBContext';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const variantStyles = {
  'full-width': {
    gridTemplateColumns: '49% 51%',
    img: {
      height: '382',
    },
  },
  large: {
    gridTemplateColumns: '100%',
    img: {
      height: '382',
    },
  },
  small: {
    gridTemplateColumns: '100%',
    img: {
      height: '223',
    },
  },
};

const cardImageAspectRatio = {
  5: '16:10',
  4: '14:11',
  3: '7:4',
  2: '14:9',
  1: '16:9',
};

const StyledCard = styled.div((props) => {
  // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
  const { isGlobalMb, isGpMotorTicketsMb } = props || {};
  const styles = (props as any).isMobile
    ? variantStyles.small
    : // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      variantStyles[(props as any).cardType];
  const hasSingleCard = (props as any).cardsInARow === 1;
  const cardImgHeight = hasSingleCard
    ? '326px'
    : (props as any).cardsInARow === 4
    ? '180px'
    : '245px';
  let finalCardImgHeight;
  if (isGpMotorTicketsMb) {
    finalCardImgHeight = 'unset';
  } else if (isGlobalMb) {
    finalCardImgHeight = cardImgHeight;
  } else {
    finalCardImgHeight = `${styles.img.height}px`;
  }

  return `
  display: grid;
  position: relative;
  align-content: start;
  background: ${COLORS.BRAND.WHITE};
  box-shadow: ${isGlobalMb ? 'unset' : '0px 12px 20px rgba(0, 0, 0, 0.07)'};
  border: ${isGlobalMb ? 'unset' : `1px solid ${COLORS.GRAY.G7}`};
  border-radius: 8px;
  overflow: hidden;
  grid-template-columns: ${styles.gridTemplateColumns};
  text-decoration: none;
  height: 100%;
  ${(props as any).link && `cursor: pointer;`}
  .flex{
    display: flex;
  }
  .image-wrap {
    height: ${finalCardImgHeight};
    width: ${isGlobalMb && hasSingleCard ? '528px' : '100%'};
    border-radius: ${isGlobalMb ? '4px' : 'unset'};
    aspect-ratio: ${isGpMotorTicketsMb && !hasSingleCard ? '16/10' : 'unset'};

    span {
      min-width: 100%;
    }
  }
  img {
    object-fit: cover;
  }
  .card-content-section {
    padding: ${
      isGlobalMb ? (hasSingleCard ? '0 0 0 14px' : '16px 0 0 0') : '8px 16px'
    };
    * {
      margin-top: 0;
    }
    ul, ol {
      padding-inline-start: 20px;
    }
    p, li {
      ${expandFontToken('Paragraph/Medium')}
    }
    h3 {
      ${expandFontToken('Heading/Small')}
    }
    p {
      margin-bottom: ${isGlobalMb ? 0 : '16px'};
      color:  ${isGlobalMb ? COLORS.GRAY.G3 : 'inherit'};
    }
    a {
      color: ${COLORS.TEXT.CANDY_1};
      word-wrap: break-word;
    }
  }
  .card-content-section.link {
    padding-bottom: 42px;
  }
  .swiper-pagination.swiper-pagination-bullets {
    top: unset;
    display: block;
  }
  @media(max-width: 768px){
    grid-template-columns: auto;
    .image-wrap {
      height: ${isGlobalMb ? (hasSingleCard ? '220px' : '186px') : '223px'};
      width: 100%;
    }
    .card-content-section {
      ${isGlobalMb && `padding: 16px 0 0 0;`}
    }
  }
`;
});

const Title = styled.h3`
  ${expandFontToken('Subheading/Regular')}
  color: ${COLORS.GRAY.G2} !important;
  margin-bottom: 8px;
`;

const SwiperWrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: max-content;
`;

const ButtonWrapper = styled.div`
  margin: 24px 0 16px 0 !important;
  width: max-content;
  button {
    ${expandFontToken(FONTS.BUTTON_MEDIUM)}
  }
  @media (max-width: 768px) {
    margin-top: 16px;
  }
`;

const CTALink = styled.a`
  position: absolute;
  bottom: 0;
  color: ${COLORS.BRAND.CANDY} !important;
  ${expandFontToken('UI/Label Medium (Heavy)')}
  display: block;
  margin: 24px 0 16px 0 !important;
  svg {
    margin-left: 4px;
    transform: rotate(180deg);
    height: 11px;
    width: 11px;
    path {
      stroke-width: 4px;
      stroke: ${COLORS.BRAND.CANDY};
    }
  }
  @media (max-width: 768px) {
    margin-top: 16px;
  }
`;

type CardProps = {
  title: string;
  description: any[];
  images?: any;
  cta?: {
    link: {
      url: string;
      target: string;
    };
    text?: string;
    type: string;
  };
  type?: string;
  link?: any;
  linkType?: string;
  cardsInARow?: number;
  isGlobalMb?: boolean;
};

/**
 * A multi-variant card displaying an optional carousel of images and CTA along with a required title and body.
 *
 * Please see the <a href="https://headout.github.io/mystique/?path=/docs/slices-card--with-link-cta">Card Section</a> documentation to begin with.
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - *Card Title
 * - *Card Description
 *  - Rich Text field
 * - Card Link
 * - Card Link Type
 *  - 'Full Card' will make the entire card a link and 'Title' will only make the title a link
 * - CTA Type
 *  - Option between 'Button' or 'Link'
 * - CTA Text
 *  - If left blank will default to 'Book Now' if CTA Type is 'Button' and 'Read More' if CTA Type is 'Link'
 * - CTA Link
 *
 * **Note: If the CTA link field is left blank, the CTA won't appear.**
 *
 * ### Repeatable zone
 * - Image Source
 *  - Add your image from prismic
 *  - Additionally add an 'alt' field
 * - Image URL
 *  - Add a link to the image directly
 *  - Will take precedence over 'Image Source'
 * - Image Alt
 *  - 'alt' field for Image URL
 *  - Will take precedence over 'Image Source' alt
 */

const HyperLink = ({ children, data }: any) => {
  return (
    <a
      href={data.url}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
};

const Card: React.FC<CardProps> = ({
  title,
  description,
  images = [],
  cta = {},
  type = 'full-width',
  link = '',
  linkType = '',
  cardsInARow = 1,
  isGlobalMb,
}) => {
  const width = useWindowWidth();
  const [mounted, setMounted] = useState(false);

  const [isMobile, setIsMobile] = React.useState(false);
  const { uid } = useContext(MBContext);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    switch (type) {
      case 'full-width':
        setIsMobile(width <= 960);
        break;
      case 'large':
        setIsMobile(width <= 760);
        break;
      case 'small':
        setIsMobile(true);
        break;
      default:
        break;
    }
  }, [type, mounted]);

  const swiperParams: SwiperProps = {
    pagination: {
      type: 'bullets',
      clickable: true,
    },
  };

  const trackClickEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CONTENT_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.HEADING]: title,
    });
  };

  const isGpMotorTicketsMb = checkIfGpMotorTicketsMB(uid);
  let arIndex;
  if (isGlobalMb || isGpMotorTicketsMb) {
    arIndex = 5;
  } else if (cardsInARow > 4) {
    arIndex = 4;
  } else {
    arIndex = cardsInARow;
  }
  const aspectRatio =
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    cardImageAspectRatio[arIndex];
  const fallbackImage = isGlobalMb
    ? FALLBACK_IMAGES.THEMEPARKS
    : FALLBACK_IMAGE;
  let imageView;
  switch (images.length) {
    case 0:
      imageView = isGlobalMb ? (
        <Image
          url={fallbackImage}
          alt=""
          attribution=""
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          height={variantStyles[type].img.height}
          aspectRatio={aspectRatio}
          autoCrop={false}
        />
      ) : null;
      break;
    case 1:
      imageView = (
        <Image
          url={images[0].url || fallbackImage}
          alt={images[0]?.alt || ''}
          attribution={images[0]?.copyright}
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          height={variantStyles[type].img.height}
          aspectRatio={aspectRatio}
          autoCrop={false}
          fill
        />
      );
      break;
    default:
      imageView = (
        <SwiperWrapper>
          <Swiper {...swiperParams}>
            {images.map((image: any, index: number) => {
              return (
                <Image
                  className="swiper-slide"
                  key={index}
                  url={image.url || fallbackImage}
                  attribution={image?.copyright}
                  alt={image.alt || ''}
                  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                  height={variantStyles[type].img.height}
                  aspectRatio={aspectRatio}
                  autoCrop={false}
                />
              );
            })}
          </Swiper>
        </SwiperWrapper>
      );
      break;
  }

  let CTA;
  switch (cta.type) {
    case 'Button':
      CTA = (
        <ButtonWrapper>
          <object>
            <a
              // @ts-expect-error TS(2532): Object is possibly 'undefined'.
              href={cta.link.url}
              // @ts-expect-error TS(2532): Object is possibly 'undefined'.
              target={cta.link.target}
              onClick={(e) => e.stopPropagation()}
            >
              <Button>{cta.text || strings.BOOK_NOW_CTA}</Button>
            </a>
          </object>
        </ButtonWrapper>
      );
      break;
    case 'Link':
      CTA = (
        <CTALink
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          href={cta.link.url}
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          target={cta.link.target}
          onClick={(e) => {
            e.stopPropagation();
            trackClickEvent();
          }}
        >
          {cta.text || strings.BOOK_NOW_CTA}
          {CHEVRON_LEFT}
        </CTALink>
      );
  }
  const hasTextContent =
    title?.length > 0 || RichText.asText(description || []).length > 0;

  return (
    <StyledCard
      {...(linkType === 'Full Card' && {
        target: link?.target,
        href: link?.url,
        as: 'a',
        link: true,
      })}
      // @ts-expect-error TS(2769): No overload matches this call.
      isMobile={isMobile}
      cardType={type}
      isGlobalMb={isGlobalMb}
      cardsInARow={cardsInARow}
      isGpMotorTicketsMb={isGpMotorTicketsMb}
    >
      {imageView}
      {hasTextContent ? (
        <div className={`card-content-section${cta?.link?.url ? ` link` : ''}`}>
          <Conditional if={title}>
            <Title
              {...(linkType === 'Title' && {
                as: 'a',
                href: link.url,
                target: link.target,
              })}
              // @ts-expect-error TS(2769): No overload matches this call.
              isGlobalMb={isGlobalMb}
            >
              {title}
            </Title>
          </Conditional>
          <RichText
            elements={{
              hyperlink: HyperLink,
            }}
            render={description}
          />
          {cta?.link?.url ? CTA : null}
        </div>
      ) : null}
    </StyledCard>
  );
};

export default Card;
