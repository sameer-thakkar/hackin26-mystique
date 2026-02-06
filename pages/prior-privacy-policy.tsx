import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import LocalisedPriorPrivacyPage from 'pages/[lang]/prior-privacy-policy';
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

const PriorPrivacyPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return <LocalisedPriorPrivacyPage {...props} />;
};

export default PriorPrivacyPage;
