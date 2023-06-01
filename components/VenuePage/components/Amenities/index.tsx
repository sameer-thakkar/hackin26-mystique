import { amenitiesIcons } from 'const/amenitiesIcons';

const Amenities = (props: {
  amenitiesDropdown: any;
  isMobile: boolean;
  expandedLimit: number;
}) => {
  const { amenitiesDropdown: amenitiesList, isMobile, expandedLimit } = props;

  return (
    <>
      {amenitiesList?.map(
        (amenity: { amenities_list: string }, index: number) => {
          return (
            index < (isMobile ? expandedLimit : amenitiesList.length) && (
              <div className="amenity">
                {amenitiesIcons[amenity.amenities_list]}
                <p key={index}>{amenity.amenities_list}</p>
              </div>
            )
          );
        }
      )}
    </>
  );
};

export default Amenities;
