import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
const TicketPage: ComponentType<any> = dynamic(() => import('./TicketPage'));

const ExperiencePage = (props: any) => {
  const { page_type: pageType } = props;
  return pageType == 'Tickets' ? (
    <TicketPage {...props} />
  ) : (
    <div>ExperiencePage</div>
  );
};

export default ExperiencePage;
