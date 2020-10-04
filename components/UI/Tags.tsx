import React from 'react';
import styled from 'styled-components';

export const Tag = styled.div`
  ${({ bordered }) => (bordered ? `border: 1px solid #ebebeb;` : ``)}
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 12px;
  line-height: 12px;
  margin-right: 8px;
  ${({ colorProp }) => (colorProp ? `color: ${colorProp};` : ``)}
  ${({ backgroundColor }) =>
    backgroundColor ? `background: ${backgroundColor};` : ``}
`;

export const StyledTags = styled.div`
  height: max-content;
  width: 100%;
  display: flex;
`;

const Tags: React.FC<{
  tags: string[];
  color?: string;
  backgroundColor?: string;
  bordered?: boolean;
}> = ({ tags, color, backgroundColor, bordered = true }) => {
  return (
    <StyledTags>
      {tags.map((tag, index) => (
        <Tag
          colorProp={color}
          backgroundColor={backgroundColor}
          bordered={bordered}
          key={index}
        >
          {tag}
        </Tag>
      ))}
    </StyledTags>
  );
};

export default Tags;
