import Accordian from './Accordian';
import RichContent from '../UI/RichContent';

/**
 * ## Acc
 * Accordian slice allows you to have toggleable content, heading is visible at all times and on-click the respective content gets shown/hidden.
 * Commonly used for creating FAQs
 * First accordian item is open by default.
 *
 * ### Repeatable Zone
 * **Heading**: Simple text field, this is always shown and is the clickable part of the Accordian.
 * **Content**: RichText field, is by default hidden (except for first) unless user clicks on the heading or the chevron icon.
 **/
const AccordianGroup = ({ accoridians }) => {
  return accoridians.map((accoridan, index) => {
    const content = <RichContent render={accoridan.content} />;
    return (
      <Accordian
        key={index}
        content={content}
        isOpenOverride={index == 0}
        heading={accoridan.heading}
      />
    );
  });
};

export default AccordianGroup;
