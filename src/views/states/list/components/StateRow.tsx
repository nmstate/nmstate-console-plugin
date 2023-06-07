import React, { FC, useState } from 'react';
import { NodeNetworkStateModelGroupVersionKind } from 'src/console-models';

import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';
import { List, ListItem, Title } from '@patternfly/react-core';
import { ExpandableRowContent, Tbody, Td, Tr } from '@patternfly/react-table';
import { V1beta1NodeNetworkState } from '@types';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import InterfacesTable from './InterfacesTable';

const StateRow: FC<RowProps<V1beta1NodeNetworkState, { rowIndex: number }>> = ({
  obj,
  activeColumnIDs,
  rowData: { rowIndex },
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useNMStateTranslation();
  const interfaces = obj?.status?.currentState?.interfaces;

  const interfacesByType = interfaces?.reduce((acc, iface) => {
    acc[iface.type] ??= [];
    acc[iface.type].push(iface);
    return acc;
  }, {} as { [key: string]: number });

  return (
    <Tbody key={obj.metadata.name} isExpanded={isExpanded} role="rowgroup">
      <Tr>
        <Td
          expand={{
            rowIndex,
            isExpanded,
            onToggle: (event, rowIndex, isOpen) => setIsExpanded(isOpen),
            expandId: 'expand-interfaces-list',
          }}
        />
        <TableData id="name" activeColumnIDs={activeColumnIDs}>
          <ResourceLink
            groupVersionKind={NodeNetworkStateModelGroupVersionKind}
            name={obj.metadata.name}
          />
        </TableData>
        <TableData
          id="network-interface"
          activeColumnIDs={activeColumnIDs}
          className="pf-m-width-50"
        >
          <List isPlain>
            {Object.keys(interfacesByType)?.map((interfaceType) => (
              <ListItem key={interfaceType}>
                {interfaceType} ({interfacesByType[interfaceType].length})
              </ListItem>
            ))}
          </List>
        </TableData>
      </Tr>
      <Tr isExpanded={isExpanded}>
        <Td colSpan={3}>
          <ExpandableRowContent>
            <Title headingLevel="h2">{t('Network details')}</Title>
            <Title headingLevel="h3">
              {interfaces.length} {t('Interfaces')}
            </Title>

            <InterfacesTable interfacesByType={interfacesByType} />
          </ExpandableRowContent>
        </Td>
      </Tr>
    </Tbody>
  );
};

export default StateRow;
