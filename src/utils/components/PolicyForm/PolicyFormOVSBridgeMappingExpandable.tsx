import React, { FC, FormEvent } from 'react';
import { Updater } from 'use-immer';

import {
  Button,
  ButtonVariant,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import { V1NodeNetworkConfigurationPolicy } from '@types';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

type PolicyFormOVSBridgeMappingExpandableProps = {
  policy: V1NodeNetworkConfigurationPolicy;
  setPolicy: Updater<V1NodeNetworkConfigurationPolicy>;
};

const PolicyFormOVSBridgeMappingExpandable: FC<PolicyFormOVSBridgeMappingExpandableProps> = ({
  policy,
  setPolicy,
}) => {
  const { t } = useNMStateTranslation();

  const onChange =
    (index: number, field: string) => (_: FormEvent<HTMLInputElement>, value: string) => {
      setPolicy((draftPolicy) => {
        draftPolicy.spec.desiredState.ovn['bridge-mapping'][index] = {
          ...draftPolicy.spec.desiredState.ovn['bridge-mapping'][index],
          [field]: value,
        };
      });
    };

  const onRemove = (index: number) => {
    setPolicy((draftPolicy) => {
      draftPolicy.spec.desiredState.ovn['bridge-mapping'].splice(index, 1);
    });
  };

  return policy?.spec?.desiredState?.ovn?.['bridge-mapping']?.map((bridgeMapping, index) => {
    return (
      <PageSection variant={PageSectionVariants.light} key={index}>
        <Flex alignItems={{ default: 'alignItemsFlexEnd' }} marginWidth={20}>
          <FlexItem grow={{ default: 'grow' }} spacer={{ default: 'spacer4xl' }}>
            <Title headingLevel="h6" size="md">
              {t('OVN localnet name')}
            </Title>
            <TextInput value={bridgeMapping?.localnet} onChange={onChange(index, 'localnet')} />
          </FlexItem>
          <FlexItem grow={{ default: 'grow' }}>
            <Title headingLevel="h6" size="md">
              {t('OVS bridge name')}
            </Title>
            <TextInput value={bridgeMapping?.bridge} onChange={onChange(index, 'bridge')} />
          </FlexItem>
          <FlexItem>
            <Button
              variant={ButtonVariant.plain}
              aria-label={t('Remove')}
              onClick={() => onRemove(index)}
            >
              <MinusCircleIcon />
            </Button>
          </FlexItem>
        </Flex>
      </PageSection>
    );
  });
};

export default PolicyFormOVSBridgeMappingExpandable;
