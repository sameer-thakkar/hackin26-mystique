import BoardingPointItem from './BoardingPointItem';
import { extractBoardingPoints } from './utils';

const BoardingPoints = (props: any) => {
  const { sectionsData } = props;
  const boardingPoints = extractBoardingPoints({ sectionsData });
  return (
    <>
      {boardingPoints?.map((item) => {
        const { stopNumber, stopName, stopLocation, hideStop } = item || {};
        return (
          <BoardingPointItem
            key={stopNumber}
            stopName={stopName}
            stopNumber={stopNumber}
            stopLocation={stopLocation}
            isSideModal={true}
            hideStopNumber={boardingPoints?.length === 1}
            hideStop={hideStop}
          />
        );
      })}
    </>
  );
};
export default BoardingPoints;
