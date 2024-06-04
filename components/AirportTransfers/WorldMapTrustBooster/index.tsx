import { useEffect, useRef } from 'react';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import { WorldMapSVGDesktop } from 'assets/airportTransfers/staticContentSVGs';
import { Container, CountryMarker } from './style';

const CITY_IMAGE_URL_MAP = {
  NEW_YORK:
    'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/newyork-flag.svg',
  LONDON:
    'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/london-flag.svg',
  DUBAI:
    'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/dubai-flag.svg',
  TOKYO:
    'https://cdn-imgix.headout.com/airport-transfer-mbs/svgs/tokyo-flag.svg',
};

export const WorldMapTrustBooster = ({ isMobile }: { isMobile: boolean }) => {
  const worldMapSVGRef = useRef<SVGSVGElement>(null);

  const newYorkMarkerRef = useRef<HTMLDivElement>(null);
  const londonMarkerRef = useRef<HTMLDivElement>(null);
  const dubaiMarkerRef = useRef<HTMLDivElement>(null);
  const tokyoMarkerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!worldMapSVGRef.current) return;

    const newyorkCircle = document.querySelector('svg #NEW_YORK');
    const londonCircle = document.querySelector('svg #LONDON');
    const dubaiCircle = document.querySelector('svg #DUBAI');
    const tokyoCircle = document.querySelector('svg #TOKYO');

    if (newyorkCircle && newYorkMarkerRef.current) {
      const { x, y } = (newyorkCircle as SVGSVGElement).getBBox();
      newYorkMarkerRef.current.style.left = `${
        x -
        newYorkMarkerRef.current.getBoundingClientRect().width / 2 +
        newyorkCircle.getBoundingClientRect().width / 2
      }px`;
      newYorkMarkerRef.current.style.top = `${
        y -
        newYorkMarkerRef.current.getBoundingClientRect().height -
        newyorkCircle.getBoundingClientRect().height / 2
      }px`;
    }

    if (londonCircle && londonMarkerRef.current) {
      const { x, y } = (londonCircle as SVGSVGElement).getBBox();
      londonMarkerRef.current.style.left = `${
        x -
        londonMarkerRef.current.getBoundingClientRect().width / 2 +
        londonCircle.getBoundingClientRect().width / 2
      }px`;
      londonMarkerRef.current.style.top = `${
        y -
        londonMarkerRef.current.getBoundingClientRect().height -
        londonCircle.getBoundingClientRect().height / 2
      }px`;
    }

    if (dubaiCircle && dubaiMarkerRef.current) {
      const { x, y } = (dubaiCircle as SVGSVGElement).getBBox();
      dubaiMarkerRef.current.style.left = `${
        x -
        dubaiMarkerRef.current.getBoundingClientRect().width / 2 +
        dubaiCircle.getBoundingClientRect().width / 2
      }px`;
      dubaiMarkerRef.current.style.top = `${
        y -
        dubaiMarkerRef.current.getBoundingClientRect().height -
        dubaiCircle.getBoundingClientRect().height / 2
      }px`;
    }

    if (tokyoCircle && tokyoMarkerRef.current) {
      const { x, y } = (tokyoCircle as SVGSVGElement).getBBox();
      tokyoMarkerRef.current.style.left = `${
        x -
        tokyoMarkerRef.current.getBoundingClientRect().width / 2 +
        tokyoCircle.getBoundingClientRect().width / 2
      }px`;
      tokyoMarkerRef.current.style.top = `${
        y -
        tokyoMarkerRef.current.getBoundingClientRect().height -
        tokyoCircle.getBoundingClientRect().height / 2
      }px`;
    }
  }, [isMobile]);

  return (
    <Container>
      <h5>
        {strings.formatString(
          strings.AIRPORT_TRANSFER.SERVING_GUESTS,
          <span className="purps">
            {strings.AIRPORT_TRANSFER.GUESTS_COUNT}
          </span>,
          <span className="purps">{strings.AIRPORT_TRANSFER.CITIES_COUNT}</span>
        )}
      </h5>

      <p>{strings.AIRPORT_TRANSFER.PARNTER_WITH_BEST}</p>

      <div className="svg-container">
        {isMobile ? (
          <Image
            url="https://cdn-imgix.headout.com/airport-transfer-mbs/images/worldmap-cities-mweb.png"
            alt="World Map"
            fill
          />
        ) : (
          <WorldMapSVGDesktop ref={worldMapSVGRef} />
        )}

        <Conditional if={!isMobile}>
          <CountryMarker ref={newYorkMarkerRef}>
            <div className="flag-img">
              <Image url={CITY_IMAGE_URL_MAP.NEW_YORK} alt="New York" fill />
            </div>
            New York
          </CountryMarker>

          <CountryMarker ref={londonMarkerRef}>
            <div className="flag-img">
              <Image url={CITY_IMAGE_URL_MAP.LONDON} alt="London" fill />
            </div>
            London
          </CountryMarker>

          <CountryMarker ref={dubaiMarkerRef}>
            <div className="flag-img">
              <Image url={CITY_IMAGE_URL_MAP.DUBAI} alt="Dubai" fill />
            </div>
            Dubai
          </CountryMarker>

          <CountryMarker ref={tokyoMarkerRef}>
            <div className="flag-img">
              <Image url={CITY_IMAGE_URL_MAP.TOKYO} alt="Tokyo" fill />
            </div>
            Tokyo
          </CountryMarker>
        </Conditional>
      </div>
    </Container>
  );
};
