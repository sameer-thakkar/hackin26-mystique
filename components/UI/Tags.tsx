import React from 'react';
import styled from 'styled-components';

export const Tag = styled.div`
  ${({
    // @ts-expect-error TS(2339): Property 'bordered' does not exist on type 'Pick<D... Remove this comment to see the full error message
    bordered,
  }) => (bordered ? `border: 1px solid #ebebeb;` : ``)}
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 12px;
  line-height: 12px;
  margin-right: 8px;
  ${({
    // @ts-expect-error TS(2339): Property 'colorProp' does not exist on type 'Pick<... Remove this comment to see the full error message
    colorProp,
  }) => (colorProp ? `color: ${colorProp};` : ``)}
  ${({
    // @ts-expect-error TS(2339): Property 'backgroundColor' does not exist on type ... Remove this comment to see the full error message
    backgroundColor,
  }) => (backgroundColor ? `background: ${backgroundColor};` : ``)}
`;

export const StyledTags = styled.div`
  height: max-content;
  width: 100%;
  display: flex;
`;

const Tags: React.FC<
  React.PropsWithChildren<{
    tags: string[];
    color?: string;
    backgroundColor?: string;
    bordered?: boolean;
  }>
> = ({ tags, color, backgroundColor, bordered = true }) => {
  return (
    <StyledTags>
      {tags.map((tag, index) => (
        <Tag
          // @ts-expect-error TS(2769): No overload matches this call.
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
