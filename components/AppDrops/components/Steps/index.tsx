import React from 'react';
import { Text } from '@headout/eevee';
import {
  DROPS_BOLT_ICON_URL,
  DROPS_HIGHLIGHTED_TEXT_LINE_URL,
  DROPS_SPARK_ICON_URL,
  DROPS_SUPPLY_ICON_URL,
} from 'components/AppDrops/constants';
import { TStepsProps } from 'components/AppDrops/types';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import { stepsRecipe } from './styles';

export const Steps = ({
  variant,
  showHighlightedTextLine = true,
}: TStepsProps) => {
  const translations = strings.DROPS.DOWNLOAD_APP_NUDGE;
  const styles = stepsRecipe(variant);

  return (
    <div className={styles.container}>
      <div className={styles.stepItem}>
        <div className={styles.iconContainer}>
          <Image
            url={DROPS_SPARK_ICON_URL}
            alt="download"
            width={20}
            height={20}
          />
        </div>
        <Text as="span" textStyle={'ui.label.small'} color={'core.candy.600'}>
          {translations.STEP_1}
        </Text>
      </div>
      <div className={styles.stepItem}>
        <div className={styles.iconContainer}>
          <Image
            url={DROPS_SUPPLY_ICON_URL}
            alt="clock"
            width={20}
            height={20}
          />
        </div>
        <Text
          as="span"
          textStyle={'ui.label.small'}
          color={'core.candy.600'}
          className={styles.timeTextStyle}
        >
          {translations.STEP_2}
          <span className={styles.highlightedText}>
            {translations.STEP_2_HIGHLIGHT}
            <Conditional if={showHighlightedTextLine}>
              <img
                src={DROPS_HIGHLIGHTED_TEXT_LINE_URL}
                alt="highlighted-text-line"
                className={styles.textLineImage}
              />
            </Conditional>
          </span>
          {translations.STEP_2_PART_1}
        </Text>
      </div>
      <div className={styles.stepItem}>
        <div className={styles.iconContainer}>
          <Image
            url={DROPS_BOLT_ICON_URL}
            alt="lightning"
            width={20}
            height={20}
          />
        </div>
        <Text as="span" textStyle={'ui.label.small'} color={'core.candy.600'}>
          {translations.STEP_3}
        </Text>
      </div>
    </div>
  );
};
