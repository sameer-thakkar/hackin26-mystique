import { useState } from 'react';
import Modal from 'react-modal';
import Conditional from 'components/common/Conditional';
import { truncate } from 'utils/helper';
import { strings } from 'const/strings';
import CloseIcon from 'assets/closeIcon';
import { IShoulderBannerProps } from '../../interface';
import {
  Container,
  ContentContainer,
  Divider,
  InfoContainer,
  ModalContent,
  modalStyles,
  TextContainer,
} from './styles';

const Banner = ({
  imageSrc,
  title,
  description = '',
  poiInfo = {},
}: IShoulderBannerProps) => {
  const MAX_DESCRIPTION_CHARACTERS = 250;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const strippedDescription = description?.replace(/^<p>|<\/p>$/g, '');
  const showSeeMoreButton =
    (strippedDescription?.length || 0) > MAX_DESCRIPTION_CHARACTERS;

  const toggleModal = () => setModalIsOpen((prev) => !prev);

  return (
    <Container>
      <ContentContainer>
        <Conditional if={showSeeMoreButton}>
          <Modal
            style={modalStyles}
            onRequestClose={toggleModal}
            isOpen={modalIsOpen}
          >
            <ModalContent>
              <button onClick={toggleModal}>
                <CloseIcon />
              </button>
              <h1>
                {strings.CATEGORY_HEADER.ABOUT} {poiInfo?.name}
              </h1>
              <p>{strippedDescription}</p>
            </ModalContent>
          </Modal>
        </Conditional>
        <TextContainer $fullWidth={!imageSrc}>
          <h1>{title}</h1>
          <Conditional if={description}>
            <p>
              {showSeeMoreButton
                ? truncate(strippedDescription, MAX_DESCRIPTION_CHARACTERS)
                : strippedDescription}
              <Conditional if={showSeeMoreButton}>
                <button onClick={toggleModal}>{strings.READ_MORE}</button>
              </Conditional>
            </p>
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
