import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import LocalisedPrivacyPage from 'pages/[lang]/privacy-policy';
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

const PrivacyPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return <LocalisedPrivacyPage {...props} />;
};

export default PrivacyPage;
