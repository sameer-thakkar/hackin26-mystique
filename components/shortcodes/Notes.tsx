import React from 'react';
import styled from 'styled-components';

export const NotesContainer = styled.div`
  padding: 16px;
  background: #f8f8f8;
  border-radius: 4px;
  margin: 16px 0px;
`;

const NotesContent = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
`;

type NotesProps = {
  text?: string;
};

/**
 *
 * Use the `notes` shortcode to add notes between richtext.
 *
 * Example Use:
 *
 * ```
 * {notes text="Note: Producers can not guarantee the appearance of any particular artist, which is always subject to illness and holidays."}
 * ```
 *
 */

const Notes: React.FC<React.PropsWithChildren<NotesProps>> = ({
  text,
  ...otherProps
}) => {
  return (
    <NotesContainer {...{ ...otherProps }}>
      <NotesContent {...otherProps}>{text}</NotesContent>
    </NotesContainer>
  );
};

export default Notes;
