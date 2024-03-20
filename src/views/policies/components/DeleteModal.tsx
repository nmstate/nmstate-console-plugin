import React, { FC, MouseEventHandler, useState } from 'react';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router';
import NodeNetworkConfigurationPolicyModel from 'src/console-models/NodeNetworkConfigurationPolicyModel';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { k8sDelete } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionList,
  ActionListItem,
  Alert,
  AlertVariant,
  Button,
  ButtonType,
  ButtonVariant,
  FormGroup,
  Modal,
  Stack,
  StackItem,
  TextInput,
} from '@patternfly/react-core';
import { V1NodeNetworkConfigurationPolicy } from '@types';
import ExternalLink from '@utils/components/ExternalLink/ExternalLink';
import { getResourceUrl } from '@utils/helpers';

type DeleteModalProps = {
  closeModal: () => void;
  isOpen?: boolean;
  policy: V1NodeNetworkConfigurationPolicy;
};

const DeleteModal: FC<DeleteModalProps> = ({ closeModal, isOpen, policy }) => {
  const { t } = useNMStateTranslation();
  const history = useHistory();
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setLoading(true);

    return k8sDelete({
      model: NodeNetworkConfigurationPolicyModel,
      resource: policy,
      ns: policy?.metadata?.namespace,
      name: policy?.metadata?.name,
    })
      .then(() => history.push(getResourceUrl({ model: NodeNetworkConfigurationPolicyModel })))
      .catch(setError)
      .finally(() => {
        setError(undefined);
        setLoading(false);
        closeModal();
      });
  };

  return (
    <Modal
      className="ocs-modal"
      onClose={closeModal}
      variant="medium"
      position="top"
      title={t('Delete NodeNetworkConfigurationPolicy?')}
      titleIconVariant="warning"
      footer={
        <Stack className="pf-u-flex-fill" hasGutter>
          {error && (
            <StackItem>
              <Alert isInline variant={AlertVariant.danger} title={t('An error occurred')}>
                <Stack hasGutter>
                  <StackItem>{error.message}</StackItem>
                  {error?.href && (
                    <StackItem>
                      <a href={error.href} target="_blank" rel="noreferrer">
                        {error.href}
                      </a>
                    </StackItem>
                  )}
                </Stack>
              </Alert>
            </StackItem>
          )}
          <StackItem>
            <ActionList>
              <ActionListItem>
                <Button
                  onClick={handleSubmit}
                  isDisabled={loading || inputValue !== policy?.metadata?.name}
                  isLoading={loading}
                  variant={ButtonVariant.danger}
                  type={ButtonType.submit}
                  form="delete-policy-form"
                >
                  {t('Delete')}
                </Button>
              </ActionListItem>
              <ActionListItem>
                <Button onClick={closeModal} variant={ButtonVariant.secondary}>
                  {t('Cancel')}
                </Button>
              </ActionListItem>
            </ActionList>
          </StackItem>
        </Stack>
      }
      isOpen={isOpen}
      id="delete-modal"
    >
      <form id="delete-policy-form">
        <p className="pf-u-mb-sm">
          <Trans t={t} ns="plugin__nmstate-console-plugin">
            Deleting the node network policy that added an interface does not change the
            configuration of the policy on the node. To remove the instances of the policy from the
            nodes, you must manually set each interface to <code>absent</code> in the{' '}
            <code>Edit</code> action.
            <ExternalLink href="https://docs.openshift.com/container-platform/4.12/networking/k8s_nmstate/k8s-nmstate-updating-node-network-config.html#virt-removing-interface-from-nodes_k8s_nmstate-updating-node-network-config" />
          </Trans>
        </p>
        <p className="pf-u-mb-md pf-u-mt-sm">
          <Trans t={t} ns="plugin__nmstate-console-plugin">
            Confirm deletion by typing <strong>{{ name: policy?.metadata?.name }}</strong> below:
          </Trans>
        </p>
        <FormGroup fieldId="text-confirmation">
          <TextInput
            id="text-confirmation"
            className="pf-v5-c-form-control "
            aria-label={t('Enter name')}
            placeholder={t('Enter name')}
            value={inputValue}
            onChange={(_, value) => setInputValue(value)}
          />
        </FormGroup>
      </form>
    </Modal>
  );
};

export default DeleteModal;
