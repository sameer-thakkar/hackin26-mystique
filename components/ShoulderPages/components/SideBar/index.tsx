// THIS IS A WIP THAT WAS DISCARDED MIDWAY, KEPT AS IT'S PLANNED FOR LATER, COULD BE A GOOD START

import React, { useEffect, useState } from 'react';
import { strings } from 'const/strings';
import { SidebarLink, StyledSidebar } from './styles';

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('');

  const handleLinkClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const handleIntersection = (entries?: IntersectionObserverEntry[]) => {
      entries?.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <StyledSidebar>
      <p className="title">{strings.CONTENT_PAGE.CONTENT_GUIDE}</p>
      <SidebarLink
        href="#section1"
        isActive={activeSection === 'section1'}
        onClick={() => handleLinkClick('section1')}
      >
        Section 1
      </SidebarLink>
      <SidebarLink
        href="#section2"
        isActive={activeSection === 'section2'}
        onClick={() => handleLinkClick('section2')}
      >
        Section 2
      </SidebarLink>
      {/* Add more links corresponding to your sections */}
    </StyledSidebar>
  );
};

export default Sidebar;
