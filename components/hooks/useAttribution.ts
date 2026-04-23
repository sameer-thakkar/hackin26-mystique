import { useCallback, useEffect, useRef } from 'react';
import { NextRouter, useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { getNakedDomain } from 'utils';
import { partialObjectEquals } from 'utils/prismicUtils/objectUtils';
import { COOKIE, QUERY_PARAMS, TIME } from 'const/index';

type THOAttribution = {
  ci?: string | null; // Channel Id
  cm?: string | null; // Channel Metadata
  ref?: string; // Referrer
  lp: string; // Landing Page
  ts: number; // Timestamp
  gbraid?: string | null; // Google Click Identifier for iOS 14.5+
  wbraid?: string | null; // Google Click Identifier for iOS web-to-app
  campaign_id?: string | null; // Campaign ID
  adgroup_id?: string | null; // Ad Group ID
  device?: string | null; // Device
  keyword?: string | null; // Keyword
};

const MAX_ATTRIBUTION_LENGTH = 20;

const BLACK_LISTED_ROUTES = ['/book/'];

const useAttribution = () => {
  const router = useRouter();
  /**
   * We want access to up-to-date router config inside `onAttemptAttribution`
   * however we dont want `onAttemptAttribution` to be fired on changes of router.
   * so putting it in ref, and updating it inside effect below.
   */
  const routerRef = useRef<NextRouter>(router);
  const onAttemptAttribution = useCallback(() => {
    const cookies = Cookies.get();
    const { search, host, href } = location;
    const { referrer } = document;
    const [queryStrippedHref] = href.split('?');
    const searchParams = new URLSearchParams(search ?? '?');
    const ci = searchParams.get(QUERY_PARAMS.ATRIBUTION_CHANNEL_ID);
    const cm = searchParams.get(QUERY_PARAMS.ATRIBUTION_CHANNEL_META);
    const googleCampaignId = searchParams.get(QUERY_PARAMS.GOOGLE_CAMPAIGN_ID);
    const facebookCampaignId = searchParams.get(
      QUERY_PARAMS.FACEBOOK_CAMPAIGN_ID
    );
    const bingCampaignId = searchParams.get(QUERY_PARAMS.BING_CAMPAIGN_ID);
    const gbraid = searchParams.get(QUERY_PARAMS.GBRAID);
    const wbraid = searchParams.get(QUERY_PARAMS.WBRAID);
    const ttoclid = searchParams.get(QUERY_PARAMS.TTOLCID);
    const campaignId = searchParams.get(QUERY_PARAMS.CAMPAIGN_ID);
    const adgroupId = searchParams.get(QUERY_PARAMS.ADGROUP_ID);
    const device = searchParams.get(QUERY_PARAMS.DEVICE);
    const keyword = searchParams.get(QUERY_PARAMS.KEYWORD);

    const currentHost = getNakedDomain(host);

    if (ttoclid) {
      Cookies.set(COOKIE.TIKTOK_CLICK_ID, ttoclid, {
        path: '/',
        domain: currentHost,
      });
    }

    /**
     * PS: is likely direct traffic, not guaranteed.
     * no-follow config and/or privacy centric browsers.
     */
    const isDirectTraffic = !referrer?.length;
    const isInlinkTraffic = referrer?.includes(currentHost);

    const campaignIdsMap = {
      ...(googleCampaignId && {
        [QUERY_PARAMS.GOOGLE_CAMPAIGN_ID]: googleCampaignId,
      }),
      ...(facebookCampaignId && {
        [QUERY_PARAMS.FACEBOOK_CAMPAIGN_ID]: facebookCampaignId,
      }),
      ...(bingCampaignId && {
        [QUERY_PARAMS.BING_CAMPAIGN_ID]: bingCampaignId,
      }),
      ...(gbraid && { [QUERY_PARAMS.GBRAID]: gbraid }),
      ...(wbraid && { [QUERY_PARAMS.WBRAID]: wbraid }),
      ...(campaignId && { [QUERY_PARAMS.CAMPAIGN_ID]: campaignId }),
      ...(adgroupId && { [QUERY_PARAMS.ADGROUP_ID]: adgroupId }),
      ...(device && { [QUERY_PARAMS.DEVICE]: device }),
      ...(keyword && { [QUERY_PARAMS.KEYWORD]: keyword }),
    };

    if (BLACK_LISTED_ROUTES.some((partialRoute) => href.includes(partialRoute)))
      return;

    /**
     * Attempt to restore cookie.
     */
    let currentAttr: Array<THOAttribution> = [];
    try {
      currentAttr = JSON.parse(cookies[COOKIE.HEADOUT_ATTRIBUTION_TRACKER]);
    } catch (e: any) {
      currentAttr = [];
    }
    const originalAttrLen = currentAttr.length;
    const recentMostAttr = currentAttr[originalAttrLen - 1];

    switch (true) {
      // external traffic
      case !isInlinkTraffic && !!ci?.length:
        currentAttr.push({
          ci,
          ...(referrer && { ref: referrer }),
          ...(cm && { cm }),
          lp: queryStrippedHref,
          ts: Date.now(),
          ...campaignIdsMap,
        });
        break;

      // Direct Traffic but has some channel identifers.
      // or referrer hidden / blocked.
      case isDirectTraffic && (!!ci?.length || !!cm?.length):
        currentAttr.push({
          ...(ci && { ci }),
          ...(cm && { cm }),
          lp: queryStrippedHref,
          ts: Date.now(),
          ...campaignIdsMap,
        });
        break;

      // External Legacy Traffic. (no ci && cm)
      case !isInlinkTraffic && !isDirectTraffic:
        currentAttr.push({
          lp: queryStrippedHref,
          ts: Date.now(),
          ref: referrer,
          ...campaignIdsMap,
        });
        break;

      // Default case, is external traffic
      case !isInlinkTraffic && isDirectTraffic:
        currentAttr.push({
          lp: queryStrippedHref,
          ts: Date.now(),
          ...campaignIdsMap,
        });
    }

    if (originalAttrLen !== currentAttr.length) {
      const newAttribution = currentAttr[currentAttr.length - 1];
      // If newAttr is identical to recentMostAttr, remove old entry.
      if (
        recentMostAttr &&
        partialObjectEquals(newAttribution, recentMostAttr, ['ts'])
      ) {
        currentAttr.splice(-2, 2);
        currentAttr.push({
          ...newAttribution,
        });
      }

      // Keep only the recent most MAX_ATTRIBUTION_LENGTH attributions.
      currentAttr.splice(0, currentAttr.length - MAX_ATTRIBUTION_LENGTH);
      Cookies.set(
        COOKIE.HEADOUT_ATTRIBUTION_TRACKER,
        JSON.stringify(currentAttr),
        {
          path: '/',
          domain: currentHost,
          expires: new Date(Date.now() + TIME.IN_DAYS * 31),
        }
      );
    }
  }, []);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    try {
      onAttemptAttribution();
    } catch (e: any) {
      //
    }
  }, [onAttemptAttribution]);
};

export default useAttribution;
