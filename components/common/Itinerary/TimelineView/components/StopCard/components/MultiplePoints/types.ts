export type MultiplePointsProps = {
  points: {
    title: string;
    image?: string | null;
  }[];
  isStartPoint?: boolean;
  /**
   * when index >= 3, consider it as the
   * view more button.
   * @param index index of the clicked item
   * @returns void
   */
  onItemClick: (index: number) => void;
};
