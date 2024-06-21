import React, { FC } from 'react';

import restrictedSignImg from '@images/restricted-sign.svg';
import { Alert } from '@patternfly/react-core';
import { isEmpty } from '@utils/helpers';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

type AccessDeniedProps = {
  message?: string;
};

const AccessDenied: FC<AccessDeniedProps> = ({ message }) => {
  const { t } = useNMStateTranslation();
  return (
    <div>
      <div className="cos-status-box pf-v5-u-text-align-center">
        <img className="cos-status-box__access-denied-icon" src={restrictedSignImg} />
        <div className="cos-status-box">
          <div className="cos-status-box__title" data-test="msg-box-title">
            {t('Restricted Access')}
          </div>
          <div
            className="pf-v5-u-text-align-center cos-status-box__detail"
            data-test="msg-box-detail"
          >
            {t("You don't have access to this section due to cluster policy.")}
          </div>
        </div>
      </div>
      {!isEmpty(message) && (
        <Alert isInline className="co-alert" variant="danger" title={t('Error details')}>
          {message}
        </Alert>
      )}
    </div>
  );
};

export default AccessDenied;
