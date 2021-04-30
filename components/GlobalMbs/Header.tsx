import Conditional from 'components/common/Conditional';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'UI/Image';

import MultiLevelMenu from './MultiLevelMenu';

const StyledHeader = styled.header`
  width: 100%;
  padding: 22px 0;
  box-shadow: inset 0 -1px 0px ${COLORS.GREY_D7};
  margin-bottom: 32px;
  position: sticky;
  background-color: ${COLORS.WHITE};
  top: 0;
  z-index: 99;
  font-family: ${SOLEIL.FONT_STACK};
  @media (max-width: 768px) {
    margin-bottom: 0;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 768px) {
      padding: 0 16px;
    }
  }
  .inner-container,
  .header-links {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    column-gap: 32px;
  }
  .header-links {
    align-items: center;
    @media (max-width: 768px) {
      display: none;
    }
  }
  .header-links a {
    color: ${COLORS.GREY.G2};
    font-weight: ${SOLEIL.REGULAR};
    font-size: 16px;
    line-height: 24px;
  }
`;

const StyledLogo = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 10px;
  align-items: center;
  justify-self: left;
  justify-content: left;
  max-width: 111px;
  img {
    height: 34px;
    width: 111px;
    object-fit: contain;
  }
  @media (max-width: 768px) {
    display: grid;
    grid-auto-flow: column;
  }
`;

const StyledCta = styled.a`
  display: block;
  width: max-content;
  background-color: ${COLORS.RHAPSODY};
  padding: 8px 12px;
  border-radius: 4px;
  color: ${COLORS.WHITE};
  font-weight: ${SOLEIL.REGULAR};
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  @media (max-width: 768px) {
    display: none;
  }
`;

type HeaderLinksProp = {
  link: string;
  label: string;
  multiLevel: any[];
};
type HeaderProps = {
  logoUrl: string;
  logoAltText: string;
  showTicketsCta: boolean;
  headerLinks: Array<HeaderLinksProp>;
  ticketsCtaLink: string;
};

const Header: FunctionComponent<HeaderProps> = ({
  logoUrl,
  logoAltText,
  showTicketsCta,
  headerLinks,
  ticketsCtaLink,
}) => {
  const [scrollPos, setScrollPos] = useState(0);
  useEffect(() => {
    if (!window) return;
    const scrollHandler = () => {
      setScrollPos(window.pageYOffset);
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }, [scrollPos]);

  return (
    <>
      <StyledHeader>
        <div className="container">
          <div className="inner-container">
            <StyledLogo>
              <Image
                url={logoUrl}
                alt={logoAltText}
                dontLazyLoad
                isLogo
                height="34"
                width="111"
              />
            </StyledLogo>
          </div>
          <div className="inner-container">
            <Conditional if={headerLinks?.length}>
              <div className="header-links">
                {headerLinks?.map((link, index) => {
                  console.log(link);
                  if (link?.multiLevel?.length) {
                    return (
                      <MultiLevelMenu
                        key={index}
                        levelOneLabel={link?.label}
                        links={link?.multiLevel}
                      />
                    );
                  } else {
                    return (
                      <a key={index} href={link?.link}>
                        {link?.label}
                      </a>
                    );
                  }
                })}
              </div>
            </Conditional>
            {/* TODO: Add Currency Selector */}
            <Conditional if={showTicketsCta && scrollPos > 450}>
              <StyledCta href={ticketsCtaLink}>Buy Tickets</StyledCta>
            </Conditional>
          </div>
        </div>
      </StyledHeader>
    </>
  );
};

export default Header;
