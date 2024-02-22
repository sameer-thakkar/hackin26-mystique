export const reviewsPageGq = `
    {
        reviews_page {
            ...reviews_pageFields
            header_ref {
                ...on common_header {
                    ...common_headerFields
                }
            }
            content_framework {
                ...on content_framework {
                    ...content_frameworkFields
                }
            }
        }
    }
`;
