import { IContentContainerProps } from 'components/slices/ListicleV2/MediumListicle/ContentContainer/interfaces';
import {
  CategoryTagsContainer,
  CategoryTagsWrapper,
  CategoryTagWrapper,
  ContentWrapper,
  TitleWrapper,
} from 'components/slices/ListicleV2/MediumListicle/ContentContainer/styles';
import Settings from 'components/slices/ListicleV2/MediumListicle/SettingsContainer';
import { SETTINGS_TYPE } from 'const/index';
import { strings } from 'const/strings';

const ContentContainer = ({
  heading,
  categoryTags,
  settings,
  richTextData,
  practicalInfo,
  overflow,
  onClickMapLink,
  text,
  index,
  isMobile,
}: IContentContainerProps) => {
  return (
    <ContentWrapper
      className={`medium-listicle-container-${index}`}
      isReadLess={text === strings.READ_LESS}
      isSettingsOne={settings === SETTINGS_TYPE.SETTINGS_ONE}
    >
      <TitleWrapper id="title">{heading}</TitleWrapper>
      <CategoryTagsContainer>
        {categoryTags?.filter(Boolean).map((categoryTag) => (
          <CategoryTagsWrapper key={categoryTag}>
            <CategoryTagWrapper>{categoryTag}</CategoryTagWrapper>
          </CategoryTagsWrapper>
        ))}
      </CategoryTagsContainer>
      <Settings
        richTextData={richTextData}
        practicalInfo={practicalInfo}
        settingsType={settings}
        overflow={overflow}
        onClickMapLink={onClickMapLink}
        text={text}
        isMobile={isMobile}
      />
    </ContentWrapper>
  );
};
export default ContentContainer;
