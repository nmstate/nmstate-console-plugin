import React from 'react';
import { useHistory } from 'react-router';
import NodeNetworkConfigurationPolicyModel from 'src/console-models/NodeNetworkConfigurationPolicyModel';
import { getContentScrollableElement, getResourceUrl } from 'src/utils/helpers';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  KebabToggle,
} from '@patternfly/react-core';
import { V1NodeNetworkConfigurationPolicy } from '@types';

import DeleteModal from '../components/DeleteModal';
import EditModal from '../components/EditModal';
import { isPolicySupported } from '../utils';

type PolicyActionsProps = {
  policy: V1NodeNetworkConfigurationPolicy;
  isKebabToggle?: boolean;
  isPolicyArchived?: boolean | undefined;
};

const PolicyActions: React.FC<PolicyActionsProps> = ({ policy, isKebabToggle }) => {
  const history = useHistory();
  const formSupported = isPolicySupported(policy);
  const { t } = useNMStateTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

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

  return (
    <>
      <Dropdown
        menuAppendTo={getContentScrollableElement}
        onSelect={() => setIsDropdownOpen(false)}
        toggle={
          isKebabToggle ? (
            <KebabToggle onToggle={setIsDropdownOpen} />
          ) : (
            <DropdownToggle onToggle={setIsDropdownOpen}>{t('Actions')}</DropdownToggle>
          )
        }
        isOpen={isDropdownOpen}
        isPlain={isKebabToggle}
        dropdownItems={[
          <DropdownItem
            onClick={onEditModalToggle}
            key="edit"
            description={!formSupported && t('Edit using YAML')}
          >
            {t('Edit')}
          </DropdownItem>,
          <DropdownItem onClick={onDeleteModalToggle} key="delete">
            {t('Delete')}
          </DropdownItem>,
        ]}
        position={DropdownPosition.right}
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
