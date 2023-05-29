import React, { FC } from 'react';
import { NodeNetworkStateModelGroupVersionKind } from 'src/console-models';

import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';
import { List, ListItem } from '@patternfly/react-core';
import { V1beta1NodeNetworkState } from '@types';

const StateRow: FC<RowProps<V1beta1NodeNetworkState>> = ({ obj, activeColumnIDs }) => {
  const typesCount = obj?.status?.currentState?.interfaces.reduce((acc, iface) => {
    if (acc[iface.type]) {
      acc[iface.type] += 1;
    } else {
      acc[iface.type] = 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs} className="pf-m-width-30">
        <ResourceLink
          groupVersionKind={NodeNetworkStateModelGroupVersionKind}
          name={obj.metadata.name}
        />
      </TableData>
      <TableData id="network-interface" activeColumnIDs={activeColumnIDs} className="pf-m-width-50">
        <List isPlain>
          {Object.keys(typesCount)?.map((interfaceType) => (
            <ListItem key={interfaceType}>
              {interfaceType} ({typesCount[interfaceType]})
            </ListItem>
          ))}
        </List>
      </TableData>
    </>
  );
};

export default StateRow;
