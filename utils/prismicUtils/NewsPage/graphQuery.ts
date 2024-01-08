export const newsPageGq = `
    {
        news_page {
            ...news_pageFields
            header_ref {
                ...on common_header {
                    ...common_headerFields
                }
            }
            content_framework_ref {
                ...on content_framework {
                    ...content_frameworkFields
                }
            }
            primary_footer_ref {
                ...on common_footer {
                    ...common_footerFields
                }
            }
            secondary_footer_ref {
                ...on common_footer {
                    ...common_footerFields
                }
            }
        }
    }
`;

export const newsArticlesWithCFrameworkGq = `
    {
        news_page {
            ...news_pageFields
            content_framework_ref {
                ...on content_framework {
                    ...content_frameworkFields
                }
            }
        }
    }
`;

export const newsLandingPageGq = `
    {
        news_page {
            uid
        }
    }
`;
