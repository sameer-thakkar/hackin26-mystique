const keyMap = {
  'Semantics/Display/Extra large': 'display.extraLarge',
  'Semantics/Display/Large': 'display.large',
  'Semantics/Display/Medium': 'display.medium',
  'Semantics/Display/Regular': 'display.regular',
  'Semantics/Display/Small': 'display.small',
  'Semantics/Display/XS': 'display.xs',
  'Semantics/Heading/Large': 'heading.large',
  'Semantics/Heading/Medium': 'heading.medium',
  'Semantics/Heading/Regular': 'heading.regular',
  'Semantics/Heading/Small': 'heading.small',
  'Semantics/Subheading/Large': 'subheading.large',
  'Semantics/Subheading/Regular': 'subheading.regular',
  'Semantics/Subheading/Small': 'subheading.small',
  'Semantics/CTA/Large': 'cta.large',
  'Semantics/CTA/Regular': 'cta.regular',
  'Semantics/CTA/Small': 'cta.small',
  'Semantics/UI Label/Large': 'ui.label.large',
  'Semantics/UI Label/Medium': 'ui.label.medium',
  'Semantics/UI Label/Regular': 'ui.label.regular',
  'Semantics/UI Label/Small': 'ui.label.small',
  'Semantics/UI Label/Extra Small': 'ui.label.extraSmall',
  'Semantics/UI Label/Large (Heavy)': 'ui.label.large.heavy',
  'Semantics/UI Label/Medium (Heavy)': 'ui.label.medium.heavy',
  'Semantics/UI Label/Regular (Heavy)': 'ui.label.regular.heavy',
  'Semantics/UI Label/Small (Heavy)': 'ui.label.small.heavy',
  'Semantics/UI Label/Strike/Large': 'ui.label.strike.large',
  'Semantics/UI Label/Strike/Regular': 'ui.label.strike.regular',
  'Semantics/UI Label/Strike/Medium': 'ui.label.strike.medium',
  'Semantics/UI Label/Strike/Small': 'ui.label.strike.small',
  'Semantics/UI Label/Strike/Extra Small': 'ui.label.strike.extraSmall',
  'Semantics/UI Label/Strike/Large (Heavy)': 'ui.label.strike.large.heavy',
  'Semantics/UI Label/Strike/Medium (Heavy)': 'ui.label.strike.medium.heavy',
  'Semantics/UI Label/Strike/Regular (Heavy)': 'ui.label.strike.regular.heavy',
  'Semantics/UI Label/Strike/Small (Heavy)': 'ui.label.strike.small.heavy',
  'Semantics/UI Label/Underline/Large': 'ui.label.underline.large',
  'Semantics/UI Label/Underline/Medium': 'ui.label.underline.medium',
  'Semantics/UI Label/Underline/Regular': 'ui.label.underline.regular',
  'Semantics/UI Label/Underline/Small': 'ui.label.underline.small',
  'Semantics/UI Label/Underline/Extra Small': 'ui.label.underline.extraSmall',
  'Semantics/UI Label/Underline/Large (Heavy)':
    'ui.label.underline.large.heavy',
  'Semantics/UI Label/Underline/Medium (Heavy)':
    'ui.label.underline.medium.heavy',
  'Semantics/UI Label/Underline/Regular (Heavy)':
    'ui.label.underline.regular.heavy',
  'Semantics/UI Label/Underline/Small (Heavy)':
    'ui.label.underline.small.heavy',
  'Semantics/Para/Large': 'para.large',
  'Semantics/Para/Medium': 'para.medium',
  'Semantics/Para/Regular': 'para.regular',
  'Semantics/Para/Small': 'para.small',
  'Semantics/Para/Extra Small': 'para.extraSmall',
  'Semantics/Para/Quote': 'para.quote',
  'Semantics/Para/Caption': 'para.caption',
  'Semantics/Tags/Medium': 'tags.medium',
  'Semantics/Tags/Regular': 'tags.regular',
  'Semantics/Tags/Small': 'tags.small',
  'Semantics/Tags/Booster': 'tags.booster',
  'Semantics/Tags/Hairline-Regular': 'tags.hairlineRegular',
  'Semantics/Tags/Hairline-Small': 'tags.hairlineSmall',
  'Semantics/Table/Large': 'table.large',
  'Semantics/Table/Large (Heavy)': 'table.large.heavy',
  'Semantics/Table/Regular': 'table.regular',
  'Semantics/Table/Regular (Heavy)': 'table.regular.heavy',
  'Semantics/Table/Small': 'table.small',
  'Semantics/Table/Small (Heavy)': 'table.small.heavy',
};

// @ts-expect-error expect-error
export default function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // @ts-expect-error expect-error
  root.find(j.Literal).forEach((path) => {
    const originalValue = path.node.value;
    // @ts-expect-error expect-error
    if (typeof originalValue === 'string' && keyMap[originalValue]) {
      // @ts-expect-error expect-error
      path.node.value = keyMap[originalValue];
    }
  });

  return root.toSource();
}
