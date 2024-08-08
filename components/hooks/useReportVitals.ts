import { useEffect, useRef } from 'react';
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';
import { trackEvent } from 'utils/analytics';
import PlatformUtils from 'utils/platformUtils';

type TVitalsPayload = {
  worstInp: number;
  worstInpMeta?: {
    element: string;
    event: string | undefined;
  };
  lcp: number;
  fid: number;
  fcp: number;
  cls: number;
  ttfb: number;
};

const useReportVitals = () => {
  const initialValues: TVitalsPayload = {
    fid: 0,
    lcp: 0,
    fcp: 0,
    cls: 0,
    worstInp: 0,
    ttfb: 0,
  };

  const trackerRef = useRef<TVitalsPayload>(initialValues);

  useEffect(() => {
    if (PlatformUtils.isIPhone()) return;

    onTTFB((metric) => {
      trackerRef.current.ttfb = metric.value;
    });
    onLCP(
      (metric) => {
        if (metric.value > trackerRef.current.lcp)
          trackerRef.current.lcp = metric.value;
      },
      {
        reportAllChanges: true,
      }
    );
    onCLS(
      (metric) => {
        trackerRef.current.cls = metric.value;
      },
      {
        reportAllChanges: true,
      }
    );
    onFCP(
      (metric) => {
        trackerRef.current.fcp = metric.value;
      },
      {
        reportAllChanges: true,
      }
    );
    onFID(
      (metric) => {
        trackerRef.current.fid = metric.value;
      },
      {
        reportAllChanges: true,
      }
    );
    onINP(
      (metric) => {
        if (metric.value > trackerRef.current.worstInp) {
          trackerRef.current.worstInp = metric.value;
          const lastEntry = metric.entries[metric.entries.length - 1];
          const element = lastEntry?.target as HTMLElement;
          trackerRef.current.worstInpMeta = {
            element: element
              ? `${element['tagName']} ${element['id']} ${element['className']}`
              : '',
            event: lastEntry?.name,
          };
        }
      },
      {
        reportAllChanges: true,
      }
    );
  }, []);

  useEffect(() => {
    if (PlatformUtils.isIPhone()) return;

    const timer = setTimeout(() => {
      const { cls, fcp, fid, lcp, ttfb, worstInp, worstInpMeta } =
        trackerRef.current;
      const metrics = {
        LCP: lcp || null,
        FCP: fcp || null,
        CLS: cls || null,
        FID: fid || null,
        TTFB: ttfb || null,
        INP: worstInp || null,
        'INP Element': worstInpMeta?.element || null,
        'INP Event': worstInpMeta?.event || null,
      };

      trackEvent({
        eventName: 'Web Vitals Captured',
        ...metrics,
      });
    }, 12000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
};

export default useReportVitals;
