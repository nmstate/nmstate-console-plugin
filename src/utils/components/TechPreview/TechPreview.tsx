import React, { FC } from 'react';
import classNames from 'classnames';

import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import './TechPreview.scss';
const TechPreview: FC = () => {
  const { t } = useNMStateTranslation();

  return (
    <div className={classNames('pf-v5-c-button', 'TechPreviewLabel')}>{t('Tech preview')}</div>
  );
};

export default TechPreview;
