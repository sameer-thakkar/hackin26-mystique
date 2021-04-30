import { CHEVRON_DOWN } from 'assets/SvgIcons';
import { COLORS } from 'const/ui-constants';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

type MultiLevelMenuProps = {
  levelOneLabel: string;
  links: any[];
};

const Wrapper = styled.div`
  .level-one {
    display: flex;
    align-items: center;
    svg {
      height: 12px;
      width: 12px;
      margin-left: 8px;

      ${({ isOpen }) => isOpen && `transform: rotate(180deg)`}
    }
  }
`;
const NestedMenu = styled.div`
  background-color: ${COLORS.WHITE};
`;

const MultiLevelMenu: FunctionComponent<MultiLevelMenuProps> = ({
  levelOneLabel,
  links,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen((prevState) => !prevState);
  };
  console.log(isOpen);
  return (
    <Wrapper isOpen={isOpen}>
      <div
        className="level-one"
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        {levelOneLabel} {CHEVRON_DOWN}
      </div>

      {isOpen && (
        <NestedMenu>
          {links?.map((link, index) => (
            <a key={index} href={link?.link}>
              {link?.label}
            </a>
          ))}
        </NestedMenu>
      )}
    </Wrapper>
  );
};

export default MultiLevelMenu;
