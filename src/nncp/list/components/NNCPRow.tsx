import * as React from 'react';
import {
  NodeNetworkConfigurationPolicyModelGroupVersionKind,
  V1NodeNetworkConfigurationPolicy,
} from 'nmstate-ts';

import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';

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
