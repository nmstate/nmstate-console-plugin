import React, { FC, PropsWithChildren } from 'react';
import { Trans } from 'react-i18next';

import { Button, ButtonVariant } from '@patternfly/react-core';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import ListSkeleton from './ListSkeleton';

type StatusBoxProps = PropsWithChildren<{
  loaded: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}>;

const StatusBox: FC<StatusBoxProps> = ({ loaded, error, children }) => {
  const { t } = useNMStateTranslation();

  if (error)
    return (
      <div className="cos-status-box loading-box loading-box__errored">
        <div className="pf-u-text-align-center cos-error-title">{error?.message}</div>
        <div className="pf-u-text-align-center">
          <Trans t={t} ns="plugin__nmstate-console-plugin">
            Please{' '}
            <Button isInline variant={ButtonVariant.link} onClick={() => location.reload()}>
              try again
            </Button>
            .
          </Trans>
        </div>
      </div>
    );

  if (!loaded) {
    return <ListSkeleton />;
  }

  return <>{children}</>;
};

export default StatusBox;
