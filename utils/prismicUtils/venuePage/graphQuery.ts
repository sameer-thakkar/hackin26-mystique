export const venuePageGq = `
    {
        venue_page {
            ...venue_pageFields
            header_ref {
                ...on common_header {
                    ...common_headerFields
                }
            }
            footer_ref {
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
