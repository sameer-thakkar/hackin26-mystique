type TWhyWithHoImage = {
  url: string;
  alt: string;
};

export type TWhyWithHoItem = {
  title: string;
  description: string;
  image: TWhyWithHoImage;
};

export type TWhyWithHoItemProps = {
  item: TWhyWithHoItem;
  isDesktop: boolean;
};
