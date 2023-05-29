import React, { FC, MouseEventHandler, useState } from 'react';
import { useHistory } from 'react-router';
import NodeNetworkConfigurationPolicyModel from 'src/console-models/NodeNetworkConfigurationPolicyModel';
import { getResourceUrl } from 'src/utils/helpers';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';
import { useImmer } from 'use-immer';

import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionGroup,
  Alert,
  AlertVariant,
  Button,
  ButtonType,
  ButtonVariant,
  PageSection,
  Title,
} from '@patternfly/react-core';
import {
  InterfaceType,
  NodeNetworkConfigurationInterface,
  V1NodeNetworkConfigurationPolicy,
} from '@types';
import { NETWORK_STATES } from '@utils/components/PolicyForm/constants';
import PolicyForm from '@utils/components/PolicyForm/PolicyForm';

import './new-policy.scss';

const initialPolicy: V1NodeNetworkConfigurationPolicy = {
  apiVersion: `${NodeNetworkConfigurationPolicyModel.apiGroup}/${NodeNetworkConfigurationPolicyModel.apiVersion}`,
  kind: NodeNetworkConfigurationPolicyModel.kind,
  metadata: {
    name: 'policy-name',
  },
  spec: {
    desiredState: {
      interfaces: [
        {
          name: 'br0',
          type: InterfaceType.LINUX_BRIDGE,
          state: NETWORK_STATES.Up,
        } as NodeNetworkConfigurationInterface,
      ],
    },
  },
};

const NewPolicy: FC = () => {
  const { t } = useNMStateTranslation();
  const [policy, setPolicy] = useImmer(initialPolicy);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(undefined);
  const history = useHistory();

  const onFormSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setLoading(true);
    return k8sCreate({
      model: NodeNetworkConfigurationPolicyModel,
      data: policy,
    })
      .then(() =>
        history.push(
          getResourceUrl({ model: NodeNetworkConfigurationPolicyModel, resource: policy }),
        ),
      )
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const goToYAMLEditor = () => {
    const baseUrl = getResourceUrl({ model: NodeNetworkConfigurationPolicyModel });
    history.push(`${baseUrl}~new`);
  };

  return (
    <PageSection className="new-policy-content">
      <Title className="new-policy-content__h1" headingLevel="h1">
        {t('Create NodeNetworkConfigurationPolicy')}

        <Button variant={ButtonVariant.link} onClick={goToYAMLEditor}>
          {t('Edit YAML')}
        </Button>
      </Title>

      <PolicyForm
        policy={policy}
        setPolicy={setPolicy}
        createForm={true}
        formId="create-policy-form"
      />

      {error && (
        <Alert
          variant={AlertVariant.danger}
          title={t('Create NodeNetworkConfigurationPolicy error')}
          isInline
        >
          {error.message}
        </Alert>
      )}

      <ActionGroup className="pf-c-form" form="">
        <Button
          isDisabled={loading}
          type={ButtonType.submit}
          variant={ButtonVariant.primary}
          onClick={onFormSubmit}
          isLoading={loading}
          form="create-policy-form"
        >
          {t('Create')}
        </Button>
      </ActionGroup>
    </PageSection>
  );
};

export default NewPolicy;
