import LazyComponent from 'components/common/LazyComponent';
import { stringIdfy } from 'utils/helper';
import { FULL_WIDTH_SLICES } from 'const/index';
import { StyledTabContent } from './Tab';

export const sliceWrapper = (children: React.ReactNode, props: any) => {
  const { slice, index, context } = props;
  if (slice?.primary?.hide_slice) return null;
  
  const {
    isContentPage,
    wrapperType,
    activeTabId = '',
    tabTitle = '',
  } = context || {};

  const shouldLazyLoad = isContentPage ? index > 2 : true;
  switch (wrapperType) {
    case 'none':
      return <>{children}</>;
    case 'tab': {
      const finalTabTitle = tabTitle || slice?.primary?.title;
      return (
        <StyledTabContent
          key={index}
          isActive={activeTabId == stringIdfy(finalTabTitle)}
        >
          {children}
        </StyledTabContent>
      );
    }
    case 'footer':
      return (
        <div className={`${slice.slice_type}`} key={index}>
          {children}
        </div>
      );

    case 'v2-homepage':
      return (
        <div
          key={`${slice?.slice_type}-${index}`}
          className={`slice-block ${slice.slice_type}`}
        >
          {children}
        </div>
      );
    default:
      return (
        <div
          key={`long-form-${slice?.slice_type}-${index}`}
          className={`${
            !FULL_WIDTH_SLICES.includes(slice.slice_type) ? 'slice-wrapper' : ''
          } slice-block ${slice.slice_type}`}
        >
          <LazyComponent target={shouldLazyLoad ? 'USER' : 'NONE'}>
            {children}
          </LazyComponent>
        </div>
      );
  }
};
