import React, { useContext, useEffect, useState } from 'react';
import { MBContext } from 'contexts/MBContext';
import { HEADOUT_API_ENDPOINT } from 'const/index';
import LargeListicle from './LargeListicle';
import MediumListicle from './MediumListicle';
import SmallListicle from './SmallListicle';

type ListicleProps = {
  type: 'small' | 'medium' | 'large';
  data: any;
  index: number;
};

/**
 * A multi-variant listicle displaying an image and other information.
 *
 * Please see the <a href="https://headout.github.io/mystique/?path=/docs/slices-listicle-section">Listicle Section</a> documentation to begin with.
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - Title
 *  - This field will be auto populated if left empty (**only if a TGID is provided**)
 * - Summary
 *  - Rich Text field
 *  - Appears after the image in the 'Large' & 'Medium' type listicle
 * - TGID
 *  - Optional
 *  - Used to populate title, image and price when provided
 * - Why Summary
 *  - Rich Text field
 *  - Used to fill the 'Why Take this Day Trip?' section (which has a different background)
 *  - Appears after the info grid/summary in the 'Large' type listicle
 * - Book Now Link
 *  - Fill this to show the Book Now CTA
 * - Read More Link
 *  - Fill this to show the Read More CTA
 *  - Appears only in the 'Large' & 'Medium' type listicle
 * - Show Price
 *  - 'false' or 'true' field
 *  - Will work only if TGID is provided
 * - Theatre Name
 *  - Used to show Theatre Name on the 'Medium' & 'Small' type listicle
 * - Duration
 *  - Used to show the Duration on the 'Medium' type listicle
 * - Tags
 *  - Used to show the Tags on the 'Medium' type listicle
 * - Seating Chart Link
 *  - The link to the seating chart on the 'Small' type listicle
 * - Seating Chart Image
 *  - The image of the seating chart on the 'Small' type listicle
 *
 * ### Repeatable zone
 *
 * - Image **(Note: Only the image added in the first block in this zone will be used. This field is present in the repeatable zone to provide future compatibility for image carousels.)**
 *  - Add your image from prismic
 *  - Additionally add an 'alt' field
 * - Info Title
 *  - Title for a block in the Information Grid which appears on 'Large' type listicle
 * - Info Description
 *  - Description for a block in the Information Grid which appears on 'Large' type listicle
 * - Timings Left Column
 *  - Left column for the Timings block in the Information Grid
 * - Timings Right Column
 *  - Right column for the Timings block in the Information Grid
 */

const Listicle = ({
  type = 'small',
  data,
  index,
}: React.PropsWithChildren<ListicleProps>) => {
  const { primary, items } = data;
  const { lang } = useContext(MBContext);
  const [tourData, setTourData] = useState(null);

  useEffect(() => {
    if (!primary.tgid) return;
    fetch(
      `${HEADOUT_API_ENDPOINT}/v5/tour-group/get/${
        primary.tgid
      }?fetch-variants=false&fetch-collection-svg=false&language=${
        lang || 'en'
      }`
    )
      .then((r) => r.json())
      .then((c) => setTourData(c));
  }, [primary.tgid, lang]);

  switch (type) {
    case 'small':
      return (
        <SmallListicle
          primary={primary}
          items={items}
          currentLanguage={lang}
          tourData={tourData}
        />
      );
    case 'medium':
      return (
        <MediumListicle
          primary={primary}
          items={items}
          currentLanguage={lang}
          tourData={tourData}
        />
      );
    case 'large':
      return (
        <LargeListicle
          index={index}
          primary={primary}
          items={items}
          currentLanguage={lang}
          tourData={tourData}
        />
      );
    default:
      return null;
  }
};

export default Listicle;
