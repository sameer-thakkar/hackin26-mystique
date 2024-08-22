import BoardingPointItem from './BoardingPointItem';
import { extractBoardingPoints } from './utils';

const BoardingPoints = (props: any) => {
  const { sectionsData } = props;
  const boardingPoints = extractBoardingPoints({ sectionsData });
  return (
    <>
      {boardingPoints?.map((item) => {
        const { stopNumber, stopName, stopLocation } = item || {};
        return (
          <BoardingPointItem
            key={stopNumber}
            stopName={stopName}
            stopNumber={stopNumber}
            stopLocation={stopLocation}
            isSideModal={true}
          />
        );
      })}
    </>
  );
};
export default BoardingPoints;
