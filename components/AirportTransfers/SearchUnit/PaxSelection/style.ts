import styled from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const PaxSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 1.25rem;

  @media (min-width: 769px) {
    padding: 0 1rem;
  }
`;

export const PaxItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  gap: 1.5rem;

  .label {
    ${getFontDetailsByLabel(FONTS.UI_LABEL_MEDIUM_HEAVY)}
    color: ${COLORS.GRAY.G2};
    margin: 0;
  }

  .pax-description {
    ${getFontDetailsByLabel(FONTS.UI_LABEL_XS)}
    color: ${COLORS.GRAY.G4};
    margin-top: 0.25rem;
  }

  @media (max-width: 768px) {
    border-bottom: 1px dashed ${COLORS.GRAY.G6};
    padding-bottom: 1.25rem;
    .label {
      font-size: 0.9375rem;
    }
    .pax-description {
      ${getFontDetailsByLabel(FONTS.UI_LABEL_REGULAR)}
    }
  }
`;

export const CoreNumberPicker = styled.div`
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;

  .action-handle {
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    border: none;
    cursor: pointer;
    display: flex;
    padding-inline: 0;
    background: none;
  }
  .disabled {
    background: #f0f0f0;
    color: #888;
    cursor: auto;
  }
  .value {
    color: #545454;
    font-family: halyard-text, sans-serif;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    margin: 0;
    text-align: center;
    width: 0.875rem;
  }
`;
