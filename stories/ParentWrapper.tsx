import React from 'react';
import { RecoilRoot } from 'recoil';

const ParentWrapper = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default ParentWrapper;
