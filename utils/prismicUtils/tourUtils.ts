import { createClient } from 'prismicio';
import { toursTabSliceHandler } from 'components/Slices';

export const extractOfferFromTourSliceTgids = async ({
  toursTabFirstSlice,
  isCatOrSubCatPage,
}: {
  toursTabFirstSlice: any;
  isCatOrSubCatPage: boolean;
}) => {
  const offerTgids: number[] = [];
  const prismicTours =
    toursTabFirstSlice && !isCatOrSubCatPage
      ? toursTabSliceHandler(toursTabFirstSlice)
      : [];
  const offers = prismicTours
    ?.filter((tour: any) => tour.offer__free_tour?.id)
    ?.map((tour: any) => tour.offer__free_tour?.id);
  const uniqueOfferIds = offers.filter(
    (id: any, index: any) => offers.indexOf(id) === index
  );
  if (uniqueOfferIds.length) {
    const prismicClient = createClient();
    const offerTours = await prismicClient.getByIDs(uniqueOfferIds);

    offerTours?.results?.forEach((offer: any) => {
      const tgid = parseInt(offer.data.offer_tgid);
      if (tgid > 0) offerTgids.push(tgid);
    });
  }

  return { prismicTours, offerTgids };
};
