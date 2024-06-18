import React, { useState } from 'react';
import Link from 'next/link';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import { TailedArrowSVG } from 'assets/airportTransfers';
import Minus from 'assets/minus';
import Plus from 'assets/plus';
import {
  Container,
  Cta,
  Heading,
  SubCardContainer,
  SubCardContentContainer,
  SubCardContentTextContainer,
  SubCardHeadingContainer,
} from './styles';
import { PassesByCardProps } from './types';

const PassingBySubCard = ({
  title,
  image,
  description,
  link,
}: PassesByCardProps['stops'][0]) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasContent = image || description;

  const isLink = !hasContent && link;

  return (
    <SubCardContainer
      $isOpen={isOpen}
      {...(isLink && { href: link!, as: 'a', target: '_blank' })}
    >
      <SubCardHeadingContainer
        onClick={() => {
          if (!isLink) setIsOpen(!isOpen);
        }}
      >
        <Image
          url={image!}
          alt="stop-image"
          height={20}
          width={32}
          priority
          fetchPriority={'high'}
          fill
          aspectRatio="16:10"
          autoCrop={false}
        />
        <p className="passing-by-sub-card-title">{title}</p>
        <Conditional if={isLink}>
          <TailedArrowSVG className="arrow-link" />
        </Conditional>
        <Conditional if={hasContent}>
          <>
            <Conditional if={!isOpen}>
              <Plus />
            </Conditional>
            <Conditional if={isOpen}>
              <Minus />
            </Conditional>
          </>
        </Conditional>
      </SubCardHeadingContainer>
      <Conditional if={isOpen}>
        <SubCardContentContainer>
          <Conditional if={image}>
            <div className="passing-by-sub-card-content-child passing-by-sub-card-content-image-section">
              <Image
                url={image!}
                alt="stop-image"
                height={160}
                width={256}
                priority
                fetchPriority={'high'}
                fill
                aspectRatio="16:10"
                autoCrop={false}
              />
              <Conditional if={!description && link}>
                <Link href={link!} passHref>
                  <Cta>
                    CTA copy <TailedArrowSVG />
                  </Cta>
                </Link>
              </Conditional>
            </div>
          </Conditional>
          <Conditional if={description}>
            <div className="passing-by-sub-card-content-child passing-by-sub-card-content-text-section">
              <SubCardContentTextContainer>
                <div
                  className="sub-card-description"
                  dangerouslySetInnerHTML={{ __html: description! }}
                />
              </SubCardContentTextContainer>
            </div>
          </Conditional>
        </SubCardContentContainer>
      </Conditional>
    </SubCardContainer>
  );
};

const PassesByCard = ({ stops }: PassesByCardProps) => {
  return (
    <Container>
      <Heading>{strings.ITINERARY.PASSES_BY_SECTION_HEADING}</Heading>
      {stops.map((stop, index) => (
        <PassingBySubCard {...stop} key={`passing-by-${index}`} />
      ))}
    </Container>
  );
};

export default PassesByCard;
