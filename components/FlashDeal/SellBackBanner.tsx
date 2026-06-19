import styled from 'styled-components';

const BannerStrip = styled.div`
  border-radius: 12px;
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(245, 158, 11, 0.12);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TextBlock = styled.div``;

const Headline = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 3px;
`;

const SubText = styled.p`
  font-size: 13px;
  color: #6b6b6b;
  margin: 0;
`;

const Highlight = styled.span`
  color: #f59e0b;
  font-weight: 700;
`;

const CtaButton = styled.button`
  background: #7c3aed;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: Inter, system-ui, sans-serif;
`;

type SellBackBannerProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCta: () => void;
};

const renderSubtitle = (subtitle: string) => {
  const match = subtitle.match(/(.*?)(20% off)(.*)/);
  if (!match) return subtitle;
  const [, before, highlight, after] = match;
  return (
    <>
      {before}
      <Highlight>{highlight}</Highlight>
      {after}
    </>
  );
};

const SellBackBanner = ({ title, subtitle, ctaLabel, onCta }: SellBackBannerProps) => {
  return (
    <BannerStrip>
      <LeftSection>
        <IconContainer>
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="#F59E0B"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </IconContainer>
        <TextBlock>
          <Headline>{title}</Headline>
          <SubText>{renderSubtitle(subtitle)}</SubText>
        </TextBlock>
      </LeftSection>
      <CtaButton type="button" onClick={onCta}>
        {ctaLabel}
      </CtaButton>
    </BannerStrip>
  );
};

export default SellBackBanner;
