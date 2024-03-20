import React, { FC, useState } from 'react';
import { useHistory } from 'react-router';
import NodeNetworkConfigurationPolicyModel from 'src/console-models/NodeNetworkConfigurationPolicyModel';
import { asAccessReview, getResourceUrl } from 'src/utils/helpers';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { useAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import { V1NodeNetworkConfigurationPolicy } from '@types';
import ActionsDropdown from '@utils/components/ActionsDropdown/ActionsDropdown';
import Loading from '@utils/components/Loading/Loading';

import DeleteModal from '../components/DeleteModal';
import EditModal from '../components/EditModal';
import { isPolicySupported } from '../utils';

import { getEditDescrition } from './utils';

type PolicyActionsProps = {
  policy: V1NodeNetworkConfigurationPolicy;
  isKebabToggle?: boolean;
  isPolicyArchived?: boolean | undefined;
};

const PolicyActions: FC<PolicyActionsProps> = ({ policy, isKebabToggle }) => {
  const history = useHistory();
  const formSupported = isPolicySupported(policy);
  const { t } = useNMStateTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [canUpdatePolicy] = useAccessReview({
    verb: 'update',
    resource: NodeNetworkConfigurationPolicyModel.plural,
  });

  const [canDeletePolicy] = useAccessReview({
    verb: 'delete',
    resource: NodeNetworkConfigurationPolicyModel.plural,
  });

  const onEditModalToggle = () => {
    if (formSupported) return setIsEditModalOpen(true);

    const policyDetailPage = getResourceUrl({
      model: NodeNetworkConfigurationPolicyModel,
      resource: policy,
    });

    history.push(`${policyDetailPage}/yaml`);
  };

  const onDeleteModalToggle = () => {
    setIsDeleteModalOpen(true);
  };

  const actions = [
    {
      accessReview: asAccessReview(NodeNetworkConfigurationPolicyModel, policy, 'update'),
      cta: onEditModalToggle,
      id: 'edit-policy',
      label: t('Edit'),
      description: getEditDescrition(formSupported, canUpdatePolicy),
    },
    {
      accessReview: asAccessReview(NodeNetworkConfigurationPolicyModel, policy, 'delete'),
      cta: onDeleteModalToggle,
      id: 'delete-policy',
      label: t('Delete'),
      description: canDeletePolicy === false && t('Cannot delete in view-only mode'),
    },
  ];

  if (!policy) return <Loading />;

  return (
    <>
      <ActionsDropdown
        actions={actions}
        id="virtual-machine-instance-migration-actions"
        isKebabToggle={isKebabToggle}
      />
      {policy && isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          policy={policy}
        />
      )}
      {policy && isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          closeModal={() => setIsDeleteModalOpen(false)}
          policy={policy}
        />
      )}
    </>
  );
};

export default PolicyActions;
