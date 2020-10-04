import React, { useState, useEffect, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import Swiper from '../Swiper';
import Image from '../UI/Image';
import { CHEVRON_LEFT } from '../../assets/SvgIcons';
import { shortCodeSerializer } from '../../utils/shortCodes';
import { SOLEIL, COLORS } from '../../constants/ui-constants';
import { scroller } from 'react-scroll';
import { stringIdfy } from '../../utils/helper';
import { MBContext } from '../../contexts/MBContext';
import { DESIGN } from '../../constants';

const StyledWrapper = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-row-gap: 22px;
	@media (max-width: 768px) {
		grid-row-gap: 24px;
	}
`;

const StyledMobileSlider = styled.div`
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: max-content;
	grid-gap: 12px;
	overflow: scroll;
	overscroll-behavior-x: contain;
	overflow: -moz-scrollbars-none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		width: 0 !important;
	}
	margin: 0 -16px;
	padding: 0 16px;
	last-child {
		margin-right: 16px;
		grid-row-gap: 8px;
	}
`;

const StyledContent = styled.div`
	display: grid;
	grid-row-gap: 8px;
	h2 {
		margin: 0;
		font-family: ${SOLEIL.FONT_STACK};
		font-size: 24px !important;
		line-height: 33px;
		color: ${({ design }) =>
			design === DESIGN.V1 ? COLORS.FOUR_BLACK : COLORS.TWO_BLACK};
		font-weight: ${SOLEIL.SEMIBOLD};
	}
	div {
		margin: 0;
		font-family: ${SOLEIL.FONT_STACK};
		font-size: 16px;
		line-height: 20px;
		color: ${COLORS.FOUR_BLACK};
		p {
			margin: 0;
		}
	}
	@media (max-width: 768px) {
		h2 {
			line-height: 26px;
			font-family: ${SOLEIL.FONT_STACK};
		}
		div {
			line-height: 20px;
			font-family: ${SOLEIL.FONT_STACK};
			font-weight: ${SOLEIL.REGULAR};
		}
	}
`;

const StyledSlider = styled.div`
	display: grid;
	position: relative;
	grid-auto-flow: column;
	.slider-container {
		overflow: hidden;
		display: flex;
		width: 100%;
		max-width: 1200px;
		margin: auto;
	}
	.swiper-container {
		padding-top: 10px;
	}
	.controls {
		display: flex;
	}
	.controls .btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: -32px;
		display: flex;
		cursor: pointer;
	}
	.controls .btn svg {
		stroke-width: 1.5px;
	}
	.controls .btn-right {
		left: unset;
		right: -32px;
	}
	.controls .btn-right svg {
		transform: rotate(180deg);
	}
`;

const StyledSlide = styled.div`
	margin-right: 20px;
	transform: translate3d(0, 0, 0);
	transition: ease 0.2s;
	&:hover {
		transform: translate3d(0, -5px, 0);
	}
	img {
		height: 175px;
		width: 280px !important;
		border-radius: 4px;
	}
	div {
		font-family: ${SOLEIL.FONT_STACK};
		font-size: 16px;
		font-weight: ${SOLEIL.SEMIBOLD};
		color: ${COLORS.TWO_BLACK};
		margin-top: 4px;
	}
	a {
		text-decoration: none;
	}
	@media (max-width: 768px) {
		margin-right: 0px;
		img {
			width: 104px !important;
			height: 60px;
		}
		div {
			font-size: 14px;
		}
		transform: unset;
		transition: unset;
		&:hover {
			transform: unset;
		}
	}
