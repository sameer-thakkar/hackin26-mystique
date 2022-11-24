import React, { useState } from 'react';

import MultiLevelNav from '../../../components/MultiLevelNav';
import ParentWrapper from '../../ParentWrapper';
import useWindowSize from '../../../components/hooks/useWindowSize';
import Hamurger from '../../../components/UI/Hamburger';

export default {
  title: 'Slices/Common Header/Navigation (MultiLevel)',
  component: MultiLevelNav,
};

const data = {
  slice: [
    {
      slices: [
        {
          slice_type: 'menu_item',
          slice_label: null,
          items: [{}],
          primary: {
            label: 'Home',
            url: {
              link_type: 'Web',
              url: 'http://github.com/',
            },
          },
        },
        {
          slice_type: 'menu_item',
          slice_label: null,
          items: [{}],
          primary: {
            label: 'About',
            url: {
              link_type: 'Web',
              url: 'https://google.com',
            },
          },
        },
        {
          slices: [
            {
              slice_type: 'menu_item',
              slice_label: null,
              items: [{}],
              primary: {
                label: 'Level 2 A',
                url: {
                  link_type: 'Web',
                  url: 'http://github.com/',
                },
              },
            },
            {
              slice_type: 'menu_item',
              slice_label: null,
              items: [{}],
              primary: {
                label: 'Level 2 B',
                url: {
                  link_type: 'Web',
                  url: 'https://github.com',
                },
              },
            },
            {
              slices: [
                {
                  slice_type: 'menu_item',
                  slice_label: null,
                  items: [{}],
                  primary: {
                    label: 'LEVEL 3 A',
                    url: {
                      link_type: 'Web',
                      url: 'https://google.com',
                    },
                  },
                },
                {
                  slice_type: 'menu_item',
                  slice_label: null,
                  items: [{}],
                  primary: {
                    label: 'LEVEL 3 B',
                    url: {
                      link_type: 'Web',
                      url: 'https://google.com',
                    },
                  },
                },
              ],
              slice_type: 'nested_menu',
              primary: {
                label: 'LEVEL 2 C',
                url: {
                  link_type: 'Any',
                },
              },
              items: [{}],
            },
          ],
          slice_type: 'nested_menu',
          primary: {
            label: 'More',
            url: {
              link_type: 'Web',
              url: 'http://stage.sydney.opera-tickets.org/',
            },
          },
          items: [{}],
        },
      ],
      slice_type: 'navigation',
      primary: {},
      items: [{}],
    },
  ],
  oldMenuItems: [
    {
      slice_type: 'menu_item',
      primary: {
        label: 'Nav',
        url: {
          url: 'https://www.google.com',
        },
      },
    },
    {
      slice_type: 'group_booking',
    },
  ],
};

export const Basic = () => {
  const isMobile = useWindowSize().width < 768;
  const [isActive, setActive] = useState(false);
  return (
    <ParentWrapper>
      <div style={{ width: 1200, padding: 50, display: 'grid' }}>
        <div style={{ alignSelf: 'start' }}>
          {isMobile ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActive(!isActive)}
            >
              <Hamurger />
            </div>
          ) : null}
        </div>
        \
        <MultiLevelNav isMobile={isMobile} isActive={isActive} {...data} />
      </div>
    </ParentWrapper>
  );
};
