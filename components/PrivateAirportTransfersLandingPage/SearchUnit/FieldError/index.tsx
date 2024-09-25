import styled from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { InfoIconRed } from 'assets/airportTransfers/searchUnitSVGs';

export const FieldError = ({
  text,
  className,
  show,
}: {
  text: string;
  className?: string;
  show: boolean;
}) => {
  if (show)
    return (
      <FieldErrorContainer className={className}>
        <InfoIconRed />

        <ErrorText>{text}</ErrorText>
      </FieldErrorContainer>
    );

  return null;
};

const FieldErrorContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;

  svg {
    margin-top: 0.1rem;
  }
`;

const ErrorText = styled.div`
  color: ${COLORS.TEXT.WARNING_RED_1};
  ${getFontDetailsByLabel(FONTS.UI_LABEL_SMALL)};
  font-size: 0.75rem;
`;
