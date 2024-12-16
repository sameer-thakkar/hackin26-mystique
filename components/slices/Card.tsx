import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { asText } from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import { modalStyles } from 'components/NewsPage/components/Trailer/components/MediaPlayer/styles';
import Button from 'UI/Button';
import Image from 'UI/Image';
import Video from 'UI/Video';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { checkIfGpMotorTicketsMB } from 'utils/helper';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  FALLBACK_IMAGE,
  FALLBACK_IMAGES,
  SLICE_TYPES,
  VIDEO_POSITIONS,
} from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import ChevronLeft from 'assets/chevronLeft';
import PlayIconFilled from 'assets/playIconFilled';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });
const VideoPlayer = dynamic(() => import('components/common/VideoPlayer'));

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
type TVariantStylesProperties = keyof typeof variantStyles;

const cardImageAspectRatio = {
  5: '16:10',
  4: '14:11',
  3: '7:4',
  2: '14:9',
  1: '16:9',
};

const CardTitleStyles = `
  ${expandFontToken(FONTS.HEADING_SMALL)}
  color: ${COLORS.GRAY.G2} !important;
  display: inline-block;
  margin-bottom: 8px;
`;

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
    span[role='button'] {
      color: ${COLORS.TEXT.CANDY_1};
    }
  }
  .card-content-section.link {
    padding-bottom: 42px;
    .title-link {
      ${CardTitleStyles}
    }
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
  ${CardTitleStyles}
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  svg {
    cursor: pointer;
    position: absolute;
  }
`;

const SwiperWrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: max-content;
  .swiper {
    width: 100%;
  }
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
  color: ${COLORS.TEXT.CANDY_1} !important;
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
      stroke: ${COLORS.TEXT.CANDY_1};
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
  isMobile: boolean;
  sectionName?: string;
  isSeatMapExpControlAndEligible?: boolean;
};

type PlayIconProps = {
  isVideoUrl: boolean;
  onClick: () => void;
};

type MediaProps = {
  title: string;
  url: string;
  alt: string;
  copyright: string;
  fallbackImage: string;
  aspectRatio: string;
  video: string;
  type: string;
  modalIsOpen: boolean;
  isMobile: boolean;
  videoPlay: boolean;
  setModalOpen: (a: boolean) => void;
  closeModal: () => void;
  setVideoPlay: (a: boolean) => void;
  setActiveMediaIndex: () => void;
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

const PLAY_ICON_JSX = ({ isVideoUrl, onClick }: PlayIconProps) => (
  <Conditional if={isVideoUrl}>
    <PlayIconFilled onClick={onClick} />
  </Conditional>
);

const Media = ({
  title,
  url,
  alt,
  copyright,
  fallbackImage,
  aspectRatio,
  video,
  type,
  setModalOpen,
  modalIsOpen,
  closeModal,
  isMobile,
  videoPlay,
  setVideoPlay,
  setActiveMediaIndex,
}: MediaProps) => {
  const handlePlayIconClick = () => {
    setActiveMediaIndex();
    isMobile ? setVideoPlay(true) : setModalOpen(true);
    trackEvent({
      eventName: ANALYTICS_EVENTS.VIDEO_PLAYER_OPENED,
      [ANALYTICS_PROPERTIES.SECTION]: title,
    });
    // Triggering this at the same time because video is in autoplay.
    trackEvent({
      eventName: ANALYTICS_EVENTS.YT_VIDEO_PLAYED,
      [ANALYTICS_PROPERTIES.SECTION]: title,
    });
  };

  return (
    <>
      <Conditional if={!isMobile && modalIsOpen}>
        <Modal
          style={modalStyles}
          onRequestClose={closeModal}
          isOpen={modalIsOpen}
        >
          <VideoPlayer
            videoUrl={video}
            videoTitle={''}
            closePlayer={closeModal}
          />
        </Modal>
      </Conditional>
      <ImageContainer>
        <Conditional if={videoPlay}>
          <Video
            key={url}
            url={video}
            fallbackImage={{
              url: '',
              altText: '',
            }}
            imageHeight={
              variantStyles[type as TVariantStylesProperties].img.height
            }
            imageAspectRatio={aspectRatio}
            dontLazyLoadImage={false}
            videoPosition={VIDEO_POSITIONS.PRODUCT_CARD}
            shouldVideoPlay
            // For future devs: If anytime the autoplay is changed. Make sure to change the logic of 'YT_VIDEO_PlAYED' event.
            shouldAutoPlay
            pauseOnclick
            showPlayIcon={false}
            showPauseIcon={false}
            isMobile
            onPause={() => setVideoPlay(false)}
          />
        </Conditional>
        <Conditional if={!videoPlay}>
          <Image
            url={url || fallbackImage}
            alt={alt || ''}
            attribution={copyright}
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            height={variantStyles[type].img.height}
            aspectRatio={aspectRatio}
            autoCrop={true}
            fill
            loadHigherQualityImage={true}
          />
          <PLAY_ICON_JSX isVideoUrl={!!video} onClick={handlePlayIconClick} />
        </Conditional>
      </ImageContainer>
    </>
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
  isMobile,
  sectionName,
  isSeatMapExpControlAndEligible,
}) => {
  const [modalIsOpen, setModalOpen] = useState(false);
  const [videoPlay, setVideoPlay] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(-1);
  const { uid } = useContext(MBContext);

  const swiperParams: SwiperProps = {
    lazy: true,
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

  const closeModal = () => {
    setModalOpen(false);
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
          loadHigherQualityImage={true}
        />
      ) : null;
      break;
    case 1:
      imageView = (
        <Media
          title={title}
          url={images[0]?.url}
          alt={images[0]?.alt}
          copyright={images[0]?.copyright}
          video={images[0]?.video}
          type={type}
          fallbackImage={fallbackImage}
          aspectRatio={aspectRatio}
          setModalOpen={setModalOpen}
          isMobile={isMobile}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          videoPlay={videoPlay && activeMediaIndex === 0}
          setVideoPlay={setVideoPlay}
          setActiveMediaIndex={() => setActiveMediaIndex(0)}
        />
      );
      break;
    default:
      imageView = (
        <SwiperWrapper>
          <Swiper {...swiperParams}>
            {images.map((image: any, index: number) => {
              return (
                <Media
                  title={title}
                  key={index + image?.url}
                  url={image?.url}
                  alt={image?.alt}
                  copyright={image?.copyright}
                  video={image?.video}
                  type={type}
                  fallbackImage={fallbackImage}
                  aspectRatio={aspectRatio}
                  setModalOpen={setModalOpen}
                  isMobile={isMobile}
                  modalIsOpen={modalIsOpen}
                  closeModal={closeModal}
                  videoPlay={videoPlay && activeMediaIndex === index}
                  setVideoPlay={setVideoPlay}
                  setActiveMediaIndex={() => setActiveMediaIndex(index)}
                />
              );
            })}
          </Swiper>
        </SwiperWrapper>
      );
      break;
  }

  const handleCTAButtonClick = (e: any) => {
    e.stopPropagation();

    if (
      cta.text === strings.THEATRE_PAGE.FIND_BEST_SEATS &&
      isSeatMapExpControlAndEligible
    ) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
        [ANALYTICS_PROPERTIES.CTA_TYPE]:
          ANALYTICS_EVENTS.SEATMAP_EXPERIMENT.FIND_BEST_SEATS,
        [ANALYTICS_PROPERTIES.SECTION]: ANALYTICS_PROPERTIES.HEADER,
      });
    }
  };

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
              onClick={handleCTAButtonClick}
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
          {ChevronLeft}
        </CTALink>
      );
  }
  const hasTextContent =
    title?.length > 0 || asText((description as []) || []).length > 0;

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
                className: 'title-link',
              })}
              // @ts-expect-error TS(2769): No overload matches this call.
              isGlobalMb={isGlobalMb}
            >
              {title}
            </Title>
          </Conditional>
          <PrismicRichText
            field={description}
            components={(...defaultArgs: any) =>
              shortCodeSerializerWithParentProps(defaultArgs, {
                sectionName,
                sliceType: SLICE_TYPES.CARD,
              })
            }
          />
          {cta?.link?.url ? CTA : null}
        </div>
      ) : null}
    </StyledCard>
  );
};

export default Card;
