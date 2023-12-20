export const getRichtextElements = ({ type, element, children }: any) => {
  switch (type) {
    case 'hyperlink':
      return (
        <a href={element?.data?.url} rel="nofollow noreferrer" target="_blank">
          {children}
        </a>
      );

    default:
      return null;
  }
};
