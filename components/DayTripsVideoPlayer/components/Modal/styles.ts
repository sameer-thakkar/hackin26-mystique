import { Styles } from 'react-modal';

export const modalStyles: Styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 99,
  },
  content: {
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    width: '100%',
    backgroundColor: 'transparent',
    maxWidth: '1000px',
    boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    zIndex: 999,
    padding: 0,
    inset: 0,
    border: 0,
    aspectRatio: '16 / 9',
  },
};
