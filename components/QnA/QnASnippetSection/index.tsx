import React from 'react';
import { QnAContainer } from 'components/StaticBanner';
import { sentenceCase } from 'utils/stringUtils';
import LfcQnaSnippet from './components/Qna';

type TabItemType = {
  body: React.ReactNode;
  header: any;
};

export const createTabItem = (section: QnAContainer): TabItemType => {
  return {
    body: <LfcQnaSnippet qnaSections={section} />,
    header: sentenceCase(section.type),
  };
};
