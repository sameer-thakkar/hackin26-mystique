import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';
import Masthead from 'components/Masthead';
import Alert from 'components/UI/Alert';
import { IGeneralContentPageProps } from '../interface';
import { ContentWrapper } from './styles';

const Breadcrumbs = dynamic(() =>
  import(/* webpackChunkName: "Breadcrumbs" */ 'components/Breadcrumbs')
);

const GeneralContentPage = ({
  alertPopup,
  featuredImage,
  currentLanguage,
  breadcrumbs,
  taggedCity,
  primaryCity,
  isMobile,
  data,
  automatedBreadcrumbsExists,
}: IGeneralContentPageProps) => {
  const { featured_title: featuredTitle } = data;

  return (
    <ContentWrapper>
      <Masthead
        title={featuredTitle}
        image={featuredImage?.url ? featuredImage : null}
        isMobile={!!isMobile}
      />
      <Conditional if={alertPopup}>
        <Alert popupUID={alertPopup?.uid} currentLanguage={currentLanguage} />
      </Conditional>
      <Conditional if={automatedBreadcrumbsExists}>
        <Breadcrumbs
          breadcrumbs={breadcrumbs || {}}
          taggedCity={taggedCity}
          primaryCity={primaryCity}
          isContentPage={true}
          isMobile={!!isMobile}
        />
      </Conditional>
    </ContentWrapper>
  );
};

export default GeneralContentPage;
