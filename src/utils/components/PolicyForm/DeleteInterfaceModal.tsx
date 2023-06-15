import React, { FC } from 'react';
import { Trans } from 'react-i18next';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  ActionList,
  ActionListItem,
  Button,
  ButtonVariant,
  Modal,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { NodeNetworkConfigurationInterface } from '@types';

import { capitalizeFirstLetter } from './utils';

type DeleteInterfaceModalProps = {
  closeModal: () => void;
  isOpen?: boolean;
  policyInterface: NodeNetworkConfigurationInterface;
  onSubmit: (policyInterface: NodeNetworkConfigurationInterface) => void;
};

const DeleteInterfaceModal: FC<DeleteInterfaceModalProps> = ({
  closeModal,
  isOpen,
  policyInterface,
  onSubmit,
}) => {
  const { t } = useNMStateTranslation();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(policyInterface);
    closeModal();
  };

  return (
    <Modal
      className="ocs-modal"
      onClose={closeModal}
      variant="medium"
      position="top"
      title={t('Delete NodeNetworkConfigurationPolicyInterface?')}
      titleIconVariant="warning"
      footer={
        <Stack className="pf-u-flex-fill" hasGutter>
          <StackItem>
            <ActionList>
              <ActionListItem>
                <Button
                  onClick={handleSubmit}
                  variant={ButtonVariant.danger}
                  form="delete-interface-form"
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
      <form id="delete-interface-form">
        <p className="pf-u-mb-md pf-u-mt-sm">
          <Trans t={t} ns="plugin__nmstate-console-plugin">
            Are you sure you want to remove{' '}
            {{ interfaceType: capitalizeFirstLetter(policyInterface?.type) }} interface{' '}
            <strong>{{ name: policyInterface.name }}</strong>?
          </Trans>
        </p>
      </form>
    </Modal>
  );
};

export default DeleteInterfaceModal;
