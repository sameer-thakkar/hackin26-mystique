import { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import parse from 'url-parse';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL } from 'utils';
import { currencyAtom } from 'store/atoms/currency';
import { hsidAtom } from 'store/atoms/hsid';
import { metaAtom } from 'store/atoms/meta';

export const useBookingURL = ({
  tourGroupId,
  tourId,
  isMobile,
  ctaSuffix,
  flowType,
}: {
  tourGroupId: number;
  tourId?: number;
  isMobile: boolean;
  ctaSuffix?: string;
  flowType: string;
}) => {
  const {
    biLink,
    bookSubdomain,
    isDev,
    host,
    redirectToHeadoutBookingFlow,
    uid,
    lang,
  } = useContext(MBContext);

  const hsid = useRecoilValue(hsidAtom);
  const { collectionId: refererCollectionId } = useRecoilValue(metaAtom);
  const currency = useRecoilValue(currencyAtom);

  let url = host || window.location.host;
  const hostName = !isDev ? url : parse(uid, true).pathname;

  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const bookingUrl = hostSplit.join('.');

  const productBookingUrl = createBookingURL({
    nakedDomain: bookingUrl,
    lang: lang,
    currency,
    tgid: tourGroupId,
    promoCode: null,
    tourId: tourId ? String(tourId) : null,
    biLink,
    date: null,
    isMobile,
    bookSubdomain,
    redirectToHeadoutBookingFlow,
    ctaSuffix: ctaSuffix ?? '',
    flowType: flowType,
    hsid,
    refererCollectionId,
    mbUid: uid,
  });

  return productBookingUrl;
};
