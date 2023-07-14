import React, { FC, useState } from 'react';
import { NodeNetworkStateModelGroupVersionKind } from 'src/console-models';

import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';
import { Button, ButtonVariant, Flex, FlexItem, Popover, Title } from '@patternfly/react-core';
import { ExpandableRowContent, Tbody, Td, Tr } from '@patternfly/react-table';
import { InterfaceType, V1beta1NodeNetworkState } from '@types';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import InterfacesPopoverBody from './InterfacesPopoverBody';
import InterfacesTable from './InterfacesTable';

import './state-row.scss';

const StateRow: FC<RowProps<V1beta1NodeNetworkState, { rowIndex: number }>> = ({
  obj,
  activeColumnIDs,
  rowData: { rowIndex },
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useNMStateTranslation();
  const interfaces = obj?.status?.currentState?.interfaces;

  const interfacesByType = interfaces?.reduce((acc, iface) => {
    // Skip loopback interfaces from the list
    if (iface.type === InterfaceType.LOOPBACK) return acc;

    acc[iface.type] ??= [];
    acc[iface.type].push(iface);
    return acc;
  }, {} as { [key: string]: number });

  return (
    <Tbody key={obj.metadata.name} isExpanded={isExpanded} role="rowgroup" className="state-row">
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
          <Flex flexWrap={{ default: 'wrap' }} className="state-row__flex-interfaces">
            {Object.keys(interfacesByType)?.map((interfaceType) => (
              <FlexItem key={interfaceType}>
                <Popover
                  headerContent={
                    <>
                      {interfaceType} ({interfacesByType[interfaceType].length})
                    </>
                  }
                  bodyContent={(hide) => (
                    <InterfacesPopoverBody
                      interfaces={interfacesByType[interfaceType]}
                      nodeNetworkState={obj}
                      hide={hide}
                    />
                  )}
                  aria-label="Interfaces list"
                >
                  <Button variant={ButtonVariant.link}>
                    {interfaceType} ({interfacesByType[interfaceType].length})
                  </Button>
                </Popover>
              </FlexItem>
            ))}
          </Flex>
        </TableData>
      </Tr>
      <Tr isExpanded={isExpanded} className={`state-row__expanded-${isExpanded}`}>
        <Td colSpan={3}>
          <ExpandableRowContent>
            <Title headingLevel="h2">
              {t('Network details')}
              <small className="pf-u-ml-md">
                {interfaces.length} {t('Interfaces')}
              </small>
            </Title>

            <InterfacesTable interfacesByType={interfacesByType} nodeNetworkState={obj} />
          </ExpandableRowContent>
        </Td>
      </Tr>
    </Tbody>
  );
};

export default StateRow;
