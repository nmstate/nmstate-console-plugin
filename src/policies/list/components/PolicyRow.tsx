import React, { FC } from 'react';
import { NodeNetworkConfigurationPolicyModelGroupVersionKind } from 'src/console-models';
import { ENACTMENT_LABEL_POLICY } from 'src/utils/constants';
import { getContentScrollableElement } from 'src/utils/helpers';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core';
import { V1beta1NodeNetworkConfigurationEnactment, V1NodeNetworkConfigurationPolicy } from '@types';

import EditModal from './EditModal';
import EnactmentStateColumn from './EnactmentStateColumn';

const PolicyRow: FC<
  RowProps<
    V1NodeNetworkConfigurationPolicy,
    {
      selectPolicy: (policy: V1NodeNetworkConfigurationPolicy) => void;
      enactments: V1beta1NodeNetworkConfigurationEnactment[];
    }
  >
> = ({ obj, activeColumnIDs, rowData: { selectPolicy, enactments } }) => {
  const { t } = useNMStateTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const policyEnactments = enactments?.filter(
    (enactment) => enactment?.metadata?.labels?.[ENACTMENT_LABEL_POLICY] === obj?.metadata?.name,
  );

  const onEditModalToggle = () => {
    setIsEditModalOpen(true);
  };

  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs} className="pf-m-width-30">
        <ResourceLink
          groupVersionKind={NodeNetworkConfigurationPolicyModelGroupVersionKind}
          name={obj.metadata.name}
        />
      </TableData>
      <TableData id="nodes" activeColumnIDs={activeColumnIDs} className="pf-m-width-30">
        <Button
          variant="link"
          isInline
          onClick={() => policyEnactments.length !== 0 && selectPolicy(obj)}
        >
          {policyEnactments.length} {t('nodes')}
        </Button>
      </TableData>
      <TableData id="status" activeColumnIDs={activeColumnIDs} className="pf-m-width-30">
        <EnactmentStateColumn enactments={policyEnactments} />
      </TableData>
      <TableData
        id="actions"
        activeColumnIDs={activeColumnIDs}
        className="dropdown-kebab-pf pf-c-table__action"
      >
        <Dropdown
          menuAppendTo={getContentScrollableElement}
          onSelect={() => setIsDropdownOpen(false)}
          toggle={<KebabToggle onToggle={setIsDropdownOpen} id="toggle-id-edit" />}
          isOpen={isDropdownOpen}
          isPlain
          dropdownItems={[
            <DropdownItem onClick={onEditModalToggle} key="edit">
              {t('Edit')}
            </DropdownItem>,
          ]}
          position={DropdownPosition.right}
        />
        <EditModal
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          policy={obj}
        />
      </TableData>
    </>
  );
};

export default PolicyRow;
