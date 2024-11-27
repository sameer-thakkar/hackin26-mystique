import { LocalizedStrings } from 'react-localization';
import { convertEngToSentenceCase } from 'utils/stringUtils';
import { amenitiesIcons } from 'const/amenitiesIcons';
import { strings } from 'const/strings';

const Amenities = (props: {
  amenitiesDropdown: any;
  isMobile: boolean;
  expandedLimit: number;
  lang?: string;
}) => {
  const {
    amenitiesDropdown: amenitiesList,
    isMobile,
    expandedLimit,
    lang,
  } = props;
  const { AMENITIES }: LocalizedStrings<any> = strings;

  return (
    <>
      {amenitiesList?.map(
        (amenity: { amenities_list: string }, index: number) => {
          return (
            index < (isMobile ? expandedLimit : amenitiesList.length) && (
              <div className="amenity" key={index}>
                {amenitiesIcons[amenity.amenities_list]}
                <p key={index}>
                  {convertEngToSentenceCase(
                    lang ?? '',
                    AMENITIES[amenity.amenities_list]
                  )}
                </p>
              </div>
            )
          );
        }
      )}
    </>
  );
};

export default Amenities;
