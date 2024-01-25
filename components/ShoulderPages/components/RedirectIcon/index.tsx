import { LinkArrow, LinkBoxWithoutArrow } from 'assets/SvgIcons';
import { Container } from './styles';

const RedirectionIcon = () => (
  <Container>
    <LinkBoxWithoutArrow />
    <LinkArrow className="arrow" />
  </Container>
);

export default RedirectionIcon;
