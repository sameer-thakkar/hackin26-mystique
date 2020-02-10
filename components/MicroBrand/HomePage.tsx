import React, { Component, useState } from 'react';
import { Header } from './Header';
import { Banner } from './Banner';
import { CategoryImageBar } from './Mobile/CategoryImageBar';
import { CategoryBar } from './CategoryBar';
import { ProductsContextProvider } from '../contexts/Products';
import { LongForm } from './LongForm';
import { ProductsWrapper } from './ProductsWrapper';
import { TrustBoosters } from './TrustBoosters';
import { InteractionContextProvider } from '../contexts/Interaction';
import { Footer } from './Footer';
import { sliceHandler } from '../Slices';
import { ResponsiveSelector } from './ResponsiveSelector';
import { LOCATION } from '../../static/svg-icons';
import { SIZES } from '../../constants/ui-constants';

export const HomePage = props => {
    const {
        header,
        footer,
        host,
        isMobile,
        allTours,
        longFormContent,
        categoryProps,
        heroProps,
        changePage,
        openCategory,
        uid,
        directTgid,
        heroSectionSlice,
        isFetched,
        customFooter,
    } = props;

    const { dropdownLinks } = header;
    const selectorLinkChangeHandler = option => {
        window.location.href = option.value;
    };
    const { currentLanguage } = props.header.languageProps;
    // const customFooterProps = customFooter ? customFooter.data : null;
    const hasToursSection = categoryProps.categories.length > 0;
    return (
        <>
            <Header
                {...header}
                host={host}
                changePage={changePage}
                isMobile={isMobile}
                allTours={allTours}
            />
            {isMobile ? (
                <div className="main-wrapper city-selector">
                    <ResponsiveSelector
                        options={dropdownLinks}
                        host={host}
                        isMobile={isMobile}
                        onChange={selectorLinkChangeHandler}
                        iconPosition={'left'}
                        icon={LOCATION}
                        toggleIcon={false}
                    />
                </div>
            ) : null}
            {heroProps.banners.length ? (
                <Banner {...heroProps} isMobile={isMobile} />
            ) : null}
            {heroSectionSlice.length ? (
                <div className="main-wrapper hero-slice-section">
                    {heroSectionSlice.map((slice, index) => (
                        <div
                            key={index}
                            className={'slice-block ' + slice.slice_type}
                        >
                            {sliceHandler(slice, { isMobile })}
                        </div>
                    ))}
                </div>
            ) : null}
            {hasToursSection ? (
                <ProductsWrapper
                    availableTGIDs={Object.keys(allTours)}
                    directTgid={parseInt(directTgid)}
                    allTours={allTours}
                    isMobile={isMobile}
                    currentLanguage={currentLanguage}
                    categoryProps={categoryProps}
                    changePage={changePage}
                    host={host}
                    uid={uid}
                />
            ) : null}

            <ProductsContextProvider allTours={allTours}>
                <div className="main-wrapper">
                    {longFormContent ? (
                        <LongForm
                            content={longFormContent}
                            props={{
                                allTours,
                                isMobile,
                                changePage,
                                host,
                                uid,
                            }}
                            hasToursSection={hasToursSection}
                        />
                    ) : null}
                </div>
            </ProductsContextProvider>
            <Footer {...footer} {...customFooter} isMobile={isMobile} />
            <style jsx global>
                {`
                    .hero-slice-section {
                        margin-top: 24px;
                        margin-bottom: 56px;
                    }
                    .select-wrapper {
                        all: unset;
                    }
                    .city-selector {
                        margin-bottom: 24px;
                    }
                    .long-form .slice-block.rich_text {
                        max-width: ${SIZES.MAX_WIDTH};
                        margin-left: auto;
                        margin-right: auto;
                        font-family: Graphik;
                    }
                `}
            </style>
        </>
    );
};
