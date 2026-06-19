import styled from 'styled-components';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';
import COLORS from 'const/colors';

const BannerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: #faeeda;
  border-left: 4px solid #f59e0b;
  border-radius: 0 0.5rem 0.5rem 0;
  margin-bottom: 0.75rem;
`;

const BannerLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex: 1;
`;

const BoltIcon = styled.span`
  font-size: 1.125rem;
  line-height: 1.4;
  flex-shrink: 0;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const Title = styled.p`
  margin: 0;
  color: ${COLORS.GRAY.G2};
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.UI_LABEL_SMALL)}
`;

const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.875rem;
  background: #f59e0b;
  color: #ffffff;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)}

  &:hover {
    background: #d97706;
  }
`;

type SellBackBannerProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCta: () => void;
};

const SellBackBanner = ({ title, subtitle, ctaLabel, onCta }: SellBackBannerProps) => {
  return (
    <BannerWrapper>
      <BannerLeft>
        <BoltIcon>⚡</BoltIcon>
        <TextBlock>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </TextBlock>
      </BannerLeft>
      <CtaButton onClick={onCta} type="button">
        {ctaLabel} →
      </CtaButton>
    </BannerWrapper>
  );
};

export default SellBackBanner;
