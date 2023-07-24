import React, { FC } from 'react';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { ExpandableSection, FormGroup, Text, TextInput } from '@patternfly/react-core';
import { NodeNetworkConfigurationInterface } from '@types';

type CopyMACProps = {
  id: number;
  policyInterface?: NodeNetworkConfigurationInterface;
  onInterfaceChange?: (
    updateInterface: (policyInterface: NodeNetworkConfigurationInterface) => void,
  ) => void;
};

const CopyMAC: FC<CopyMACProps> = ({ id, policyInterface, onInterfaceChange }) => {
  const { t } = useNMStateTranslation();

  const onPortChange = (value) => {
    onInterfaceChange((draftInterface) => {
      value ? (draftInterface['copy-mac-from'] = value) : delete draftInterface['copy-mac-from'];
    });
  };

  return (
    <ExpandableSection toggleText={t('Copy MAC address')} data-test-id={`copy-mac-${id}`}>
      <div className="pf-u-ml-md">
        <Text className="pf-u-color-200 pf-u-mb-lg">
          {t(
            'This is the list of ports to copy MAC address from. Select one of the matched ports this policy will apply to',
          )}
        </Text>

        <FormGroup label={t('Port name')} fieldId={`copy-mac-port-${id}`}>
          <TextInput
            value={policyInterface?.['copy-mac-from']}
            type="text"
            id={`policy-interface-copy-mac-from-${id}`}
            onChange={onPortChange}
          />
        </FormGroup>
      </div>
    </ExpandableSection>
  );
};

export default CopyMAC;
