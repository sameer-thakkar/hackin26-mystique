import Image from 'UI/Image';
import { Descriptor } from './styles';

export const getBannerDescriptorsArray = (
  bannerDescriptors: Record<string, any>[]
) => {
  return bannerDescriptors?.map((item: Record<string, any>) => {
    const { icon, text } = item;
    return (
      <Descriptor key={text}>
        <Image url={icon} alt={text} height={20} width={20} />
        <span>{text}</span>
      </Descriptor>
    );
  });
};