`;

const desktopInteraction = (
	event,
	{ card_title, isMobile, clickInteraction }
) => {
	if (!isMobile && clickInteraction === 'Scroll to Heading') {
		event.preventDefault();
		scroller.scrollTo(stringIdfy(card_title), {
			duration: 1200,
			offset: isMobile ? -80 : -100,
			smooth: 'easeInOutQuart',
		});
	}
};

const Slide = (props) => (
	<StyledSlide className={props.className}>
		<a
			href={props.link.url}
			target={props.link.target}
			onClick={(e) => desktopInteraction(e, props)}
		>
			<Image
				url={props.image.url}
				alt={props.image.alt}
				width={400}
				height={250}
				aspectRatio="1.7"
			/>
			<div>{props.card_title}</div>
		</a>
	</StyledSlide>
);

type ImageLinksCarouselProps = {
	isMobile: boolean;
	cards: any[];
	heading: string;
	description: any[];
	clickInteraction: string;
};

/**
 *
 * A gallery like image carousel with mini titles for each image and a link wrapped over
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - *Carousel Heading
 * - Carousel Description
 *  - Rich Text field
 * - Click Interaction (Dropdown Selection)
 *    - Option 1 (default): Open the link specified, as usual.
 *    - Option 2: Scroll to Heading, if there is a tour section or jump link with same heading on the current page, clicking on the card will scroll to that section
 *
 * ### Repeatable zone
 * - Uploaded Image
 *  - Add your image from prismic
 *  - Additionally add an 'alt' field
 * - Link to Image
 *  - Add a link to the image directly
 *  - Will take precedence over 'Image Source'
 * - Image Alt
 *  - 'alt' field for Image URL
 *  - Will take precedence over 'Image Source' alt
 * - Card Link
 * - Card Title
 *
 * **Note: Either 'Uploaded Image' or 'Link to Image' is required and if left blank will break the slice**
 */

const ImageLinksCarousel: React.FC<ImageLinksCarouselProps> = (props) => {
	const [swiper, updateSwiper] = useState(null);
	const [_currentIndex, updateCurrentIndex] = useState(0);
	const {
		cards,
		heading,
		description,
		isMobile,
		clickInteraction = 'Open Link',
	} = props;
	const { design } = useContext(MBContext);

	const goNext = () => {
		if (swiper !== null) {
			swiper.slideNext();
		}
	};

	const goPrev = () => {
		if (swiper !== null) {
			swiper.slidePrev();
		}
	};

	const updateIndex = useCallback(() => updateCurrentIndex(swiper.realIndex), [
		swiper,
	]);

	useEffect(() => {
		if (isMobile) return;
		if (swiper !== null) {
			swiper.on('slideChange', updateIndex);
		}

		return () => {
			if (swiper !== null) {
				swiper.off('slideChange', updateIndex);
			}
		};
	}, [swiper, updateIndex, isMobile]);

	const swiperParams = {
		slidesPerGroup: 4,
		direction: 'horizontal',
		speed: 650,
		slidesPerView: 4,
		spaceBetween: 24,
		rebuildOnUpdate: false,
		shouldSwiperUpdate: true,
		navigaton: {
			nextEl: '.swiper-btn.btn-left',
			prevEl: '.swiper-btn.btn-right',
		},
	};

	return (
		<StyledWrapper>
			<StyledContent design={design}>
				<h2>{heading}</h2>
				<div>
					<RichText render={description} htmlSerializer={shortCodeSerializer} />
				</div>
			</StyledContent>
			{isMobile ? (
				<StyledMobileSlider>
					{cards.map((card, index) => (
						<Slide key={index} {...card} isMobile={isMobile} />
					))}
				</StyledMobileSlider>
			) : (
				<StyledSlider>
					<div className="slider-container">
						<Swiper {...swiperParams} getSwiper={updateSwiper}>
							{cards.map((card, index) => (
								<Slide
									className="swiper-slide"
									key={index}
									{...card}
									isMobile={isMobile}
									clickInteraction={clickInteraction}
								/>
							))}
						</Swiper>
					</div>
					<div className="controls">
						{swiper && !swiper.isBeginning ? (
							<div
								className="swiper-btn btn btn-left"
								role="button"
								tabIndex={0}
								onClick={goPrev}
							>
								{CHEVRON_LEFT}
							</div>
						) : null}
						{swiper && !swiper.isEnd ? (
							<div
								className="swiper-btn btn btn-right"
								role="button"
								tabIndex={0}
								onClick={goNext}
							>
								{CHEVRON_LEFT}
							</div>
						) : null}
					</div>
				</StyledSlider>
			)}
		</StyledWrapper>
	);
};

export default ImageLinksCarousel;
