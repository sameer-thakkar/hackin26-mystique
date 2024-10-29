import { useState } from 'react';
import { Document, pdfjs, Thumbnail } from 'react-pdf';
import { useRecoilValue } from 'recoil';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { appAtom } from 'store/atoms/app';
import { strings } from 'const/strings';
import { Card } from './styles';
import { TMenuCard } from './types';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};
const MenuCard = ({ title, url, index, popupController }: TMenuCard) => {
  const [numPages, setNumPages] = useState<number>(1);
  const { isMobile } = useRecoilValue(appAtom);
  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
  };
  return (
    <div>
      <Card onClick={() => popupController.current?.open(index)}>
        <Document
          loading={<></>}
          onLoadSuccess={onDocumentLoadSuccess}
          file={url}
          options={options}
        >
          <Thumbnail pageNumber={1} width={isMobile ? 118 : 172} />
        </Document>
      </Card>
      <div className="description">
        <p className="title">{title}</p>
        <p className="subtext">
          {numPages === 1
            ? strings.formatString(strings.CRUISES.X_PAGE, numPages)
            : strings.formatString(strings.CRUISES.X_PAGES, numPages)}
        </p>
      </div>
    </div>
  );
};

export default MenuCard;
