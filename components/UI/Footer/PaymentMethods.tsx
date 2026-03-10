import styled from 'styled-components';
import Image from 'UI/Image';
import { IDEAL_ICON, PAYMENT_CARD_ICONS, REVOLUT_ICON } from 'const/footer';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 2.33rem);
`;

const GridItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.87rem;
  height: 1.87rem;
`;

const IDealGridItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 1.87rem;
  grid-column: span 2;
`;

type TPaymentMethodsProps = {
  hasDarkBg?: boolean;
};

export const PaymentMethods = ({ hasDarkBg }: TPaymentMethodsProps) => {
  const revolutLink = hasDarkBg ? REVOLUT_ICON.LIGHT : REVOLUT_ICON.DARK;

  const iconList: Array<{
    name: string;
    link: string;
    Container?: typeof GridItem;
  }> = [
    ...Object.entries(PAYMENT_CARD_ICONS).map(([name, link]) => ({
      name,
      link,
    })),
    { name: REVOLUT_ICON.NAME, link: revolutLink },
    { name: IDEAL_ICON.NAME, link: IDEAL_ICON.LINK, Container: IDealGridItem },
  ];

  return (
    <Grid>
      {iconList.map(({ name, link, Container = GridItem }) => (
        <Container key={name}>
          <Image fitCrop={true} url={link} alt={name} />
        </Container>
      ))}
    </Grid>
  );
};
