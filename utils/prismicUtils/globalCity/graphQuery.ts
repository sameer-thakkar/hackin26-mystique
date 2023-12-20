export const globalCityGq = `
    {
        global_city {
            ...global_cityFields
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
