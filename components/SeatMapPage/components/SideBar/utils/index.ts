export const getDateXDaysAhead = ({
  startDate,
  daysAhead,
}: {
  startDate: string;
  daysAhead: number;
}) => {
  if (!startDate) {
    return '';
  }
  const currentDate = new Date(startDate);

  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + daysAhead);

  const futureDateStr = futureDate.toISOString().slice(0, 10);

  return futureDateStr;
};

export const getDatesInRange = ({
  startDate,
  daysInRange,
}: {
  startDate: string;
  daysInRange: number;
}) => {
  let startDateObj = new Date(startDate);

  let endDate = new Date(startDateObj);
  endDate.setDate(startDateObj.getDate() + daysInRange);

  let datesInRange = [];

  for (
    let currentDate = startDateObj;
    currentDate < endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    let formattedDate = currentDate.toISOString().slice(0, 10);
    datesInRange.push(formattedDate);
  }

  return datesInRange;
};

export const getToursAgainstDates = (availableTours: []) => {
  const toursAgainstDate: { [id: string]: any } = {};
  for (const availableTour of availableTours ?? []) {
    const { startDate } = availableTour;
    if (toursAgainstDate[startDate]) {
      toursAgainstDate[startDate].push(availableTour);
    } else toursAgainstDate[startDate] = [availableTour];
  }

  return toursAgainstDate;
};

export function getCurrentDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const getLeadTimeDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const leadTimeDays = diffTime / (1000 * 60 * 60 * 24);

  return leadTimeDays;
};
