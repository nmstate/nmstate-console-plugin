export const getEditDescrition = (formSupported: boolean, canUpdatePolicy: boolean) => {
  if (canUpdatePolicy === false)
    // t('Cannot edit in view-only mode')
    return 'Cannot edit in view-only mode';
  if (!formSupported)
    // t('Edit using YAML')
    return 'Edit using YAML';
};
