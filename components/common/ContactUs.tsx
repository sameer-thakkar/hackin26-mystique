import styled, { css } from 'styled-components';
import { Box, Text } from '@headout/eevee';
import { css as pixieCss } from '@headout/pixie/css';
import Drawer from 'components/common/Drawer';
import COLORS from 'const/colors';
import { HO_CONTACT_NUMBERS } from 'const/contacts';
import { strings } from 'const/strings';

type MobileCallUsPanelDrawerProps = {
  onToggleMobileCallUsDrawer: () => void;
};

const ContactsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 0;
  min-width: 0;
  font-weight: 300;
  justify-content: space-between;
  align-items: center;
`;

const ContactsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-basis: auto;
`;

const ContactCountry = styled.div`
  color: ${COLORS.GRAY.G2};
  font-size: 0.938rem;
`;

const ContactNumber = styled.div`
  text-decoration-line: underline;
  text-decoration-color: ${COLORS.TEXT.CANDY_1};
  text-decoration-style: solid;
  font-size: 0.875rem;
  color: ${COLORS.TEXT.CANDY_1};
  flex-shrink: 0;
`;

const mobileCallUsPanelStyles = css`
  .call_us_panel_drawer {
    height: 64.5vh;
    -webkit-overflow-scrolling: touch;
    grid-row-gap: unset;

    & > div:nth-child(1) {
      grid-row-gap: 1rem;
      padding: 0 1.5rem;
      svg {
        grid-row: 2;
      }
      & > div:nth-child(1) {
        grid-column: 1/3;
      }
    }
    & > div:nth-child(2) {
      padding: 0 1.5rem;
      overflow-y: scroll;
    }
  }
  .close-icon {
    padding-left: 0.6rem;
    cursor: pointer;
  }
`;

const disclaimerContainer = pixieCss({
  padding: 'space.12',
  borderRadius: 'radius.8',
  backgroundColor: 'semantic.surface.light.grey.2',
  display: 'flex',
  flexDirection: 'column',
  gap: 'space.10',
});

const disclaimerSubtitleContainer = pixieCss({
  display: 'flex',
  flexDirection: 'column',
  gap: 'space.6',
  paddingLeft: 'space.16',
  listStyleType: 'disc',
  margin: 0,
});

const disclaimerHeading = pixieCss({
  color: 'text.grey.2',
  textStyle: 'ui.label.medium.heavy',
});

const disclaimerSubtext = pixieCss({
  textStyle: 'para.regular',
  color: 'text.grey.2',
});

const ContactUs = () => {
  return (
    <ContactsContainer>
      <Box className={disclaimerContainer}>
        <Text className={disclaimerHeading}>
          {strings.FOOTER.FT_CALL_US_DISCLAIMER.HEADING}
        </Text>
        <Box as="ul" className={disclaimerSubtitleContainer}>
          <Box as="li">
            <Text as="span" className={disclaimerSubtext}>
              {strings.FOOTER.FT_CALL_US_DISCLAIMER.SUBTEXT1}
            </Text>
          </Box>
          <Box as="li">
            <Text as="span" className={disclaimerSubtext}>
              {strings.FOOTER.FT_CALL_US_DISCLAIMER.SUBTEXT2}
            </Text>
          </Box>
        </Box>
      </Box>
      {HO_CONTACT_NUMBERS.map((contact, index) => {
        return (
          <ContactsWrapper key={index}>
            <ContactCountry>{contact.countryName}</ContactCountry>
            <ContactNumber>
              <a href={`tel:${contact.phoneNumber}`}>{contact.phoneNumber}</a>
            </ContactNumber>
          </ContactsWrapper>
        );
      })}
    </ContactsContainer>
  );
};

export const MobileCallUsPanelDrawer: React.FC<
  React.PropsWithChildren<MobileCallUsPanelDrawerProps>
> = ({ onToggleMobileCallUsDrawer }) => {
  return (
    <Drawer
      $drawerStyles={mobileCallUsPanelStyles}
      noMargin
      className="call_us_panel_drawer"
      heading={strings.FOOTER.CALL_US}
      closeHandler={onToggleMobileCallUsDrawer}
    >
      <ContactUs />
    </Drawer>
  );
};

export default ContactUs;
