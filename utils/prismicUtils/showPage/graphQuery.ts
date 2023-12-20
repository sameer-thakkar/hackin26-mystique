export const showpageGq = `
    {
        showpage {
            ...showpageFields
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
            content_framework {
                ...on content_framework {
                    ...content_frameworkFields
                }
            }
        }
    }
`;

export const showpageTgidsGq = `
    {
        showpage {
            tgid
        }
    }
`;
