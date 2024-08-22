import { useCallback, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useRecoilValue } from 'recoil';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import useResizeObserver from 'hooks/useResizeObserver';
import { appAtom } from 'store/atoms/app';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import Minus from 'assets/minus';
import Plus2 from 'assets/plus2';
import ResetZoom from 'assets/resetZoomIcon';
import ZoomIcon from 'assets/zoomIcon';
import Conditional from '../Conditional';
import { Container, ControlBtn, Controls } from './styles';
import { TPdfViewer } from './types';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const MAX_WIDTH = 840;

const PdfViewer = (props: TPdfViewer) => {
  const { documentSrc } = props || {};
  const [numPages, setNumPages] = useState<number>(1);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number | string>(1);
  const [pageScale, setPageScale] = useState<number>(1);
  const { isMobile } = useRecoilValue(appAtom);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver({ element: containerRef, observerCallback: onResize });

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
  };

  useEffect(() => {
    if (!numPages) return;
    const options = {
      root: null,
      rootMargin: '0% 0% -50% 0%',
      threshold: 0.2,
    };

    const handleIntersection = (entries?: IntersectionObserverEntry[]) => {
      entries?.forEach((entry) => {
        if (entry.isIntersecting) {
          setPageNumber(entry.target.getAttribute('data-page-number') ?? 1);
        }
      });
    };
    const observer = new IntersectionObserver(handleIntersection, options);
    document.querySelectorAll('.react-pdf__Page').forEach((page) => {
      observer.observe(page);
    });

    return () => {
      observer.disconnect();
    };
  }, [numPages]);

  const ControlPanel = () => {
    return (
      <Controls>
        <span className="page-number">
          {pageNumber} / {numPages}
        </span>
        <Conditional if={!isMobile}>
          <>
            <ControlBtn
              onClick={() =>
                pageScale > 1 && setPageScale(pageScale - pageScale * 0.25)
              }
              $isDisabled={pageScale <= 1}
            >
              <span className="control-text">
                <Minus stroke={COLORS.BRAND.WHITE} />
              </span>
              <span className="tooltiptext">
                {strings.CRUISES.PDF.ZOOM_OUT}
              </span>
            </ControlBtn>
            <ControlBtn
              onClick={() =>
                pageScale < 2 ? setPageScale(2) : setPageScale(1)
              }
            >
              <span>
                <Conditional if={pageScale < 2}>
                  <ZoomIcon />
                </Conditional>
                <Conditional if={pageScale >= 2}>
                  <ResetZoom />
                </Conditional>
              </span>
              <span className="tooltiptext">
                {pageScale < 2
                  ? strings.CRUISES.PDF.FIT_TO_WIDTH
                  : strings.CRUISES.PDF.RESET_ZOOM}
              </span>
            </ControlBtn>
            <ControlBtn
              onClick={() =>
                pageScale < 2 && setPageScale(pageScale + pageScale * 0.25)
              }
              $isDisabled={pageScale > 2}
            >
              <span className="control-text">
                <Plus2 stroke={COLORS.BRAND.WHITE} />
              </span>
              <span className="tooltiptext">{strings.CRUISES.PDF.ZOOM_IN}</span>
            </ControlBtn>
          </>
        </Conditional>
      </Controls>
    );
  };

  return (
    <Container>
      <div className="pageview-wrapper" ref={setContainerRef}>
        <TransformWrapper
          minScale={1}
          maxScale={2}
          wheel={{ smoothStep: 0.01, wheelDisabled: true }}
        >
          <TransformComponent wrapperClass="zoom-wrapper">
            <Document
              file={documentSrc}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
              loading={<></>}
            >
              {Array.from(new Array(numPages), (_el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  scale={pageScale}
                  pageNumber={index + 1}
                  width={
                    containerWidth
                      ? Math.min(containerWidth, MAX_WIDTH)
                      : MAX_WIDTH
                  }
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
            </Document>
          </TransformComponent>
          <ControlPanel />
        </TransformWrapper>
      </div>
    </Container>
  );
};

export default PdfViewer;
