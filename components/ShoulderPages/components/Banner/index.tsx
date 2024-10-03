import { useState } from 'react';
import Modal from 'react-modal';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
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
  const showSeeMoreButton =
    (description?.length || 0) > MAX_DESCRIPTION_CHARACTERS;

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
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </ModalContent>
          </Modal>
        </Conditional>
        <TextContainer $fullWidth={!imageSrc}>
          <h1>{title}</h1>
          <Conditional if={description}>
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: showSeeMoreButton
                    ? truncate(description, MAX_DESCRIPTION_CHARACTERS)
                    : description,
                }}
              />
              <Conditional if={showSeeMoreButton}>
                <button onClick={toggleModal}>{strings.READ_MORE}</button>
              </Conditional>
            </div>
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
          <Image
            url={imageSrc?.url || ''}
            alt={imageSrc?.alt || ''}
            className="banner-img"
            width={584}
            height={300}
            loadHigherQualityImage={true}
            autoCrop={false}
          />
        </Conditional>
      </ContentContainer>
    </Container>
  );
};

export default Banner;
