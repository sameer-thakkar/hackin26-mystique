export const chunkCardsIntoRows = <T>(cards: T[], columns: number): T[][] => {
  const rows: T[][] = [];
  for (let i = 0; i < cards.length; i += columns) {
    rows.push(cards.slice(i, i + columns));
  }
  return rows;
};
