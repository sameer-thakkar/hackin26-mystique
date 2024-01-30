import LinkArrow from 'assets/linkArrow';
import LinkBoxWithoutArrow from 'assets/linkBoxWithoutArrow';
import { Container } from './styles';

const RedirectionIcon = () => (
  <Container>
    <LinkBoxWithoutArrow />
    <LinkArrow className="arrow" />
  </Container>
);

export default RedirectionIcon;
