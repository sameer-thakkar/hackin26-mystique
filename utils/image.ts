import { ENTITY_ICONS_FOLDER_LINK } from 'const/index';

export const getCategoryIconUrl = ({
  entityId,
  isCategory = false,
}: {
  entityId: number | string;
  isCategory?: boolean;
}) => {
  const filePrefix = isCategory ? 'cat_' : 'sub_';
  return `${ENTITY_ICONS_FOLDER_LINK}/${filePrefix}${entityId}.svg`;
};
