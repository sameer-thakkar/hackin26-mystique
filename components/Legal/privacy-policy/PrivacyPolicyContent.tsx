import Link from 'next/link';
import {
  contentContainer,
  lastUpdated,
  legalLink,
  pageHeading,
  policyList,
  policySectionStyles,
  sectionHeading,
} from './styles';
import type { TContentBlock } from './types';
import { renderContentBlock } from './utils';

type TPrivacyPolicySection = {
  title: string;
  content: TContentBlock[];
};

type TPrivacyPolicyContentProps = {
  title: string;
  lastUpdatedDate: string;
  sections: TPrivacyPolicySection[];
  linkText: string;
  linkHref: string;
};

const PrivacyPolicyContent = ({
  title,
  lastUpdatedDate,
  sections,
  linkText,
  linkHref,
}: TPrivacyPolicyContentProps) => {
  return (
    <main className={contentContainer}>
      <h1 className={pageHeading} data-qa-marker="pp-heading">
        {title}
      </h1>
      <p className={lastUpdated}>
        <b>Last Updated:</b> {lastUpdatedDate}
      </p>
      <ol className={policyList} data-qa-marker="pp-content">
        {sections.map((section, sectionIndex) => (
          <li key={sectionIndex} className={policySectionStyles}>
            <h2 className={sectionHeading}>{section.title}</h2>
            {section.content.map((contentBlock, contentIndex) =>
              renderContentBlock(contentBlock, contentIndex)
            )}
          </li>
        ))}
      </ol>

      <Link href={linkHref} className={legalLink}>
        {linkText}
      </Link>
    </main>
  );
};

export default PrivacyPolicyContent;
