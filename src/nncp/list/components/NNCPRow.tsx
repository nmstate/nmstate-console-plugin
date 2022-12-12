import * as React from 'react';
import { NodeNetworkConfigurationPolicyModelGroupVersionKind } from 'src/console-models';

import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';
import { V1NodeNetworkConfigurationPolicy } from '@types';

const NNCPRow: React.FC<RowProps<V1NodeNetworkConfigurationPolicy>> = ({
  obj,
  activeColumnIDs,
}) => {
  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs} className="pf-m-width-30">
        <ResourceLink
          groupVersionKind={NodeNetworkConfigurationPolicyModelGroupVersionKind}
          name={obj.metadata.name}
        />
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
        <ResourceLink kind="Namespace" name={obj.metadata.namespace} />
      </TableData>
      <TableData
        id=""
        activeColumnIDs={activeColumnIDs}
        className="dropdown-kebab-pf pf-c-table__action"
      ></TableData>
    </>
  );
};

export default NNCPRow;
