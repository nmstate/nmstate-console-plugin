import React, { FC, memo, useState } from 'react';

import {
  Button,
  ButtonVariant,
  ExpandableSectionToggle,
  List,
  ListItem,
  Tooltip,
} from '@patternfly/react-core';
import { Td, Tr } from '@patternfly/react-table';
import { NodeNetworkConfigurationInterface } from '@types';

import { useDrawerContext } from '../contexts/DrawerContext';

import './interfaces-table.scss';

interface InterfacesTypeSectionProps {
  interfaces: NodeNetworkConfigurationInterface[];
  interfaceType: string;
}

const InterfacesTypeSection: FC<InterfacesTypeSectionProps> = memo(
  ({ interfaceType, interfaces }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const { setSelectedInterface } = useDrawerContext();

    return (
      <>
        <Tr className="interfaces-table__interface-type-row">
          <Td colSpan={6}>
            <ExpandableSectionToggle
              isExpanded={isExpanded}
              onToggle={setIsExpanded}
              className="expandable-section-interface-type"
            >
              {interfaceType}
            </ExpandableSectionToggle>
          </Td>
        </Tr>

        {interfaces.map((iface) => {
          const address = iface.ipv4?.address || iface.ipv6?.address;

          return (
            <Tr key={iface.name} isExpanded={isExpanded}>
              <Td className="pf-m-width-20">
                <Button variant={ButtonVariant.link} onClick={() => setSelectedInterface(iface)}>
                  {iface.name}
                </Button>
              </Td>
              <Td>
                {address ? (
                  <>
                    {address?.[0]?.ip}/{address?.[0]?.['prefix-length']}
                  </>
                ) : (
                  '-'
                )}
              </Td>
              <Td>
                {iface.bridge?.port?.length ? (
                  <Tooltip
                    content={
                      <List isPlain>
                        {iface?.bridge?.port.map((portItem) => (
                          <ListItem key={portItem.name}>{portItem.name}</ListItem>
                        ))}
                      </List>
                    }
                  >
                    <span> {iface?.bridge?.port?.length}</span>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </Td>
              <Td>{iface?.['mac-address'] || '-'}</Td>
              <Td>-</Td>
              <Td>{iface?.mtu || '-'}</Td>
            </Tr>
          );
        })}
      </>
    );
  },
);

InterfacesTypeSection.displayName = 'InterfacesTypeSection';

export default InterfacesTypeSection;
