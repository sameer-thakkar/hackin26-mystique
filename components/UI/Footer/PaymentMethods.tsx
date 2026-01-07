import styled from 'styled-components';
import Image from 'UI/Image';
import { PAYMENT_CARD_ICONS, REVOLUT_ICON } from 'const/footer';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 2.33rem);
`;

const GridItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.87rem;
  height: 1.87rem;
`;

const PAYMENT_METHODS = Object.entries(PAYMENT_CARD_ICONS);

type TPaymentMethodsProps = {
  hasDarkBg?: boolean;
};

export const PaymentMethods = ({ hasDarkBg }: TPaymentMethodsProps) => {
  const revolutLink = hasDarkBg ? REVOLUT_ICON.LIGHT : REVOLUT_ICON.DARK;

  const iconList = [...PAYMENT_METHODS, [REVOLUT_ICON.NAME, revolutLink]];
  return (
    <Grid>
      {iconList.map(([iconName, iconURL]) => {
        return (
          <GridItem key={iconName}>
            <Image fitCrop={true} url={iconURL} alt={iconName} />
          </GridItem>
        );
      })}
    </Grid>
  );
};
