import styled from 'styled-components';
import Icon from '@headout/aer/src/atoms/Icon';
import { PAYMENT_CARD_ICONS } from 'const/footer';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 2.33rem);
`;

const GridItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.87rem;
  height: 1.87rem;
`;

export const PaymentMethods: React.FC = () => {
  const PAYMENT_METHODS = Object.entries(PAYMENT_CARD_ICONS);

  return (
    <Grid>
      {PAYMENT_METHODS.map(([iconName, iconURL]) => {
        return (
          <GridItem key={iconName}>
            <Icon src={iconURL} alt={iconName} />
          </GridItem>
        );
      })}
    </Grid>
  );
};
