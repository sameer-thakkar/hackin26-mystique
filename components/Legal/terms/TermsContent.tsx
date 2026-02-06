import Link from 'next/link';
import { Box } from '@headout/eevee';
import {
  contentContainer,
  heading,
  lastUpdated,
  legalLink,
  termsList,
  termsSectionTitle,
} from './styles';
import type { TSection } from './types';

type TTermsContentProps = {
  title: string;
  lastUpdatedDate: string;
  introduction: string;
  sections: TSection[];
  linkText: string;
  linkHref: string;
};

const SectionItem = ({
  item,
  keyPrefix,
}: {
  item: TSection['items'][number];
  keyPrefix: string;
}) => {
  if (typeof item === 'string') {
    return <>{item}</>;
  }

  return (
    <>
      {item.text}
      <ol>
        {item.subItems.map((subItem: string, subIndex: number) => (
          <li key={`${keyPrefix}-${subIndex}`}>{subItem}</li>
        ))}
      </ol>
    </>
  );
};

const Section = ({
  section,
  sectionIndex,
}: {
  section: TSection;
  sectionIndex: number;
}) => (
  <li key={section.title}>
    <Box className={termsSectionTitle}>{section.title}</Box>
    <ol>
      {section.items.map((item, itemIndex) => (
        <li key={`${sectionIndex}-${itemIndex}`}>
          <SectionItem item={item} keyPrefix={`${sectionIndex}-${itemIndex}`} />
        </li>
      ))}
    </ol>
  </li>
);

const TermsContent = ({
  title,
  lastUpdatedDate,
  introduction,
  sections,
  linkText,
  linkHref,
}: TTermsContentProps) => {
  return (
    <main className={contentContainer} data-qa-marker="terms-container">
      <h1 className={heading} data-qa-marker="terms-heading">
        {title}
      </h1>
      <p className={lastUpdated}>
        <b>Last Updated:</b> {lastUpdatedDate}
      </p>

      <p>{introduction}</p>

      <ol className={termsList} data-qa-marker="terms-content">
        {sections.map((section: TSection, sectionIndex: number) => (
          <Section
            key={section.title}
            section={section}
            sectionIndex={sectionIndex}
          />
        ))}
      </ol>

      <Link href={linkHref} className={legalLink}>
        {linkText}
      </Link>
    </main>
  );
};

export default TermsContent;
