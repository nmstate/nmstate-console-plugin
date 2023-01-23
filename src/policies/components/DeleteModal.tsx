import React, { useState } from 'react';
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
  ButtonVariant,
  Modal,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { V1NodeNetworkConfigurationPolicy } from '@types';
import { getResourceUrl } from '@utils/helpers';

type DeleteModalProps = {
  closeModal?: () => void;
  isOpen?: boolean;
  policy: V1NodeNetworkConfigurationPolicy;
};

const DeleteModal: React.FC<DeleteModalProps> = ({ closeModal, isOpen, policy }) => {
  const { t } = useNMStateTranslation();
  const history = useHistory();
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
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
      });
  };

  return (
    <Modal
      className="ocs-modal"
      onClose={closeModal}
      variant="medium"
      position="top"
      title={t('Delete Node network configuration policy')}
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
                  isDisabled={loading}
                  isLoading={loading}
                  variant={ButtonVariant.danger}
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
        <Trans t={t} ns="plugin__nmstate-console-plugin">
          Are you sure you want to delete <strong>{policy?.metadata?.name}</strong>?
        </Trans>
      </form>
    </Modal>
  );
};

export default DeleteModal;
