import { useMemo } from 'react';
import Accordion from 'components/common/Accordion';
import Conditional from 'components/common/Conditional';
import SubStopItemBody from './components/SubStopItemBody';
import SubStopItemHeader from './components/SubStopItemHeader';
import { SubStopsContainer, SubStopsTitle } from './styles';
import { SubStopCardProps } from './types';

type SubStopsProps = {
  subStops: SubStopCardProps[];
  title?: string;
  shouldExpandFirstItem?: boolean;
};

const SubStops = ({
  subStops,
  title,
  shouldExpandFirstItem = false,
}: SubStopsProps) => {
  const hasTitle = !!title;
  const items = useMemo(() => {
    return subStops.map((stop, index) => {
      const { description } = stop;
      return {
        header: <SubStopItemHeader stop={stop} />,
        body: <SubStopItemBody description={description} />,
        isExpandable: !!description,
        defaultExpanded: shouldExpandFirstItem && index === 0,
      };
    });
  }, [subStops, shouldExpandFirstItem]);

  return (
    <SubStopsContainer $hasTitle={hasTitle}>
      <Conditional if={hasTitle}>
        <SubStopsTitle>{title}</SubStopsTitle>
      </Conditional>
      <Accordion
        items={items}
        itemStyles={{ borderRadius: '0.75rem' }}
        containerClassName="sub-stops-accordion-container"
        itemClassName="sub-stops-accordion-item"
      />
    </SubStopsContainer>
  );
};

export default SubStops;
