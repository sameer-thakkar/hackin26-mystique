import React from 'react';
import ListicleSection from '../../../components/slices/ListicleSection';
import { repeat } from '../../../utils/storybook';
import sliceData from './data.json';

export default {
  title: 'Slices/Listicle Section',
  component: ListicleSection,
};

export const Large = () => {
  return (
    <div style={{ width: 690, margin: 50 }}>
      <ListicleSection
        title="Listicle Section"
        type="large"
        slices={repeat(sliceData, 3)}
      />
    </div>
  );
};

export const Medium = () => {
  return (
    <div style={{ width: 690, margin: 50 }}>
      <ListicleSection
        title="Listicle Section"
        type="medium"
        slices={repeat(sliceData, 3)}
      />
    </div>
  );
};

export const Small = () => {
  return (
    <div style={{ width: 690, margin: 50 }}>
      <ListicleSection
        title="Listicle Section"
        type="small"
        slices={repeat(sliceData, 3)}
      />
    </div>
  );
};
