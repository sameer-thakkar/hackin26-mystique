import { ICategoryProps } from 'components/slices/ListicleV2/LargeListicle/CategoryTags/interfaces';
import {
  LargeListicleCategoryTagsWrapper,
  LargeListicleCategoryTagWrapper,
} from 'components/slices/ListicleV2/LargeListicle/CategoryTags/styles';

const CategoryTags = ({ categoryTags }: ICategoryProps) => {
  return (
    <LargeListicleCategoryTagsWrapper>
      {categoryTags?.filter(Boolean).map((item: string, index: number) => {
        return (
          <LargeListicleCategoryTagWrapper key={index}>
            {item}
          </LargeListicleCategoryTagWrapper>
        );
      })}
    </LargeListicleCategoryTagsWrapper>
  );
};
export default CategoryTags;
