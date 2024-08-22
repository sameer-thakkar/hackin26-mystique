import { PrismicRichText } from '@prismicio/react';
import { shortCodeSerializer } from 'utils/shortCodes';
import { strings } from 'const/strings';
import { InclusionExclusionWrapper } from './styles';

const InclusionsExclusions = (props: any) => {
  const { inclusionsExclusions } = props || {};
  const { inclusions = [], exclusions = [] } = inclusionsExclusions || {};
  return (
    <>
      <h6 className="inclusions-heading">{strings.INCLUSIONS}</h6>
      <InclusionExclusionWrapper>
        <span className="inclusion">
          <PrismicRichText
            field={inclusions}
            components={shortCodeSerializer}
          />
        </span>
        <span className="exclusion">
          <PrismicRichText
            field={exclusions}
            components={shortCodeSerializer}
          />
        </span>
      </InclusionExclusionWrapper>
    </>
  );
};

export default InclusionsExclusions;
