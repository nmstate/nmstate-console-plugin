import React, { FC } from 'react';

import { Table, TableGridBreakpoint, TableHeader, Tbody } from '@patternfly/react-table';
import { NodeNetworkConfigurationInterface } from '@types';

import useInterfaceColumns from '../hooks/useInterfaceColumns';

import InterfacesTypeSection from './InterfacesTypeSection';

import './interfaces-table.scss';

interface InterfacesTableProps {
  interfacesByType: { [interfaceType in string]: NodeNetworkConfigurationInterface[] };
}

const InterfacesTable: FC<InterfacesTableProps> = ({ interfacesByType }) => {
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
        {Object.keys(interfacesByType).map((interfaceType) => (
          <InterfacesTypeSection
            key={interfaceType}
            interfaceType={interfaceType}
            interfaces={interfacesByType[interfaceType]}
          />
        ))}
      </Tbody>
    </Table>
  );
};

export default InterfacesTable;
