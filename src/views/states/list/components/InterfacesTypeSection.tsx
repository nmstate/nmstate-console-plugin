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
          const Icon =
            iface.state.toLowerCase() === 'up' ? LongArrowAltUpIcon : LongArrowAltDownIcon;

          return (
            <Tr key={iface.name} isExpanded={isExpanded}>
              <Td className="pf-m-width-30">
                <Button variant={ButtonVariant.link} onClick={() => setSelectedInterface(iface)}>
                  {iface.name}
                  <Icon color="black" className="pf-u-mr-sm" />
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
