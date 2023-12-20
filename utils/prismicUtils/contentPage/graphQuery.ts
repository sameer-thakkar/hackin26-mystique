const contentFrameworkGq = `
    content_framework {
        ...on content_framework {
            ...content_frameworkFields
        }
    }
`;

export const contentPageGq = `
    {
        content_page {
            ...content_pageFields
            header_ref {
                ...on common_header {
                    ...common_headerFields
                }
            }
            ${contentFrameworkGq}
            footer_ref {
                ...on common_footer {
                    ...common_footerFields
                }
            }
            secondary_footer {
                ...on common_footer {
                    ...common_footerFields
                }
            }
            microsite_document_ref {
                ...on microsite {
                    ...micrositeFields
                }
            }
        }
    }
`;
