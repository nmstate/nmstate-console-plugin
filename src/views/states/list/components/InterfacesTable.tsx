import React, { FC } from 'react';

import { Table, TableGridBreakpoint, Tbody, Th, Thead, Tr } from '@patternfly/react-table';
import { NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';

import useInterfaceColumns from '../hooks/useInterfaceColumns';

import InterfacesTypeSection from './InterfacesTypeSection';

import './interfaces-table.scss';

interface InterfacesTableProps {
  interfacesByType: { [interfaceType in string]: NodeNetworkConfigurationInterface[] };
  nodeNetworkState: V1beta1NodeNetworkState;
  expandAll: boolean;
}

const InterfacesTable: FC<InterfacesTableProps> = ({
  interfacesByType,
  nodeNetworkState,
  expandAll,
}) => {
  const columns = useInterfaceColumns();

  return (
    <Table
      gridBreakPoint={TableGridBreakpoint.none}
      role="presentation"
      className="interfaces-table"
    >
      <Thead>
        <Tr>
          {columns.map((column) => (
            <Th key={column.id} {...column?.props}>
              {column.title}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {Object.keys(interfacesByType)
          .sort()
          .map((interfaceType) => (
            <InterfacesTypeSection
              key={interfaceType}
              interfaceType={interfaceType}
              interfaces={interfacesByType[interfaceType]}
              nodeNetworkState={nodeNetworkState}
              expandAll={expandAll}
            />
          ))}
      </Tbody>
    </Table>
  );
};

export default InterfacesTable;
