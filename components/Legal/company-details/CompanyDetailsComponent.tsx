import React from 'react';
import { Box, Text } from '@headout/eevee';
import LinkCTA from 'components/common/LinkCTA';
import { strings } from 'const/strings';
import {
  COMPANY_DETAILS,
  LEGAL_INFO_FIELDS,
  LEGAL_NOTICE_FIELDS,
} from './constants';
import { styles } from './styles';
import { TLegalListValueProps } from './types';

const LegalListValue: React.FC<TLegalListValueProps> = ({
  value,
  isArray,
  isLink,
}) => {
  if (isLink) {
    return (
      <LinkCTA
        as="anchor"
        target="_blank"
        href={`mailto:${value as string}`}
        text={value as string}
        size="large"
        linkType="primary"
      />
    );
  }

  if (isArray) {
    return (
      <Box>
        {(value as string[]).map((line, idx) => (
          <Text key={idx} className={styles.contentListItemValue}>
            {line}
          </Text>
        ))}
      </Box>
    );
  }

  return <Text className={styles.contentListItemValue}>{value as string}</Text>;
};

const CompanyDetailsComponent = () => {
  return (
    <Box className={styles.pageWrapper}>
      <Text className={styles.pageTitle}>
        {strings.COMPANY_DETAILS_CONTENT.title}
      </Text>

      <Box className={styles.section}>
        <Text className={styles.sectionTitle}>
          {strings.COMPANY_DETAILS_CONTENT.LEGAL_INFO.title}
        </Text>
        <Box className={styles.contentListWrapper}>
          {LEGAL_INFO_FIELDS.map(({ key, isArray }) => (
            <Box key={key} className={styles.contentListItem}>
              <Text className={styles.contentListItemKey}>
                {strings.COMPANY_DETAILS_CONTENT.LEGAL_INFO[key]}
              </Text>
              <LegalListValue
                value={COMPANY_DETAILS.LEGAL_INFO[key]}
                isArray={isArray}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box className={styles.section}>
        <Text className={styles.sectionTitle}>
          {strings.COMPANY_DETAILS_CONTENT.LEGAL_NOTICE.title}
        </Text>
        <Box className={styles.contentListWrapper}>
          <Text className={styles.content}>
            {strings.COMPANY_DETAILS_CONTENT.LEGAL_NOTICE.content}
          </Text>
          {LEGAL_NOTICE_FIELDS.map(({ key, isLink, isArray }) => (
            <Box key={key} className={styles.contentListItem}>
              <Text className={styles.contentListItemKey}>
                {strings.COMPANY_DETAILS_CONTENT.LEGAL_NOTICE[key]}
              </Text>
              <LegalListValue
                value={COMPANY_DETAILS.LEGAL_NOTICE[key]}
                isLink={isLink}
                isArray={isArray}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box className={styles.section}>
        <Text className={styles.sectionTitle}>
          {strings.COMPANY_DETAILS_CONTENT.ODR.title}
        </Text>
        <Text className={styles.content}>
          {strings.COMPANY_DETAILS_CONTENT.ODR.content}
        </Text>
        <LinkCTA
          as="anchor"
          target="_blank"
          href={COMPANY_DETAILS.ODR_LINK}
          text={COMPANY_DETAILS.ODR_LINK}
          linkType="primary"
          heavy
        />
      </Box>
    </Box>
  );
};

export default CompanyDetailsComponent;
