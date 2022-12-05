import * as React from 'react';
import { Trans } from 'react-i18next';
import { V1NodeNetworkConfigurationPolicy } from 'nmstate-ts';
import NodeNetworkConfigurationPolicyModel from 'nmstate-ts/console-models/NodeNetworkConfigurationPolicyModel';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';
import { useImmer } from 'use-immer';

import {
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  PageSection,
  Popover,
  Text,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { HelpIcon, PlusCircleIcon } from '@patternfly/react-icons';

import ApplySelectorCheckbox from './components/ApplySelectorCheckbox';
import NNCPInterface from './components/NNCPInterface';

import './nncp-new.scss';

const InitialNNCP: V1NodeNetworkConfigurationPolicy = {
  apiVersion: `${NodeNetworkConfigurationPolicyModel.apiGroup}/${NodeNetworkConfigurationPolicyModel.apiVersion}`,
  kind: NodeNetworkConfigurationPolicyModel.kind,
  metadata: {
    name: 'policy-name',
  },
  spec: {},
};

const NNCPNew: React.FC = () => {
  const { t } = useNMStateTranslation();
  const [nncp, setNNCP] = useImmer(InitialNNCP);

  const onDescriptionChange = (newDescription: string) => {
    setNNCP(({ metadata }) => {
      if (!metadata.annotations) metadata.annotations = {};

      metadata.annotations.description = newDescription;
    });
  };

  const addNewInterface = () => {
    console.log('add interface');
  };

  return (
    <PageSection>
      <div className="nncp-new-content">
        <Title className="nncp-new-content__h1" headingLevel="h1">
          {t('Create node network configuration policy')}

          <Button variant={ButtonVariant.link}>Edit YAML</Button>
        </Title>
        <Form>
          <FormGroup fieldId="text">
            <Text>
              <Trans>
                Node network is configured and managed by NM state. Create a node netowrk
                configuration policy to describe the requested network configuration on your nodes
                in the cluster. The node network configuration enactment reports the netwrok
                policies enacted upon each node.
              </Trans>
            </Text>
          </FormGroup>
          <FormGroup fieldId="apply-selector">
            <ApplySelectorCheckbox
              isChecked={true}
              onChange={() => {
                console.log('apply');
              }}
            />
          </FormGroup>
          <FormGroup label={t('Policy name')} isRequired fieldId="policy-name-group">
            <TextInput
              isRequired
              type="text"
              id="policy-name"
              name="policy-name"
              value={nncp.metadata.name}
              onChange={(newName) => setNNCP(({ metadata }) => (metadata.name = newName))}
            />
          </FormGroup>
          <FormGroup label={t('Description')} isRequired fieldId="policy-description-group">
            <TextInput
              type="text"
              id="policy-description"
              name="policy-description"
              value={nncp?.metadata?.annotations?.description}
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

            <Text className="nncp-new-content__add-new-interface">
              <Button
                className="pf-m-link--align-left"
                onClick={addNewInterface}
                type="button"
                variant="link"
              >
                <PlusCircleIcon /> {t('Add another interface to the policy')}
              </Button>
            </Text>

            <NNCPInterface index={0} nncpInterface={{}} />
          </div>
        </Form>
      </div>
    </PageSection>
  );
};

export default NNCPNew;
