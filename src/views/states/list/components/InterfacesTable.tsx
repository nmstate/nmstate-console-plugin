import React, { FC } from 'react';

import { Table, TableGridBreakpoint, TableHeader, Tbody } from '@patternfly/react-table';
import { NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';

import useInterfaceColumns from '../hooks/useInterfaceColumns';

import InterfacesTypeSection from './InterfacesTypeSection';

import './interfaces-table.scss';

interface InterfacesTableProps {
  interfacesByType: { [interfaceType in string]: NodeNetworkConfigurationInterface[] };
  nodeNetworkState: V1beta1NodeNetworkState;
}

const InterfacesTable: FC<InterfacesTableProps> = ({ interfacesByType, nodeNetworkState }) => {
  const columns = useInterfaceColumns();

  return (
    <Table
      cells={columns}
      gridBreakPoint={TableGridBreakpoint.none}
      role="presentation"
      className="interfaces-table"
    >
      <TableHeader />
      <Tbody>
        {Object.keys(interfacesByType)
          .sort()
          .map((interfaceType) => (
            <InterfacesTypeSection
              key={interfaceType}
              interfaceType={interfaceType}
              interfaces={interfacesByType[interfaceType]}
              nodeNetworkState={nodeNetworkState}
            />
          ))}
      </Tbody>
    </Table>
  );
};

export default InterfacesTable;
