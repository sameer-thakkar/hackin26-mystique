import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import { IShoulderBannerProps } from '../../interface';
import {
  Container,
  ContentContainer,
  Divider,
  InfoContainer,
  TextContainer,
} from './styles';

const Banner = ({
  imageSrc,
  title,
  description,
  poiInfo = {},
}: IShoulderBannerProps) => {
  return (
    <Container>
      <ContentContainer>
        <TextContainer $fullWidth={!imageSrc}>
          <h1>{title}</h1>
          <Conditional if={description}>
            <div
              dangerouslySetInnerHTML={{ __html: description as TrustedHTML }}
            />
          </Conditional>
          <Conditional if={Object.values(poiInfo).filter((val) => val).length}>
            <Divider />
            <InfoContainer>
              {Object.entries(poiInfo).map(
                ([key, val]) =>
                  val && (
                    <div key={key}>
                      <p>
                        {
                          strings.CONTENT_PAGE[
                            key as keyof typeof strings.CONTENT_PAGE
                          ]
                        }
                      </p>
                      <p>{String(val)}</p>
                    </div>
                  )
              )}
            </InfoContainer>
          </Conditional>
        </TextContainer>
        <Conditional if={imageSrc?.url}>
          <img
            src={imageSrc?.url || ''}
            alt={imageSrc?.alt || ''}
            className="banner-img"
          />
        </Conditional>
      </ContentContainer>
    </Container>
  );
};

export default Banner;
