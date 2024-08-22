import { memo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useRecoilValue } from 'recoil';
import PdfPopup from 'components/common/PDF';
import { appAtom } from 'store/atoms/app';
import { strings } from 'const/strings';
import { TController } from '../Popup/interface';
import MenuCard from './MenuCard';
import { MenuList } from './styles';
import { TMenuSection } from './types';

const MenuSection = (props: TMenuSection) => {
  const { menuData = [], tgid } = props;
  const pdfPopupController = useRef<TController>();
  const { isMobile } = useRecoilValue(appAtom);

  return (
    <>
      <h6> {strings.CRUISES.FOOD_MENU}</h6>
      <MenuList>
        {menuData?.map((menu: Record<string, any>, index: number) => {
          const { name, url } = menu;
          return (
            <MenuCard
              key={index}
              title={name}
              url={url}
              index={index}
              popupController={pdfPopupController}
            />
          );
        })}
      </MenuList>
      {ReactDOM.createPortal(
        <PdfPopup
          tgid={tgid}
          controller={pdfPopupController}
          pdfData={menuData}
          onHide={
            isMobile
              ? () => {
                  document.body.style.overflow = 'auto';
                }
              : undefined
          }
        />,
        document.body
      )}
    </>
  );
};

export default memo(MenuSection);
