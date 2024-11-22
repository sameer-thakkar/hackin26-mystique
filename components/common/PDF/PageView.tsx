import { useCallback, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';
import { useRecoilValue } from 'recoil';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import Image from 'UI/Image';
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
import { getExtension } from './utils';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const MAX_WIDTH = 840;

const PdfViewer = (props: TPdfViewer) => {
  const { documentSrc, setIsScrolled } = props || {};
  const [numPages, setNumPages] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number | string>(1);
  const [pageScale, setPageScale] = useState<number>(1);
  const [isInitialState, setIsInitialState] = useState<boolean>(true);
  const { isMobile } = useRecoilValue(appAtom);

  const isPdf = getExtension(documentSrc) === '.pdf';
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
    setIsLoaded(true);
    setNumPages(nextNumPages);
  };

  useEffect(() => {
    if (!isLoaded) return;
    const options = {
      root: null,
      rootMargin: isMobile ? '0% 0% -20% 0%' : '0% 0% -50% 0%',
      threshold: isMobile ? 0.4 : 0.2,
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
    const { zoomIn, zoomOut, resetTransform, centerView } = useControls();
    return (
      <Controls>
        <span className="page-number">
          {pageNumber} / {numPages}
        </span>
        <Conditional if={!isMobile}>
          <>
            <ControlBtn
              onClick={() => {
                pageScale > 1 && setPageScale(pageScale - pageScale * 0.25);
                zoomOut(0.25);
              }}
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
              onClick={() => {
                pageScale < 2
                  ? (setPageScale(2), centerView(2))
                  : (setPageScale(1), resetTransform());
              }}
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
              onClick={() => {
                pageScale < 2 && setPageScale(pageScale + pageScale * 0.25);
                zoomIn(0.25);
              }}
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
    <Container
      onScroll={(e) =>
        setIsScrolled((e.target as HTMLDivElement).scrollTop > 20)
      }
      $initialState={isInitialState}
    >
      <TransformWrapper
        minScale={1}
        maxScale={2.5}
        wheel={{ smoothStep: 0.01, wheelDisabled: true }}
        panning={{ disabled: true }}
        onZoom={(e) => {
          setIsScrolled(e.state.scale > 1);
          setIsInitialState(false);
        }}
        {...(!isMobile && {
          initialPositionX:
            (window.innerWidth -
              (containerWidth
                ? Math.min(containerWidth, MAX_WIDTH)
                : MAX_WIDTH)) /
            2,
        })}
      >
        <div className="pageview-wrapper" ref={setContainerRef}>
          <TransformComponent wrapperClass="zoom-wrapper">
            <Conditional if={isPdf}>
              <Document
                file={documentSrc}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
                loading={<></>}
              >
                {Array.from(new Array(numPages), (_el, index) => (
                  <Page
                    key={`page_${index + 1}`}
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
            </Conditional>
            <Conditional if={!isPdf}>
              <Image
                url={documentSrc}
                alt={documentSrc}
                fitCrop={false}
                autoCrop={false}
                fetchPriority="high"
                placeholder="blur"
                className="pdf-img"
                priority={true}
              />
            </Conditional>
          </TransformComponent>
          <ControlPanel />
        </div>
      </TransformWrapper>
    </Container>
  );
};

export default PdfViewer;
