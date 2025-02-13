/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import Conditional from 'components/common/Conditional';
import { DescriptorContainer } from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/components/Descriptor/styles';
import type { DescriptorProps } from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/components/Descriptor/types';
import { DescriptorSize } from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/types';
import COLORS from 'const/colors';

const Descriptor = ({
  icon,
  text,
  size = DescriptorSize.LARGE,
  color = COLORS.GRAY.G2,
  bold = false,
  url,
  dataQAMarker,
}: DescriptorProps) => {
  const Content = () => {
    return (
      <DescriptorContainer
        className="descriptor-container"
        $size={size}
        $color={color}
        $bold={bold}
        data-qa-marker={dataQAMarker}
      >
        {icon}
        <p className="descriptor-text">{text}</p>
      </DescriptorContainer>
    );
  };
  return (
    <>
      <Conditional if={url}>
        <Link href={url!}>
          <Content />
        </Link>
      </Conditional>
      <Conditional if={!url}>
        <Content />
      </Conditional>
    </>
  );
};

export default Descriptor;
