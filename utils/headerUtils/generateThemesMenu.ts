const generateThemesMenu = (menu: Record<string, any>): Record<string, any> => {
  const {
    CITY_TOURS: cityToursMenu = {},
    CRUISES: cruisesMenu = {},
    ATTRACTIONS: attractionsMenu = {},
  } = menu;
  if (
    Object.keys(cityToursMenu).length +
      Object.keys(cruisesMenu).length +
      Object.keys(attractionsMenu).length <
    5
  ) {
    menu[`THEMES`] = {
      ...cityToursMenu,
      ...cruisesMenu,
      ...attractionsMenu,
    };
    delete menu?.CITY_TOURS;
    delete menu?.CRUISES;
    delete menu?.ATTRACTIONS;
  }

  return menu;
};

export default generateThemesMenu;
