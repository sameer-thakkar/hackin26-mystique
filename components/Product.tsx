import React, { useRef, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import parse from 'url-parse';
import dayjs from 'dayjs';
import * as labels from 'constants/localization/labels';
import HorizontalLine from './slices/HorizontalLine';
import Button from 'UI/Button';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from 'utils/shortCodes';
import { ANALYTICS_EVENTS, THEMES, SIDEBAR_TYPES } from 'constants/index';
import { COLORS, SOLEIL } from 'constants/ui-constants';
import { CALENDAR, BrownTicket, Shield, BackArrow } from 'assets/SvgIcons';
import 'utils/dayjsLocale';
import Split, { StlyedSplit } from 'UI/Split';
import IconCTA, { StyledIconCTA } from 'UI/IconCTA';
import { brownScheme, greenScheme } from 'style/theme';
import {
	isDiscountedFuture,
	isSafetyIncluded,
	getDFValidityFromTags,
	createBookingURL,
} from 'utils';
import { MBContext } from 'contexts/MBContext';
import DiscountedFutureSidebar from './DiscountedFutureSidebar';
import SafeExperiencesPitch from 'UI/SafeExperiencesPitch';
import PriceBlock from 'UI/PriceBlock';
import Conditional from './common/Conditional';
import Chevron from 'UI/Chevron';
import DiscountedFuturesPitch from 'UI/DiscountedFuturesPitch';
import {
	extractTabsFromHighlights,
	getProductCardLayout,
	parseDescriptorIcon,
} from 'utils/productUtils';
import Image from 'UI/Image';

const isLengthyArray = (item) => Array.isArray(item) && item.length;

const Container = styled.div`
	max-width: 1200px;
	margin: auto;
	width: 100%;
`;

const StyledProductCard = styled.div`
	font-family: ${SOLEIL.FONT_STACK};
	padding: ${({ theme }) => theme.productCards.padding.desktop};
	border: ${({ theme }) => theme.productCards.border};
	border-radius: 4px;
	display: grid;
	grid-row-gap: 24px;
	grid-template-columns: 1fr auto;
	grid-template-areas: ${({ layout }) =>
		layout.desktop.map((row) => `'${row}'`)};
	${StlyedSplit} {
		margin: 0;
		max-width: unset;
		padding: 0;
	}
	${HorizontalLine} {
		grid-area: line;
		margin: 8px 0;
		${({ theme }) => theme.productCards.lineStyles || ''};
	}
	.more-details {
		font-weight: ${SOLEIL.MEDIUM};
		font-size: 14px;
		line-height: 15px;
		margin-left: 1em;
		margin-top: 16px;
		cursor: pointer;
		outline: none;
		${({ theme }) => theme.productCards.moreDetailsStyle}
	}
	${({ theme }) => theme.productCards?.styles?.desktop}
	@media (max-width: 768px) {
		padding: ${({ theme }) => theme.productCards.padding.mobile};
		margin: 0
			${({ theme: { theme } }) => (theme !== THEMES.MIN_BLUE ? '16px' : '24px')};
		grid-template-areas: ${({ layout }) =>
			layout.mobile.map((row) => `'${row}'`)};
		width: auto;
		grid-template-columns: auto;
		.more-details {
			margin-top: 0;
			margin-left: 0;
			margin-bottom: 0;
		}
		${({ theme }) => theme.productCards?.styles?.mobile}
	}
`;
const ProductHeader = styled.div`
	display: grid;
	grid-gap: 16px;
	display: contents;
	@media (max-width: 768px) {
	}
`;

const TourTitle = styled.h2`
	font-weight: ${SOLEIL.MEDIUM};
	margin: 0;
	max-width: 768px;
	${({ theme }) => theme.productCards.titleFontSettings.desktop};
	@media (max-width: 768px) {
		${({ theme }) => theme.productCards.titleFontSettings.mobile};
	}
`;

const TitleWrapper = styled.div`
	grid-area: title;
`;

const BoosterTag = styled.div`
	font-size: 11px;
	line-height: 13px;
	background: ${COLORS.PALE_YELLOW};
	border-radius: 2px;
	letter-spacing: 0.4px;
	margin-bottom: 7px;
	padding: 2px 4px;
	display: inline-block;
`;

const ShortSummary = styled.div`
	margin-top: -8px;
	grid-area: summary;
	p {
		color: ${COLORS.GREY_G3};
		font-size: 14px;
		line-height: 20px;
		margin: 0;
	}
	@media (max-width: 768px) {
		margin-top: 0;
		font-size: 14px;
		line-height: 23px;
	}
`;

const TourTags = styled.div`
  font-size: 14px;
  margin: -8px 0;
  font-weight: ${SOLEIL.MEDIUM};
  display: grid;
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  color: ${COLORS.GREY_G3};
  .tour-tag {
    display: grid;
    margin-bottom: 8px;
    grid-auto-flow: column;
    grid-column-gap: 8px;
    margin-right: 8px;
    font-size: 14px;
    line-height: 20px;
  }
  ${({ theme }) =>
		theme.theme === THEMES.DEF_INTERIM
			? `
    display: grid;
    grid-row-gap: 12px;
    align-content: start;
    margin: 0;
    margin-top: 8px;
    font-weight: ${SOLEIL.REGULAR};
    .tour-tag {
      line-height: 22px;
      justify-content: left;
      align-items: center;
      margin-bottom: 0;
      img {
        height: 16px;
        width: 16px;
        object-fit: cover;
      }
    }
  `
			: `
      `}
  @media (max-width: 768px) {
    grid-area: tags;
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    font-size: 12px;
    line-height: 13px;
    .tour-tag {
      margin-bottom: 8px;
    }
    ${({ theme }) =>
			theme.theme === THEMES.DEF_INTERIM
				? `
        margin-top: -8px;
        .tour-tag {
          margin: 0;
        }
      display: grid;
      grid-template-columns: auto auto;
      grid-column-gap: 8px;
      grid-row-gap: 12px;
    `
				: ``}
`;

export const CTAContainer = styled.div`
	grid-area: cta-combo;
	display: grid;
	grid-gap: 16px;
	align-content: start;
	${({ theme }) =>
		theme.theme === THEMES.MIN_BLUE
			? `
    button.tour-book-now-cta {
      width: 100%;
    }
  `
			: ``}
	@media (max-width: 768px) {
		display: contents;
	}
`;

const PriceContainer = styled.div`
	justify-self: center;
	display: grid;
	grid-auto-flow: column;
	align-items: end;
	grid-column-gap: 8px;
	justify-items: left;
	grid-row-gap: 4px;
	.tour-scratch-price {
		display: grid;
		grid-template-columns: auto auto;
		justify-content: left;
		grid-column-gap: 4px;
	}
	.tour-price {
		display: flex;
	}
	${({ theme }) => theme.productCards.priceFontSettings.desktop}
	@media (max-width: 768px) {
		justify-self: left;
		grid-area: price-block;
		${({ theme }) => theme.productCards.priceFontSettings.mobile}
	}
`;
const CTABlock = styled.div`
	a {
		text-decoration: none;
	}
	.tour-book-now-cta {
		margin: auto;
		min-width: 230px;
		width: 100%;
		display: block;
		line-height: 1;
		svg {
			vertical-align: middle;
			margin-left: 24px;
			transform: rotate(180deg);
			path {
				stroke: ${({ theme }) => theme.primaryBGText};
				stroke-width: 1.5px;
			}
		}
	}
	@media (max-width: 768px) {
		grid-area: cta-block;
		margin-top: 8px;
		${({ theme }) =>
			theme.theme === THEMES.DEF_INTERIM ? `margin-top: 0;` : ``}
		${({ isSticky, shouldOffset }) =>
			isSticky
				? `
      position: sticky;
      bottom: 0;
      padding-bottom: 16px;
      ${shouldOffset ? 'transform: translateY(32px);' : ''}
      background: ${COLORS.WHITE};
      z-index: 2;
    `
				: ``}
    .tour-book-now-cta {
			justify-content: center;
			width: 100%;
		}
	}
`;

const ProductBody = styled.div`
  grid-area: body;
  display: grid;
  grid-row-gap: 8px;
  overflow-anchor: none;
  .tour-description {
    p {
      margin: 0;
      font-weight: ${SOLEIL.MEDIUM};
    }
    font-family: ${SOLEIL.FONT_STACK};
    ${({ theme }) => theme.productCards.regularFontSettings.desktop}
    color: ${COLORS.FOUR_BLACK};
    opacity: 0.99;
    display: grid;
    grid-gap: 0;
    ${({ collapsed }) =>
			collapsed
				? `
    *:nth-child(n + 4),
    ul li:nth-child(n + 3) {
      display: none;
    }
    `
				: ''}
    ul {
      padding: 0;
      padding-left: 1.2em;
      display: grid;
      grid-gap: 12px;
    }
  }
  ul:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 768px) {
    
    .show-more-information{
      p:nth-child(1) {
              display: block;
            }
            ul {
              li:nth-child(n + 2) {
                display: list-item;
              }
            }
    }
    .tour-description {
      ${({ theme }) => theme.productCards.regularFontSettings.mobile}
    }
    ${({ collapsed, theme }) =>
			collapsed
				? `
        ${
					theme.theme === THEMES.DEF_INTERIM
						? `
          .tour-description {
            display: none;
          }
        `
						: `
            p:nth-child(1) {
              display: none;
            }
            strong {
              margin-top: 0 !important;
            }
            ul {
              li:nth-child(n + 2) {
                display: none;
              }
            }
            `
				}
    `
				: ''}
  }
  .display-none{
  display: none;
  }
`;

const NextAvailableBlock = styled.div`
	font-size: 14px;
	font-weight: ${SOLEIL.MEDIUM};
	color: ${COLORS.FOUR_BLACK};
	line-height: 15px;
	display: grid;
	grid-column-gap: 8px;
	grid-template-columns: auto auto;
	align-items: center;
	justify-content: center;
	.icon {
		display: flex;
	}
	${({ theme }) => theme.productCards?.nextAvailable?.desktop}
	@media (max-width: 768px) {
		grid-area: next-available;
		margin-top: -8px;
		${({ theme }) => theme.productCards?.nextAvailable?.mobile}
	}
`;
const ProductOfferBlock = styled.div`
	grid-area: offer;
	font-size: 14px;
	line-height: 15px;
	font-family: ${SOLEIL.FONT_STACK};
	font-weight: ${SOLEIL.REGULAR};
	cursor: pointer;
	color: ${({ theme: { primaryAccent } }) =>
		primaryAccent ? primaryAccent : COLORS.MED_SLATE_BLUE};
	p {
		margin: 0;
		color: ${({ theme: { primaryAccent } }) =>
			primaryAccent ? primaryAccent : COLORS.MED_SLATE_BLUE};
	}
	@media (max-width: 768px) {
		font-size: 14px;
	}
`;
const V1BoosterBlock = styled.div`
	grid-area: booster;
	font-family: ${SOLEIL.FONT_STACK};
	font-weight: 400;
	line-height: 1.31;
	text-align: left;
	color: ${({ theme: { primaryAccent } }) =>
		primaryAccent ? primaryAccent : COLORS.CORAL};
	font-size: 1em;
	display: inline-block;
	p {
		margin: 0;
		color: ${({ theme: { primaryAccent } }) =>
			primaryAccent ? primaryAccent : COLORS.MED_SLATE_BLUE};
		strong {
			font-weight: unset;
		}
	}
	br {
		display: none;
	}
	.block-img img {
		display: none;
	}
	@media (max-width: 768px) {
		br {
			display: initial;
		}
		.block-img img {
			width: 100%;
			display: inline;
		}
		p {
			font-size: 12px;
			strong {
				font-weight: ${SOLEIL.MEDIUM};
				line-height: 1.5;
			}
		}
		font-size: 0.8em;
		display: grid;
		grid-template-columns: ${(props) => (props.boosterHasIcon ? '40px' : '')} auto;
		grid-gap: 10px;
		align-items: center;
		margin: 0;
	}
`;

const IconBoosters = styled.div`
	grid-area: icon-booster;
	margin-left: 16px;
	${StlyedSplit} {
		grid-column-gap: 30px;
	}
	@media (max-width: 768px) {
		margin-left: 0;
		${StlyedSplit} {
			padding-left: 12px;
			grid-template-columns: auto auto 8px;
			grid-column-gap: 30px;
			border: none;
		}
		${({ theme }) =>
			theme.theme === THEMES.DEF_INTERIM &&
			`
      justify-self: right;
      .text,
      .chevron {
        display: none;
      }
      ${StyledIconCTA} {
        justify-self: right;
        grid-template-columns: auto;
        border-radius: 50%;
        .icon {
          position: unset;
          transform: unset;
          left: unset;
          top: unset;
          height: 20px;
          width: 20px;
        }
        padding: 4px;
      }
      ${StlyedSplit} {
        grid-auto-flow: column;
        grid-template-columns: unset;
        grid-column-gap: 24px;
        padding-left: 0;
      }
    `}
	}
`;

const HighlightTabsWrapper = styled.div`
	display: grid;
	grid-row-gap: 16px;
	margin-top: ${({ hasRegularHighlights }) =>
		hasRegularHighlights ? '16px' : 0};
`;

const TabsWrapper = styled.div`
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: auto;
	font-weight: ${SOLEIL.SEMIBOLD};
	font-size: 14px;
	line-height: 20px;
	grid-column-gap: 24px;
	border-bottom: 1px solid #ebebeb;
	justify-content: left;
`;

const TabPanelWrapper = styled.div``;

const Tab = styled.div`
	cursor: pointer;
	padding-bottom: 8px;
	display: block;
	width: 100%;
	border-bottom: 1px solid transparent;
	transform: translateY(1px);
	font-weight: ${SOLEIL.REGULAR};
	${({ isActive }) => {
		return (
			isActive &&
			`
      font-weight: ${SOLEIL.SEMIBOLD};
      color: ${COLORS.RHAPSODY};
      border-color: ${COLORS.RHAPSODY};
    `
		);
	}}
`;

const TabPanel = styled.div`
	display: ${({ isActive }) => (isActive ? 'block' : 'none')};
`;

const HighlightTabs = ({ tabs, hasRegularHighlights = false, onTabChange }) => {
	const [activeTabIndex, setActiveTabIndex] = useState(0);

	useEffect(() => {
		onTabChange(tabs[activeTabIndex]);
	}, [activeTabIndex, onTabChange, tabs]);

	return (
		<HighlightTabsWrapper hasRegularHighlights={hasRegularHighlights}>
			<TabsWrapper>
				{tabs.map((tab, index) => (
					<Tab
						isActive={activeTabIndex == index}
						key={index}
						onClick={() => setActiveTabIndex(index)}
					>
						{tab.heading}
					</Tab>
				))}
			</TabsWrapper>
			<TabPanelWrapper>
				{tabs.map((tab, index) => (
					<TabPanel isActive={activeTabIndex == index} key={index}>
						<RichText render={tab.contents} />
					</TabPanel>
				))}
			</TabPanelWrapper>
		</HighlightTabsWrapper>
	);
};

const ModalCardContainer = styled.div`
	@media (max-width: 768px) {
		${StyledProductCard} {
			margin: 0;
			margin-top: 24px;
			border: none;
			padding: 0;
		}
		${ProductBody} {
			.tour-description {
				display: block;
				p {
					margin-bottom: 12px;
				}
				li,
				p {
					font-size: 15px;
					line-height: 23px;
				}
			}
			.more-details {
				display: none;
			}
		}
		${CTABlock} {
			.tour-book-now-cta {
				border-radius: 8px;
			}
		}
	}
`;

const Product = (props) => {
	const moreDetailsRef = useRef();
	const {
		analytics,
		tgid,
		position,
		currentLanguage,
		togglePopup,
		defaultOpen,
		title,
		descriptors,
		highlights: tempHighlights,
		tourPrices,
		uid,
		hasOffer: isOfferEnabled,
		productOffer,
		offerId,
		isFetched,
		scorpioData,
		host,
		earliestAvailability,
		ctaUrlSuffix,
		isScratchPriceEnabled,
		booster,
		shortSummary,
		boosterTag,
		isMobile,
		isAmp,
	} = props;
	const { mbTheme } = useContext(MBContext);
	const [isContentOpen, toggleContentOpen] = useState(
		defaultOpen && mbTheme === THEMES.MIN_BLUE
	);
	const [showMoreDetailsInTabs, setShowMoreDetails] = useState(false);

	const onTabChange = (tab) => {
		setShowMoreDetails(tab.contents.length >= 3);
	};

	const handlePopup = () => {
		togglePopup();
	};

	const sendBookNowEvent = () => {
		analytics.setVariableInDataLayer({
			event: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
			'Tour Group Id': tgid,
			Position: position,
			'Div Type': 'product-list',
		});
	};

	const getDate = (date, currentLanguage) => {
		const today = dayjs().format('YYYY-MM-DD');
		const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
		if (date === today) return labels[currentLanguage].TODAY;
		if (date === tomorrow) return labels[currentLanguage].TOMORROW;
		return dayjs(date).locale(currentLanguage).format('MMM Do');
	};

	const boosterHasIcon = booster?.filter((i) => i.type === 'image').length > 0;
	const descriptorsCsv = descriptors || scorpioData.descriptors;
	const cardTitle = title || scorpioData.title;
	const descriptorsList = descriptorsCsv
		? descriptorsCsv.match(/(("|').*?("|')|[^",]+)(?=\s*,|\s*$)/g)
		: [];
	let url = host || window.location.host;
	const isDev = url.includes('localhost');
	const currentHost = !isDev ? url : parse(uid, true).pathname;
	const hostName = currentHost.includes('stage')
		? currentHost.replace('stage-', '')
		: currentHost;
	let hostSplit = hostName.split('.');
	hostSplit.shift();
	const bookingUrl = hostSplit.join('.');
	const showScratchPrice = isFetched && isScratchPriceEnabled;
	const hasShortSummary = shortSummary?.length > 0;
	const {
		sidebarModal: { addToAside },
	} = useContext(MBContext);
	let { listingPrice } = isFetched ? tourPrices[tgid] : { listingPrice: null };
	listingPrice = isAmp ? scorpioData.listingPrice : listingPrice;
	const { allTags = [], dfListingPrice } = scorpioData || {};
	if (isFetched && !listingPrice && !dfListingPrice) return null;
	const hasSafetyFlag = isSafetyIncluded(allTags);
	const isDFProduct =
		isFetched && isDiscountedFuture(allTags) && dfListingPrice;
	const isDFOnlyProduct =
		isFetched && listingPrice === null && dfListingPrice !== null;
	const openDFSidebar = () => {
		addToAside({
			width: '27.5vw',
			title: cardTitle,
			children: <DiscountedFutureSidebar product={tourPrices[tgid]} />,
		});
	};
	const finalPrice = listingPrice || dfListingPrice;
	const openSafeSidebar = () => {
		addToAside({
			width: '41.06vw',
			children: (
				<SafeExperiencesPitch
					allTags={allTags}
					images={scorpioData.safetyImages}
				/>
			),
			sidePadding: isMobile ? 0 : 40,
		});
	};
	const openDFPitchSidebar = () => {
		addToAside({
			width: '27.5vw',
			children: (
				<DiscountedFuturesPitch
					dfExpiryDate={getDFValidityFromTags(allTags).format('DD-MMM-YY')}
				/>
			),
		});
	};
	const hasV1Booster = booster && RichText.asText(booster).trim().length > 0;
	const hasOffer = isOfferEnabled && offerId;

	const layout = getProductCardLayout({
		hasOffer,
		hasSafetyFlag,
		hasV1Booster,
		isDFProduct,
		mbTheme,
		hasShortSummary,
		hasNextAvailable: earliestAvailability,
	});
	const getMoreDetailsButton = () => {
		const innerContent =
			mbTheme === THEMES.DEFAULT ? (
				` ${
					isContentOpen
						? '- ' + labels[currentLanguage].SHOW_LESS_TEXT
						: '+ ' + labels[currentLanguage].MORE_DETAILS
				}`
			) : (
				<>
					{isContentOpen
						? labels[currentLanguage].SHOW_LESS_TEXT
						: labels[currentLanguage].MORE_DETAILS}{' '}
					<Chevron isActive={isContentOpen} className={'chevron'} />{' '}
				</>
			);
		return (
			<div
				ref={moreDetailsRef}
				data-open="0"
				onClick={() => {
					if (mbTheme === THEMES.DEF_INTERIM && isMobile) {
						addToAside({
							width: '100vw',
							children: (
								<ModalCardContainer>
									{getProductCardElements(true)}
								</ModalCardContainer>
							),
							type: SIDEBAR_TYPES.FIXED,
						});
					} else {
						toggleContentOpen(!isContentOpen);
					}
				}}
				className="more-details"
				onKeyDown={() => toggleContentOpen(!isContentOpen)}
				role="button"
				tabIndex={0}
			>
				{innerContent}
			</div>
		);
	};
	const getMoreDetailsButtonForAMP = () => {
		return (
			<div
				data-open="0"
				className="more-details"
				role="button"
				tabIndex={0}
				// @ts-ignore
				on={`tap:tour-description-${position}.toggleClass(class='show-more-information'),tour-description-less-text-${position}.toggleClass(class='display-none'),tour-description-more-text-${position}.toggleClass(class='display-none')`}
			>
				<span
					className="more-details"
					id={`tour-description-more-text-${position}`}
				>
					{'+ ' + labels[currentLanguage].MORE_DETAILS}
				</span>
				<span
					className="more-details display-none"
					id={`tour-description-less-text-${position}`}
				>
					{'- ' + labels[currentLanguage].SHOW_LESS_TEXT}
				</span>
			</div>
		);
	};
	const finalHighlights = RichText.asText(tempHighlights)?.trim()?.length
		? tempHighlights
		: scorpioData.highlights;
	const { highlights, tabs } =
		isMobile || mbTheme !== THEMES.DEF_INTERIM
			? { highlights: finalHighlights, tabs: [] }
			: extractTabsFromHighlights(finalHighlights);
	const hasHighlights =
		isLengthyArray(highlights) && highlights.filter((item) => item.text).length;

	const Descriptors = ({ descriptorArray }) => {
		return (
			<TourTags>
				{descriptorArray.reduce((acc, item, index) => {
					const { icon, descriptor } = parseDescriptorIcon(item.trim());
					if (mbTheme === THEMES.DEF_INTERIM && !icon) return;
					if (descriptor) {
						acc.push(
							<div key={index} className="tour-tag">
								<Conditional if={icon && mbTheme === THEMES.DEF_INTERIM}>
									<Image url={icon} />
								</Conditional>
								<Conditional if={index !== 0 && mbTheme !== THEMES.DEF_INTERIM}>
									<div className="bullet">•</div>
								</Conditional>
								{descriptor.replace(/['"]+/g, '')}
							</div>
						);
					}
					return acc;
				}, [])}
			</TourTags>
		);
	};

	const getProductCardElements = (expandContent) => (
		<StyledProductCard layout={layout}>
			<ProductHeader>
				<TitleWrapper>
					<Conditional if={boosterTag && mbTheme === THEMES.DEF_INTERIM}>
						<BoosterTag>{boosterTag}</BoosterTag>
					</Conditional>
					<TourTitle>{cardTitle}</TourTitle>
				</TitleWrapper>
				<Conditional if={hasShortSummary}>
					<ShortSummary>
						<RichText render={shortSummary} />
					</ShortSummary>
				</Conditional>
				<Conditional if={mbTheme !== THEMES.DEF_INTERIM}>
					<Descriptors descriptorArray={descriptorsList} />
				</Conditional>
				<Conditional if={hasSafetyFlag || isDFProduct}>
					<IconBoosters>
						<Split count={2} autoWidth={true}>
							<Conditional if={hasSafetyFlag}>
								<IconCTA
									text={labels[currentLanguage].SAFE_EXPERIENCE.FLAG_TEXT}
									colorScheme={greenScheme}
									ctaOnClick={openSafeSidebar}
									icon={Shield}
								/>
							</Conditional>
							<Conditional if={isDFProduct}>
								<IconCTA
									text={labels[currentLanguage].DISCOUNTED_FUTURES.FLAG_TEXT}
									colorScheme={brownScheme}
									ctaOnClick={openDFPitchSidebar}
									icon={BrownTicket}
								/>
							</Conditional>
						</Split>
					</IconBoosters>
				</Conditional>
				<Conditional if={hasV1Booster && !isAmp}>
					<V1BoosterBlock boosterHasIcon={boosterHasIcon}>
						<RichText render={booster} htmlSerializer={shortCodeSerializer} />
					</V1BoosterBlock>
				</Conditional>

				{hasOffer &&
					offerId &&
					productOffer.map((offer, index) => {
						if (offer.id === offerId) {
							return (
								<ProductOfferBlock
									key={index}
									onClick={handlePopup}
									className="tour-offer"
								>
									<RichText
										render={offer.data.offer_title}
										htmlSerializer={shortCodeSerializer}
									/>
								</ProductOfferBlock>
							);
						}
					})}
				<CTAContainer>
					<PriceContainer>
						<PriceBlock
							showScratchPrice={showScratchPrice}
							price={finalPrice}
							lang={currentLanguage}
							showSavings={true}
						/>
					</PriceContainer>
					<CTABlock
						isSticky={expandContent}
						shouldOffset={
							earliestAvailability && mbTheme !== THEMES.DEF_INTERIM
						}
					>
						<a
							target={isFetched && isMobile ? null : '_blank'}
							href={
								createBookingURL({
									nakedDomain: bookingUrl,
									lang: currentLanguage,
									tgid,
									df: isDFOnlyProduct,
								}) + (ctaUrlSuffix || '')
							}
						>
							<Button
								className={`tour-book-now-cta`}
								paddingSides={isMobile ? '16px' : '8px'}
								type="fill"
								onClick={(e) => {
									sendBookNowEvent();
									if (isDFProduct && !isDFOnlyProduct) {
										e.preventDefault();
										e.stopPropagation();
										openDFSidebar();
										return false;
									}
								}}
								onKeyDown={sendBookNowEvent}
								role="button"
								tabIndex={0}
							>
								{isDFOnlyProduct
									? labels[currentLanguage].DISCOUNTED_FUTURES.FLAG_TEXT
									: labels[currentLanguage].BOOK_NOW_CTA}
								{mbTheme === THEMES.MIN_BLUE ? BackArrow : null}
							</Button>
						</a>
					</CTABlock>
					<Conditional if={earliestAvailability}>
						<NextAvailableBlock>
							<div className="icon">{CALENDAR}</div>
							<div className="available-text">
								{`${labels[currentLanguage].NEXT_AVAILABLE}`}
								{getDate(earliestAvailability, currentLanguage)}
							</div>
						</NextAvailableBlock>
					</Conditional>
					<Conditional if={mbTheme === THEMES.DEF_INTERIM}>
						<Descriptors descriptorArray={descriptorsList} />
					</Conditional>
				</CTAContainer>
			</ProductHeader>
			{!isMobile && <HorizontalLine colorProp={COLORS.GREY_G6} />}
			<ProductBody collapsed={!expandContent}>
				<div className="tour-description" id={`tour-description-${position}`}>
					<Conditional if={hasHighlights}>
						<RichText
							render={highlights || []}
							htmlSerializer={shortCodeSerializer}
						/>
					</Conditional>
					<Conditional if={tabs.length}>
						<HighlightTabs
							onTabChange={onTabChange}
							hasRegularHighlights={hasHighlights}
							tabs={tabs}
						/>
					</Conditional>
				</div>
				<Conditional
					if={highlights.flat()?.length >= 3 || showMoreDetailsInTabs}
				>
					{isAmp ? getMoreDetailsButtonForAMP() : getMoreDetailsButton()}
				</Conditional>
			</ProductBody>
		</StyledProductCard>
	);

	return <Container>{getProductCardElements(isContentOpen)}</Container>;
};

export default Product;
