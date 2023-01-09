import React, { FC, useState } from 'react';
import { Trans } from 'react-i18next';
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
  Form,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  FormGroup,
  PageSection,
  Popover,
  Text,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { HelpIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { MinusCircleIcon } from '@patternfly/react-icons';
import {
  InterfaceType,
  NodeNetworkConfigurationInterface,
  V1NodeNetworkConfigurationPolicy,
} from '@types';

import ApplySelectorCheckbox from './components/ApplySelectorCheckbox';
import { NETWORK_STATES } from './components/constants';
import NodeSelectorModal from './components/NodeSelectorModal/NodeSelectorModal';
import PolicyInterface, { onInterfaceChangeType } from './components/PolicyInterface';
import { getExpandableTitle } from './utils';

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
  const history = useHistory();
  const { t } = useNMStateTranslation();
  const [policy, setPolicy] = useImmer(initialPolicy);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const onDescriptionChange = (newDescription: string) => {
    setPolicy(({ metadata }) => {
      if (!metadata.annotations) metadata.annotations = {};

      metadata.annotations.description = newDescription;
    });
  };

  const addNewInterface = () => {
    setPolicy((draftPolicy) => {
      if (!draftPolicy.spec?.desiredState?.interfaces) {
        draftPolicy.spec.desiredState = {
          interfaces: [] as NodeNetworkConfigurationInterface[],
        };
      }

      draftPolicy.spec.desiredState.interfaces.unshift({
        type: InterfaceType.LINUX_BRIDGE,
        name: `interface-${draftPolicy.spec.desiredState.interfaces.length}`,
      });
    });
  };

  const removeInterface = (interfaceIndex: number) => {
    setPolicy((draftPolicy) => {
      (draftPolicy.spec.desiredState.interfaces as NodeNetworkConfigurationInterface[]).splice(
        interfaceIndex,
        1,
      );
    });
  };

  const onSubmit = () => {
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

  return (
    <PageSection>
      <NodeSelectorModal
        isOpen={modalOpen}
        nncp={policy}
        onClose={() => setModalOpen(false)}
        onSubmit={(newPolicy) => {
          setPolicy(newPolicy);
          setModalOpen(false);
        }}
      />
      <div className="new-policy-content">
        <Title className="new-policy-content__h1" headingLevel="h1">
          {t('Create node network configuration policy')}

          <Button variant={ButtonVariant.link}>Edit YAML</Button>
        </Title>
        <Form>
          <FormGroup fieldId="text">
            <Text>
              <Trans t={t} ns="plugin__nmstate-console-plugin">
                Node network is configured and managed by NM state. Create a node netowrk
                configuration policy to describe the requested network configuration on your nodes
                in the cluster. The node network configuration enactment reports the netwrok
                policies enacted upon each node.
              </Trans>
            </Text>
          </FormGroup>
          <FormGroup fieldId="apply-selector">
            <ApplySelectorCheckbox
              isChecked={!!policy.spec.nodeSelector}
              onChange={(checked) => {
                if (checked) setModalOpen(true);
                else
                  setPolicy((draftPolicy) => {
                    delete draftPolicy.spec.nodeSelector;
                  });
              }}
            />
          </FormGroup>
          <FormGroup label={t('Policy name')} isRequired fieldId="policy-name-group">
            <TextInput
              isRequired
              type="text"
              id="policy-name"
              name="policy-name"
              value={policy.metadata.name}
              onChange={(newName) =>
                setPolicy((draftPolicy) => {
                  draftPolicy.metadata.name = newName;
                })
              }
            />
          </FormGroup>
          <FormGroup label={t('Description')} isRequired fieldId="policy-description-group">
            <TextInput
              type="text"
              id="policy-description"
              name="policy-description"
              value={policy?.metadata?.annotations?.description}
              onChange={onDescriptionChange}
            />
          </FormGroup>
          <div>
            <Text className="pf-u-primary-color-100 pf-u-font-weight-bold pf-u-font-size-lg">
              {t('Node network configuration policy interface')}{' '}
              <Popover
                aria-label={'Help'}
                bodyContent={() => (
                  <div>
                    {t(
                      'Checking this option will create a new PVC of the bootsource for the new template',
                    )}
                  </div>
                )}
              >
                <HelpIcon />
              </Popover>
            </Text>

            <Text className="new-policy-content__add-new-interface">
              <Button
                className="pf-m-link--align-left"
                onClick={addNewInterface}
                type="button"
                variant="link"
              >
                <PlusCircleIcon /> {t('Add another interface to the policy')}
              </Button>
            </Text>

            {policy.spec?.desiredState?.interfaces.map((policyInterface, index) => (
              <FormFieldGroupExpandable
                key={`${policyInterface.type}-${index}`}
                className="policy-interface__expandable"
                toggleAriaLabel={t('Details')}
                isExpanded={true}
                header={
                  <FormFieldGroupHeader
                    titleText={{
                      text: getExpandableTitle(policyInterface, t),
                      id: `nncp-interface-${index}`,
                    }}
                    actions={
                      <Button
                        variant="plain"
                        aria-label={t('Remove')}
                        onClick={() => removeInterface(index)}
                      >
                        <MinusCircleIcon />
                      </Button>
                    }
                  />
                }
              >
                <PolicyInterface
                  id={index}
                  policyInterface={policyInterface}
                  onInterfaceChange={(updateInterface: onInterfaceChangeType) =>
                    setPolicy((draftPolicy) => {
                      updateInterface(draftPolicy.spec.desiredState.interfaces[index]);
                    })
                  }
                />
              </FormFieldGroupExpandable>
            ))}
          </div>

          {error && (
            <Alert
              variant={AlertVariant.danger}
              title={t('Create NodeNetworkConfigurationPolicy error')}
              isInline
            >
              {error.message}
            </Alert>
          )}

          <ActionGroup className="pf-c-form">
            <Button
              isDisabled={loading}
              type={ButtonType.submit}
              variant={ButtonVariant.primary}
              onClick={onSubmit}
              isLoading={loading}
            >
              {t('Create')}
            </Button>
            {/* <Button type="button" variant="secondary" onClick={onReload}>
            {t('Reload')}
          </Button> */}
          </ActionGroup>
        </Form>
      </div>
    </PageSection>
  );
};

export default NewPolicy;
