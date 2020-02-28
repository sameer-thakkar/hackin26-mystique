const axios = require('axios');
const signale = require('signale');

const domains = [
  'https://frame.tickets-dubai.org',
  'https://sagradafamilia.tickets-barcelona.org',
  'https://bateaux-parisiens.seine-river-cruises.com',
  'https://www.alcazar-seville-tickets.com/',
  'https://www.alhambra-granada-tickets.com',
];

const BENCHMARK_PERF = {
  MOBILE: 30,
  DESKTOP: 70,
};

const parseResponse = pagespeedResponse => {
  const { data } = pagespeedResponse;
  const { audits, categories } = data.lighthouseResult;
  return {
    id: data.id,
    unit: 'ms',
    si: audits['speed-index'].numericValue,
    fcp: audits['first-contentful-paint'].numericValue,
    fmp: audits['first-meaningful-paint'].numericValue,
    ttfb: audits['time-to-first-byte'].numericValue,
    tti: audits['interactive'].numericValue,
    perf_score_out_of_100: categories.performance.score * 100,
  };
};

const aggregateInsights = insights =>
  insights.reduce(
    (accum, item, index, array) => {
      if (index === array.length - 1) {
        return {
          ...accum,
          si: Math.ceil((accum.si + item.si) / array.length),
          fcp: Math.ceil((accum.fcp + item.fcp) / array.length),
          fmp: Math.ceil((accum.fmp + item.fmp) / array.length),
          ttfb: Math.ceil((accum.ttfb + item.ttfb) / array.length),
          tti: Math.ceil((accum.tti + item.tti) / array.length),
          perf_score_out_of_100: Math.ceil(
            (accum.perf_score_out_of_100 + item.perf_score_out_of_100) /
              array.length
          ),
        };
      }
      return {
        ...accum,
        si: accum.si + item.si,
        fcp: accum.fcp + item.fcp,
        fmp: accum.fmp + item.fmp,
        ttfb: accum.ttfb + item.ttfb,
        tti: accum.tti + item.tti,
        perf_score_out_of_100:
          accum.perf_score_out_of_100 + item.perf_score_out_of_100,
      };
    },
    {
      si: 0,
      fcp: 0,
      fmp: 0,
      ttfb: 0,
      tti: 0,
      perf_score_out_of_100: 0,
    }
  );

module.exports = (env, trackInsights = false) => {
  const pagespeedFetchers = domains
    .map(domain =>
      env === 'stage' ? domain.replace('https://', 'https://stage.') : domain
    )
    .map(domain =>
      ['mobile', 'desktop'].map(
        strategy =>
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
            domain
          )}&key=AIzaSyCvQ0KgW7X4DQfKbxYUGFVMpWRji9nTTlc&strategy=${strategy}`
      )
    )
    .reduce((accum, item) => [...accum, ...item], [])
    .map(pagespeedApiUrl => axios.get(pagespeedApiUrl));

  return Promise.all(pagespeedFetchers)
    .then(responses => {
      const [mobileResponses, desktopResponses] = responses.reduce(
        (accum, response, idx) => {
          if (idx % 2 === 0) {
            // even indexes contain mobile insights
            return [[...accum[0], response], accum[1]];
          }
          return [accum[0], [...accum[1], response]];
        },
        [[], []]
      );

      const mobileInsights = mobileResponses.map(response =>
        parseResponse(response)
      );
      const desktopInsights = desktopResponses.map(response =>
        parseResponse(response)
      );

      const aggregateMobileInsights = aggregateInsights(mobileInsights);
      const aggregateDesktopInsights = aggregateInsights(desktopInsights);
      console.log({ aggregateMobileInsights });
      console.log({ aggregateDesktopInsights });

      if (
        aggregateDesktopInsights.perf_score_out_of_100 < BENCHMARK_PERF.DESKTOP
      ) {
        signale.fatal(
          new Error(
            `[Desktop] Avg Pagespeed score of ${aggregateDesktopInsights.perf_score_out_of_100} dropped below benchmark score of ${BENCHMARK_PERF.DESKTOP}`
          )
        );
        signale.complete({
          prefix: '[tests]',
          message: 'Benchmark Failed!',
        });
        process.exit(1);
      }

      if (
        aggregateMobileInsights.perf_score_out_of_100 < BENCHMARK_PERF.MOBILE
      ) {
        signale.fatal(
          new Error(
            `[Mobile] Avg Pagespeed score of ${aggregateMobileInsights.perf_score_out_of_100} dropped below benchmark score of ${BENCHMARK_PERF.MOBILE}`
          )
        );
        signale.complete({
          prefix: '[tests]',
          message: 'Benchmark Failed!',
        });
        process.exit(1);
      }

      if (trackInsights) {
        [
          {
            insights: aggregateMobileInsights,
            insightsName: 'mobilePageSpeedInsights',
          },
          {
            insights: aggregateDesktopInsights,
            insightsName: 'desktopPageSpeedInsights',
          },
        ].forEach(({ insights, insightsName }) => {
          Object.keys(insights).forEach(payloadKey => {
            axios
              .post(
                `http://52.23.245.115:9091/metrics/job/microbrand-metrics/insights/${insightsName}/provider/mystique`,
                `${payloadKey} ${insights[payloadKey]}\n`,
                {
                  headers: { 'Content-Type': 'text/plain' },
                }
              )
              .catch(e => {
                console.log(e.data);
              });
          });
        });
      }

      signale.success({
        prefix: '[tests]',
        message: 'Benchmark Success!',
      });
      process.exit(1);
    })
    .catch(e => {
      signale.fatal(e.response.data.error);
      process.exit(1);
    });
};
