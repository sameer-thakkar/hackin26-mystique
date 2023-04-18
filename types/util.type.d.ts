type UpdateType<ParentType, UpdatedType> = Omit<ParentType, keyof UpdatedType> &
  UpdatedType;
