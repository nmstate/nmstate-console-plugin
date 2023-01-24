import React, { useState } from 'react';
import produce from 'immer';
import NodeNetworkConfigurationPolicyModel from 'src/console-models/NodeNetworkConfigurationPolicyModel';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { k8sUpdate } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionList,
  ActionListItem,
  Alert,
  AlertVariant,
  Button,
  Modal,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { NodeNetworkConfigurationInterface, V1NodeNetworkConfigurationPolicy } from '@types';

type ArchiveModalProps = {
  closeModal?: () => void;
  isOpen?: boolean;
  policy: V1NodeNetworkConfigurationPolicy;
};

const ArchiveModal: React.FC<ArchiveModalProps> = ({ closeModal, isOpen, policy }) => {
  const { t } = useNMStateTranslation();
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);

    const newPolicy = produce(policy, (draftPolicy) => {
      draftPolicy?.spec?.desiredState?.interfaces?.forEach(
        (iface: NodeNetworkConfigurationInterface) => {
          iface.state = 'absent';
        },
      );
    });

    return k8sUpdate({
      model: NodeNetworkConfigurationPolicyModel,
      data: newPolicy,
      ns: newPolicy?.metadata?.namespace,
      name: newPolicy?.metadata?.name,
    })
      .then(() => closeModal())
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
      variant="small"
      position="top"
      title={t('Archive Node network configuration policy')}
      footer={
        <Stack className="archive-modal-footer pf-u-flex-fill" hasGutter>
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
                  variant={'primary'}
                  form="archive-policy-form"
                >
                  {t('Archive')}
                </Button>
              </ActionListItem>
              <ActionListItem>
                <Button onClick={closeModal} variant="link">
                  {t('Cancel')}
                </Button>
              </ActionListItem>
            </ActionList>
          </StackItem>
        </Stack>
      }
      isOpen={isOpen}
      id="archive-modal"
    >
      <form id="archive-policy-form" onSubmit={handleSubmit}>
        <p>
          {t(
            'Archiving will remove the policy from all nodes, are you sure you want to archive this policy?',
          )}
        </p>
      </form>
    </Modal>
  );
};

export default ArchiveModal;
