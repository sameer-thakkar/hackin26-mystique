export const filterByContinent = (arr: any[], filterByContinent: string) => {
  const data = [...arr];
  if (filterByContinent === 'All') {
    return data
      ?.filter((d) => d?.data?.rank != null)
      ?.sort((a, b) => a?.data?.rank - b?.data?.rank);
  }
  return data
    ?.filter(
      (d) => d?.data?.continent === filterByContinent && d?.data?.rank != null
    )
    ?.sort((a, b) => a?.data?.rank - b?.data?.rank);
};

export const filterByCategory = (arr: any[], filterByCategory: string) => {
  const data = [...arr];
  return data
    ?.filter(
      (d) =>
        d?.data?.primary_category === filterByCategory && d?.data?.rank != null
    )
    ?.sort((a, b) => a?.data?.rank - b?.data?.rank);
};
