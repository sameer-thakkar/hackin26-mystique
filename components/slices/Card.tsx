import React from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import { RichText } from 'prismic-reactjs';
import { strings } from 'const/strings';
import { COLORS, SOLEIL } from 'const/ui-constants';
import Image from 'UI/Image';
import Button from 'UI/Button';
import { CHEVRON_LEFT } from 'assets/SvgIcons';
import { ANALYTICS_EVENTS, FALLBACK_IMAGE, FALLBACK_IMAGES } from 'const/index';
import Conditional from 'components/common/Conditional';
import { trackEvent } from 'utils/analytics';

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
  const { isGlobalMb } = props || {};
  const styles = props.isMobile
    ? variantStyles.small
    : variantStyles[props.cardType];
  const hasSingleCard = props.cardsInARow === 1;
  const cardImgHeight = hasSingleCard
    ? '326px'
    : props.cardsInARow === 4
    ? '180px'
    : '245px';
  return `
  display: grid;
  align-content: start;
  background: ${COLORS.WHITE};
  box-shadow: ${isGlobalMb ? 'unset' : '0px 12px 20px rgba(0, 0, 0, 0.07)'};
  border: ${isGlobalMb ? 'unset' : `1px solid ${COLORS.CHALK}`};
  grid-template-columns: ${styles.gridTemplateColumns};
  height: calc(100% - 2px);
  text-decoration: none;
  ${props.link && `cursor: pointer;`}
  .flex{
    display: flex;
  }
  img {
    height:${isGlobalMb ? cardImgHeight : `${styles.img.height}px`};
    width: ${isGlobalMb ? (hasSingleCard ? '528px' : '100%') : '100%'};
    object-fit: cover;
    ${isGlobalMb && `border-radius: 4px;`}
  }
  .card-content-section {
    padding: ${
      isGlobalMb
        ? hasSingleCard
          ? '0 0 0 14px'
          : '16px 0 0 0'
        : '16px 16px 0 16px'
    };
    * {
      margin-top: 0;
    }
    ul, ol {
      padding-inline-start: 20px;
    }
    p, li {
      font-size: ${isGlobalMb ? '14px' : '16px'};
      line-height: ${isGlobalMb ? '20px' : '160%'};
      font-family: ${SOLEIL.FONT_STACK};
    }
    p {
      margin-bottom: ${isGlobalMb ? 0 : '16px'};
      color:  ${isGlobalMb ? COLORS.GREY_G3 : 'inherit'};
    }
    a {
      color: ${COLORS.LIGHTER_LINK_BLUE};
      word-wrap: break-word;
    }
  }
  .swiper-pagination.swiper-pagination-bullets {
    top: unset;
    display: block;
  }
  @media(max-width: 768px){
    grid-template-columns: auto;
    img{
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
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: ${({ isGlobalMb }) =>
    isGlobalMb ? `${SOLEIL.SEMIBOLD}` : `${SOLEIL.BOLD}`};
  font-size: ${({ isGlobalMb }) => (isGlobalMb ? '16px' : '20px')};
  line-height: ${({ isGlobalMb }) => (isGlobalMb ? '20px' : '27px')};
  text-decoration: none;
  color: ${({ isGlobalMb }) =>
    isGlobalMb ? `${COLORS.GREY.G2}` : `${COLORS.DAVY_GREY}`} !important;
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
  @media (max-width: 768px) {
    margin-top: 16px;
  }
`;

const CTALink = styled.a`
  color: ${({ theme }) => theme.primaryColor} !important;
  font-weight: ${SOLEIL.SEMIBOLD};
  font-family: ${SOLEIL.FONT_STACK};
  display: block;
  margin: 24px 0 16px 0 !important;
  svg {
    margin-left: 4px;
    transform: rotate(180deg);
    height: 11px;
    width: 11px;
    path {
      stroke-width: 4px;
      stroke: ${({ theme }) => theme.primaryColor};
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

const HyperLink = ({ children, data }) => {
  return (
    <a href={data.url} onClick={(e) => e.stopPropagation()}>
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
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
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
  }, [type, setIsMobile, width]);

  const swiperParams = {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    shouldSwiperUpdate: true,
  };

  const trackClickEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CONTENT_CARD_CLICKED,
    });
  };

  const aspectRatio =
    cardImageAspectRatio[isGlobalMb ? 5 : cardsInARow > 4 ? 4 : cardsInARow];
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
          height={variantStyles[type].img.height}
          isCardSlices
          aspectRatio={aspectRatio}
          autoCrop={false}
        />
      ) : null;
      break;
    case 1:
      imageView = (
        <Image
          url={images[0].url || fallbackImage}
          alt={images[0].alt}
          attribution={images[0]?.copyright}
          height={variantStyles[type].img.height}
          isCardSlices
          aspectRatio={aspectRatio}
          autoCrop={false}
        />
      );
      break;
    default:
      imageView = (
        <SwiperWrapper>
          <Swiper {...swiperParams}>
            {images.map((image, index) => {
              return (
                <Image
                  className="swiper-slide"
                  key={index}
                  url={image.url || fallbackImage}
                  attribution={image?.copyright}
                  alt={image.alt}
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
          <a
            href={cta.link.url}
            target={cta.link.target}
            onClick={(e) => e.stopPropagation()}
          >
            <Button>{cta.text || strings.BOOK_NOW_CTA}</Button>
          </a>
        </ButtonWrapper>
      );
      break;
    case 'Link':
      CTA = (
        <CTALink
          href={cta.link.url}
          target={cta.link.target}
          onClick={(e) => e.stopPropagation()}
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
      isMobile={isMobile}
      cardType={type}
      isGlobalMb={isGlobalMb}
      cardsInARow={cardsInARow}
      onClick={trackClickEvent}
    >
      {imageView}
      {hasTextContent ? (
        <div className="card-content-section">
          <Conditional if={title}>
            <Title
              {...(linkType === 'Title' && {
                as: 'a',
                href: link.url,
                target: link.target,
              })}
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
