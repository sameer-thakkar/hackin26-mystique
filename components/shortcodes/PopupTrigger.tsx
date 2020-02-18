import React, { useState, useEffect } from 'react';
import { Client } from '../../prismic-config';
import { CUSTOM_TYPES } from '../../constants';
import Popup from '../common/Popup';
import { COLORS } from '../../constants/ui-constants';

const PopupTrigger = props => {
  const { id, text, lang = 'en' } = props;
  const [active, setActive] = useState(null);
  const [data, setData] = useState(false);

  useEffect(() => {
    Client()
      .getByUID(CUSTOM_TYPES.POPUP, id, {
        lang: 'en-us',
      })
      .then(res => {
        const { data } = res;
        if (data) setData(data);
      });
  }, []);

  return (
    data && (
      <>
        <span onClick={() => setActive(!active)}>{text}</span>
        {active ? <Popup togglePopup={setActive} data={data} /> : null}
        <style jsx>{`
          span {
            color: ${COLORS.TEAL};
          }
        `}</style>
      </>
    )
  );
};

export default PopupTrigger;
