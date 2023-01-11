import React, { FC, useState } from 'react';
import { Trans } from 'react-i18next';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';
import { Updater } from 'use-immer';

import {
  Button,
  Form,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  FormGroup,
  Popover,
  Text,
  TextInput,
} from '@patternfly/react-core';
import { HelpIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { MinusCircleIcon } from '@patternfly/react-icons';
import {
  InterfaceType,
  NodeNetworkConfigurationInterface,
  V1NodeNetworkConfigurationPolicy,
} from '@types';

import NodeSelectorModal from '../NodeSelectorModal/NodeSelectorModal';

import ApplySelectorCheckbox from './ApplySelectorCheckbox';
import PolicyInterface, { onInterfaceChangeType } from './PolicyInterface';
import { getExpandableTitle } from './utils';

import './policy-form.scss';

type PolicyFormProps = {
  policy: V1NodeNetworkConfigurationPolicy;
  setPolicy: Updater<V1NodeNetworkConfigurationPolicy>;
  createForm?: boolean;
  formId?: string;
};

const PolicyForm: FC<PolicyFormProps> = ({ policy, setPolicy, createForm = false, formId }) => {
  const { t } = useNMStateTranslation();
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

  return (
    <Form className="policy-form-content" id={formId}>
      {createForm && (
        <>
          <NodeSelectorModal
            isOpen={modalOpen}
            policy={policy}
            onClose={() => setModalOpen(false)}
            onSubmit={(newPolicy) => {
              setPolicy(newPolicy);
              setModalOpen(false);
            }}
          />
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
              isChecked={!!policy?.spec.nodeSelector}
              onChange={(checked) => {
                if (checked) setModalOpen(true);
                else
                  setPolicy((draftPolicy) => {
                    delete draftPolicy.spec.nodeSelector;
                  });
              }}
            />
          </FormGroup>
        </>
      )}
      <FormGroup label={t('Policy name')} isRequired fieldId="policy-name-group">
        <TextInput
          isRequired
          type="text"
          id="policy-name"
          name="policy-name"
          value={policy?.metadata?.name}
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

        <Text className="policy-form-content__add-new-interface pf-u-mt-md">
          <Button
            className="pf-m-link--align-left pf-u-ml-md"
            onClick={addNewInterface}
            type="button"
            variant="link"
          >
            <PlusCircleIcon />{' '}
            <span className="pf-u-ml-sm">{t('Add another interface to the policy')}</span>
          </Button>
        </Text>

        {policy?.spec?.desiredState?.interfaces.map((policyInterface, index) => (
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
              editForm={!createForm}
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
    </Form>
  );
};

export default PolicyForm;
