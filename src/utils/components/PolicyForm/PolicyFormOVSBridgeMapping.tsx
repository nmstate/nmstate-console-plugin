import React, { FC } from 'react';
import { Updater } from 'use-immer';

import { Button, ButtonVariant, Popover, Text } from '@patternfly/react-core';
import { HelpIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { V1NodeNetworkConfigurationPolicy } from '@types';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import PolicyFormOVSBridgeMappingExpandable from './PolicyFormOVSBridgeMappingExpandable';

type PolicyFormOVSBridgeMappingProps = {
  policy: V1NodeNetworkConfigurationPolicy;
  setPolicy: Updater<V1NodeNetworkConfigurationPolicy>;
};

const PolicyFormOVSBridgeMapping: FC<PolicyFormOVSBridgeMappingProps> = ({ policy, setPolicy }) => {
  const { t } = useNMStateTranslation();

  return (
    <div>
      <Text className="pf-u-primary-color-100 pf-u-font-weight-bold pf-u-font-size-lg">
        {t('Open vSwitch bridge mapping')}{' '}
        <Popover
          aria-label={'Help'}
          bodyContent={t(
            'The Open vSwitch bridge mapping is a list of Open vSwitch bridges and the physical interfaces that are connected to them.',
          )}
        >
          <HelpIcon />
        </Popover>
      </Text>
      <Text className="policy-form-content__add-new-interface pf-u-mt-md">
        <Button
          className="pf-m-link--align-left pf-u-ml-md"
          onClick={() =>
            setPolicy((draftPolicy) => {
              draftPolicy.spec.desiredState.ovn['bridge-mapping'].unshift({
                bridge: '',
                localnet: '',
                state: 'present',
              });
            })
          }
          variant={ButtonVariant.link}
        >
          <PlusCircleIcon /> <span className="pf-u-ml-sm">{t('Add mapping')}</span>
        </Button>
      </Text>
      <PolicyFormOVSBridgeMappingExpandable policy={policy} setPolicy={setPolicy} />
    </div>
  );
};

export default PolicyFormOVSBridgeMapping;
