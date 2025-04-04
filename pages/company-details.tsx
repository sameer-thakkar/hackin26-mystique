import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import LocalisedCompanyDetailsPage from 'pages/[lang]/company-details';
import { traceError } from 'utils/logutils';
import getLegalPageData from 'utils/prismicUtils/legalPages';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data = getLegalPageData(context);
    return data;
  } catch (error) {
    const { req } = context;
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {
      props: {},
    };
  }
};

const CompanyDetailsPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return <LocalisedCompanyDetailsPage {...props} />;
};

export default CompanyDetailsPage;
