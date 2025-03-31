export const venuePageGq = `
    {
        venue_page {
            ...venue_pageFields
            content_framework {
                ...on content_framework {
                    ...content_frameworkFields
                }
            }
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

export const venuePageTgidsGq = `
    {
        venue_page {
            poi_id
            desktop_banner
            seating_plan
            theatre_location_cta
            theatre_location_url
        }
    }
`;
