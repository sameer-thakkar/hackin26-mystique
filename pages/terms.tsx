import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import LocalisedTermsPage from 'pages/[lang]/terms';
import { traceError } from 'utils/logutils';
import getLegalPageData from 'utils/prismicUtils/legalPages';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data = await getLegalPageData(context);
    return data;
  } catch (error) {
    const { req } = context;
    traceError({ error, host: req?.headers?.host, url: req?.url });
    return {
      props: {},
    };
  }
};

const TermsPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return <LocalisedTermsPage {...props} />;
};

export default TermsPage;
