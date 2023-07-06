import React, { FC, useCallback, useState } from 'react';

import { Button, ButtonVariant, debounce, Tooltip } from '@patternfly/react-core';
import { NodeNetworkConfigurationInterface } from '@types';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import { copyToClipboard, downloadYAML } from './utils';

type InterfaceDrawerFooterProps = {
  selectedInterface: NodeNetworkConfigurationInterface;
};

const InterfaceDrawerYAMLFooter: FC<InterfaceDrawerFooterProps> = ({ selectedInterface }) => {
  const { t } = useNMStateTranslation();
  const [copied, setCopied] = useState(false);

  const resetCopied = useCallback(
    debounce(() => {
      setCopied(false);
    }, 3000),
    [],
  );

  const onCopy = useCallback(() => {
    copyToClipboard(selectedInterface);
    setCopied(true);

    resetCopied();
  }, []);

  return (
    <>
      <Tooltip content={copied ? t('Copied') : t('Copy YAML to clipboard')}>
        <Button variant={ButtonVariant.primary} onClick={onCopy}>
          {t('Copy')}
        </Button>
      </Tooltip>
      <Button
        variant={ButtonVariant.secondary}
        onClick={() => downloadYAML(selectedInterface)}
        className="pf-u-ml-md"
      >
        {t('Download YAML')}
      </Button>
    </>
  );
};

export default InterfaceDrawerYAMLFooter;
