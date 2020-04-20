import React from 'react';
import Button from '../../components/UI/Button';

export default {
  title: 'UI/Button',
  component: Button,
};

export const Bordered = () => <Button>Book Now</Button>;

export const Fill = () => <Button type="fill">Book Now</Button>;

export const FillGradient = () => <Button type="fillGradient">Book Now</Button>;

export const WhiteBordered = () => (
  <div style={{ background: 'green', padding: '5%' }}>
    <Button type="whiteBordered">Book Now</Button>
  </div>
);
