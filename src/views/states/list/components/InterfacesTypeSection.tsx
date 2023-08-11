import React, { FC, memo, useState } from 'react';

import {
  Button,
  ButtonVariant,
  Checkbox,
  ExpandableSectionToggle,
  List,
  ListItem,
  Tooltip,
} from '@patternfly/react-core';
import { LongArrowAltDownIcon, LongArrowAltUpIcon } from '@patternfly/react-icons';
import { Td, Tr } from '@patternfly/react-table';
import { NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';
import { getPorts } from '@utils/interfaces/getters';

import useDrawerInterface from '../hooks/useDrawerInterface';

import './interfaces-table.scss';

interface InterfacesTypeSectionProps {
  interfaces: NodeNetworkConfigurationInterface[];
  interfaceType: string;
  nodeNetworkState: V1beta1NodeNetworkState;
}

const InterfacesTypeSection: FC<InterfacesTypeSectionProps> = memo(
  ({ interfaceType, interfaces, nodeNetworkState }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const { setSelectedInterfaceName } = useDrawerInterface();

    return (
      <>
        <Tr className="interfaces-table__interface-type-row">
          <Td colSpan={6}>
            <ExpandableSectionToggle
              isExpanded={isExpanded}
              onToggle={setIsExpanded}
              className="expandable-section-interface-type"
              data-test={`${interfaceType}-expandable-section-toggle`}
            >
              {interfaceType}
            </ExpandableSectionToggle>
          </Td>
        </Tr>

        {interfaces.map((iface) => {
          const address = iface.ipv4?.address || iface.ipv6?.address;
          const ports = getPorts(iface);
          const Icon =
            iface.state.toLowerCase() === 'up' ? LongArrowAltUpIcon : LongArrowAltDownIcon;

          return (
            <Tr
              key={iface.name}
              isExpanded={isExpanded}
              className="interfaces-table__interfaces-expandable-row"
            >
              <Td className="interfaces-table__interfaces-expandable-row__column-name">
                <Button
                  variant={ButtonVariant.link}
                  onClick={() => setSelectedInterfaceName(nodeNetworkState, iface)}
                  data-test={`${interfaceType}-${iface.name}-open-drawer`}
                >
                  {iface.name}
                  <Icon className="interfaces-table__interfaces-expandable-row__status-icon" />
                </Button>
              </Td>
              <Td>
                {address?.[0] ? (
                  <>
                    {address?.[0]?.ip}/{address?.[0]?.['prefix-length']}
                  </>
                ) : (
                  '-'
                )}
              </Td>
              <Td>
                {ports?.length ? (
                  <Tooltip
                    content={
                      <List isPlain>
                        {ports.map((port) => (
                          <ListItem key={port}>{port}</ListItem>
                        ))}
                      </List>
                    }
                  >
                    <span>{ports.length}</span>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </Td>
              <Td>{iface?.['mac-address'] || '-'}</Td>
              <Td>
                <Checkbox
                  id={`lldp-enabled-${interfaceType}-${iface.name}`}
                  isDisabled
                  isChecked={iface.lldp?.enabled}
                />
              </Td>
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
