export const globalHomepageGq = `
    {
        global_homepage {
            ...global_homepageFields
            content_framework {
                ...on content_framework {
                    ...content_frameworkFields
                }
            }
            common_header {
                ...on common_header {
                    ...common_headerFields
                }
            }
            common_footer {
                ...on common_footer {
                    ...common_footerFields
                }
            }
        }
    }
`;

export const globalCollectionsHomepageGq = `
    {
        global_collection {
            city_name
            collection_name
            continent
            rank
            images
            mb_type
            primary_category
        }
    }
`;

export const globalCityHomepageGq = `
    {
        global_city {
            city_name
            country_name
            body
        }
    }
`;
